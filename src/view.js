import { svg, label, esc, fmt, states, text } from './ui.js';
export const interpretation = {
  en: 'This virtual-clock rehearsal models explicit decisions. It does not infer consent, operate a robot, or establish that an interaction is appropriate for a participant.',
  pt: 'Este ensaio com relógio virtual modela decisões explícitas. Ele não infere consentimento, não opera um robô nem determina se uma interação é adequada para um participante.',
};
export const cursorMax = (r) => r.endMs;
export function render(r, lang, cursor) {
  const order = ['idle', 'ready', 'active', 'paused', 'stopped', 'completed'];
  const x = (t) => 120 + (t / Math.max(1, r.endMs)) * 610;
  const y = (state) => 42 + order.indexOf(state) * 39;
  let content = order
    .map(
      (s) =>
        `<line class="axis" x1="115" y1="${y(s)}" x2="735" y2="${y(s)}"/>${label(12, y(s) + 4, states[s][lang])}`,
    )
    .join('');
  let state = 'idle',
    path = `M ${x(0)} ${y(state)}`;
  for (const event of r.records) {
    path += ` H ${x(event.atMs)} V ${y(event.to)}`;
    state = event.to;
  }
  path += ` H ${x(r.endMs)}`;
  content += `<path class="series" d="${path}"/>`;
  for (const event of r.records.slice(0, 100))
    content += `<circle class="point" cx="${x(event.atMs)}" cy="${y(event.to)}" r="${event.accepted ? 4 : 6}" ${event.accepted ? '' : 'style="fill:#b14044"'}/>`;
  content += `<line x1="${x(cursor)}" x2="${x(cursor)}" y1="24" y2="255" stroke="#203b4e" stroke-dasharray="5 5"/>${label(120, 283, '0 ms')}${label(720, 283, `${fmt(r.endMs, lang, 0)} ms`, 'text-anchor="end"')}`;
  const at = r.records.filter((e) => e.atMs <= cursor).at(-1);
  return (
    svg(
      content,
      text('Session state over virtual time', 'Estado da sessão ao longo do tempo virtual', lang),
    ) +
    `<p class="visual-note"><strong>${esc(states[at?.to ?? 'idle'][lang])}</strong> · ${esc(fmt(cursor, lang, 0))} ms. ${esc(text('Dashed line: review cursor. Rejected actions never advance the state.', 'Linha tracejada: posição de revisão. Ações rejeitadas não alteram o estado.', lang))}</p>`
  );
}
