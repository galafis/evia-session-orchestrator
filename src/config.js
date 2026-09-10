export default {
  slug: 'evia-session-orchestrator',
  title: 'Évia Session Orchestrator',
  group: 'Évia',
  color: '#7353ba',
  tagline: {
    en: 'Rehearse consent, pauses and recovery before an interaction begins.',
    pt: 'Ensaie consentimento, pausas e retomadas antes de iniciar uma interação.',
  },
  description:
    'EN: Évia companion prototype for consent-aware session rehearsal. PT: Protótipo complementar à Évia para ensaiar sessões com consentimento, pausas e retomadas.',
  topics: [
    'robotics',
    'human-robot-interaction',
    'accessibility',
    'state-machine',
    'simulation',
    'javascript',
  ],
  setting: {
    key: 'consentTtlMs',
    label: {
      en: 'Consent window (ms)',
      pt: 'Janela de consentimento (ms)',
    },
    min: 1,
    max: 3600000,
    step: 1,
  },
};
