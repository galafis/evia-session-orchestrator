import {
  base,
  number,
  integer,
  list,
  object,
  choice,
  requireThat,
  metric,
  finding,
  report,
} from './validation.js';

export const ACTIONS = ['consent', 'start', 'pause', 'resume', 'finish', 'stop', 'withdraw'];

export function validate(input) {
  base(input, ['consentTtlMs', 'activityMs', 'maxSessionMs', 'endMs', 'events']);
  integer(input.consentTtlMs, 'consentTtlMs', 1, 3600000);
  integer(input.activityMs, 'activityMs', 1, 3600000);
  integer(input.maxSessionMs, 'maxSessionMs', 1, 86400000);
  integer(input.endMs, 'endMs', 0, 86400000);
  list(input.events, 'events', 0, 10000);
  let previous = 0;
  input.events.forEach((event, index) => {
    object(event, `events[${index}]`, ['atMs', 'action']);
    integer(event.atMs, 'atMs', previous, input.endMs);
    choice(event.action, 'action', ACTIONS);
    previous = event.atMs;
  });
  return input;
}

/** A virtual clock makes pauses, expiry and equal-time ordering reproducible. */
export function run(input) {
  validate(input);
  const records = [],
    findings = [];
  let state = 'idle',
    now = 0,
    consentUntil = null,
    startedAt = null,
    activeMs = 0;
  const terminal = () => state === 'stopped' || state === 'completed';
  const append = (action, next, accepted, code = action.toUpperCase()) => {
    records.push({ atMs: now, action, from: state, to: next, accepted, code, activeMs });
    state = next;
  };
  const advance = (target) => {
    while (now <= target) {
      const deadlines = [];
      if (!terminal() && consentUntil !== null)
        deadlines.push({ time: consentUntil, priority: 0, type: 'consent-expired' });
      if (!terminal() && startedAt !== null)
        deadlines.push({
          time: startedAt + input.maxSessionMs,
          priority: 1,
          type: 'session-timeout',
        });
      if (state === 'active')
        deadlines.push({
          time: now + input.activityMs - activeMs,
          priority: 2,
          type: 'activity-complete',
        });
      deadlines.sort((a, b) => a.time - b.time || a.priority - b.priority);
      const next = deadlines[0];
      if (!next || next.time > target) {
        if (state === 'active') activeMs += target - now;
        now = target;
        return;
      }
      if (state === 'active') activeMs += next.time - now;
      now = next.time;
      if (next.type === 'consent-expired') {
        consentUntil = null;
        append(next.type, startedAt === null ? 'idle' : 'stopped', true);
        findings.push(
          finding(
            'warning',
            'CONSENT_EXPIRED',
            'Consent expired on the virtual clock.',
            'O consentimento expirou no relógio virtual.',
            { atMs: now },
          ),
        );
      } else if (next.type === 'session-timeout') {
        append(next.type, 'stopped', true);
        findings.push(
          finding(
            'warning',
            'SESSION_TIMEOUT',
            'The session reached its wall-clock limit.',
            'A sessão atingiu seu limite de tempo total.',
            { atMs: now },
          ),
        );
      } else append(next.type, 'completed', true);
      if (now === target) return;
    }
  };
  for (const event of input.events) {
    advance(event.atMs);
    const allowed = {
      consent: !terminal(),
      start: state === 'ready',
      pause: state === 'active',
      resume: state === 'paused' && consentUntil !== null && now < consentUntil,
      finish: state === 'active' || state === 'paused',
      stop: !terminal(),
      withdraw: !terminal(),
    };
    if (!allowed[event.action]) {
      append(event.action, state, false, 'INVALID_TRANSITION');
      findings.push(
        finding(
          'warning',
          'INVALID_TRANSITION',
          `Rejected ${event.action} in ${state}.`,
          `Ação ${event.action} rejeitada no estado ${state}.`,
          { atMs: now },
        ),
      );
      continue;
    }
    if (event.action === 'consent') {
      consentUntil = now + input.consentTtlMs;
      append(event.action, state === 'idle' ? 'ready' : state, true);
    } else if (event.action === 'start') {
      startedAt = now;
      append(event.action, 'active', true);
    } else if (event.action === 'pause') append(event.action, 'paused', true);
    else if (event.action === 'resume') append(event.action, 'active', true);
    else if (event.action === 'finish') append(event.action, 'completed', true);
    else {
      consentUntil = null;
      append(
        event.action,
        event.action === 'withdraw' && startedAt === null ? 'idle' : 'stopped',
        true,
      );
    }
  }
  advance(input.endMs);
  return report(
    input,
    'evia-session-orchestrator',
    [
      metric('activeMs', 'Active time', 'Tempo ativo', activeMs, 'ms'),
      metric(
        'accepted',
        'Accepted actions',
        'Ações aceitas',
        records.filter((r) => r.accepted).length,
      ),
      metric(
        'rejected',
        'Rejected actions',
        'Ações rejeitadas',
        records.filter((r) => !r.accepted).length,
      ),
      metric('finalState', 'Final state', 'Estado final', state),
    ],
    findings,
    records,
    { finalState: state, activeMs, consentUntil, startedAt, endMs: input.endMs },
  );
}
