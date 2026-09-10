import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { run } from '../src/engine.js';
const fixture = () =>
  JSON.parse(readFileSync(new URL('../examples/nominal.json', import.meta.url)));
const event = (atMs, action) => ({ atMs, action });
const simulate = (events, overrides = {}) => run({ ...fixture(), events, ...overrides });

test('pause time does not consume active duration', () => {
  const r = run(fixture());
  assert.equal(r.activeMs, 8000);
  assert.equal(r.finalState, 'completed');
  assert.equal(r.records.at(-1).atMs, 12000);
});
test('start without consent stays idle', () => {
  const r = simulate([event(0, 'start')]);
  assert.equal(r.finalState, 'idle');
  assert.equal(r.activeMs, 0);
  assert.equal(r.records[0].accepted, false);
});
test('consent expiry stops active work at the exact boundary', () => {
  const r = simulate([event(0, 'consent'), event(1000, 'start')], { consentTtlMs: 6000 });
  assert.equal(r.activeMs, 5000);
  assert.equal(r.finalState, 'stopped');
  assert.equal(r.records.at(-1).atMs, 6000);
});
test('renewal before expiry extends the window without restarting activity', () => {
  const r = simulate([event(0, 'consent'), event(1000, 'start'), event(5000, 'consent')], {
    consentTtlMs: 6000,
  });
  assert.equal(r.finalState, 'completed');
  assert.equal(r.records.at(-1).atMs, 9000);
});
test('renewal at expiry cannot revive a stopped session', () => {
  const r = simulate([event(0, 'consent'), event(1000, 'start'), event(6000, 'consent')], {
    consentTtlMs: 6000,
  });
  assert.equal(r.records.at(-1).accepted, false);
  assert.equal(r.finalState, 'stopped');
});
test('ready consent can expire and a new grant can prepare another start', () => {
  const r = simulate([event(0, 'consent'), event(7000, 'consent'), event(7000, 'start')], {
    consentTtlMs: 6000,
    endMs: 8000,
  });
  assert.equal(r.activeMs, 1000);
  assert.equal(r.finalState, 'active');
});
test('session wall-clock limit includes paused time', () => {
  const r = simulate([event(0, 'consent'), event(1000, 'start'), event(2000, 'pause')], {
    maxSessionMs: 5000,
  });
  assert.equal(r.activeMs, 1000);
  assert.equal(r.records.at(-1).atMs, 6000);
  assert.equal(r.finalState, 'stopped');
});
test('withdrawal stops progress immediately', () => {
  const r = simulate([
    event(0, 'consent'),
    event(1000, 'start'),
    event(2000, 'withdraw'),
    event(3000, 'resume'),
  ]);
  assert.equal(r.activeMs, 1000);
  assert.equal(r.finalState, 'stopped');
});
test('withdrawal before starting returns to idle', () => {
  assert.equal(simulate([event(0, 'consent'), event(1000, 'withdraw')]).finalState, 'idle');
});
test('operator finish can end a paused session', () => {
  const r = simulate([
    event(0, 'consent'),
    event(1000, 'start'),
    event(2000, 'pause'),
    event(3000, 'finish'),
  ]);
  assert.equal(r.finalState, 'completed');
  assert.equal(r.activeMs, 1000);
});
test('equal-time events preserve explicit input order', () => {
  assert.equal(simulate([event(0, 'consent'), event(0, 'start')], { endMs: 1 }).activeMs, 1);
  assert.equal(simulate([event(0, 'start'), event(0, 'consent')], { endMs: 1 }).activeMs, 0);
});
test('expiry takes priority over completion at the same time', () => {
  const r = simulate([event(0, 'consent'), event(0, 'start')], { consentTtlMs: 8000 });
  assert.equal(r.finalState, 'stopped');
  assert.equal(r.activeMs, 8000);
});
test('virtual end before completion preserves active state', () => {
  const r = simulate([event(0, 'consent'), event(1000, 'start')], { endMs: 3000 });
  assert.equal(r.finalState, 'active');
  assert.equal(r.activeMs, 2000);
});
test('empty sessions never create consent implicitly', () =>
  assert.equal(simulate([]).finalState, 'idle'));
test('unsorted events are rejected rather than silently reordered', () =>
  assert.throws(() => simulate([event(100, 'consent'), event(0, 'start')]), { code: 'NUMBER' }));
test('events beyond the review clock are rejected', () =>
  assert.throws(() => simulate([event(20000, 'start')]), { code: 'NUMBER' }));
test('zero consent duration is rejected', () =>
  assert.throws(() => simulate([], { consentTtlMs: 0 }), { code: 'NUMBER' }));
test('terminal states stay terminal under every public action', () => {
  for (const action of ['consent', 'start', 'pause', 'resume', 'finish', 'withdraw']) {
    const r = simulate([event(0, 'stop'), event(1, action)]);
    assert.equal(r.finalState, 'stopped');
    assert.equal(r.records.at(-1).accepted, false);
  }
});
