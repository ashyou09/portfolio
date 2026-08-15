/**
 * Certifications, newest first. Both entries carry a public verification link.
 */

const certifications = [
  {
    id: 'anthropic',
    issuer: 'Anthropic',
    icon: 'siAnthropic',
    title: 'Anthropic AI Certifications',
    date: 'April 2026',
    tracks: ['Agent Skills', 'Claude Coding', 'API Integration', 'MCP'],
    blurb:
      'Four tracks covering agent design, prompt engineering, Claude workflows and context management for LLM applications.',
    verify: 'https://drive.google.com/drive/folders/1DCbrsvjzLoHsaI0hrZo-jOnvxF8avVhG?usp=drive_link',
  },
  {
    id: 'stanford-ml',
    issuer: 'Stanford University and DeepLearning.AI',
    icon: 'siCoursera',
    title: 'Machine Learning Specialization',
    date: 'May 2025',
    tracks: ['Supervised Learning', 'Advanced Algorithms', 'Unsupervised Learning'],
    blurb:
      'Linear and logistic regression, neural networks, decision trees, clustering, anomaly detection, recommenders and reinforcement learning.',
    verify: 'https://coursera.org/verify/specialization/9SW3BWV2SFGB',
  },
];

export default certifications;
