/**
 * Single source of truth for identity, contact and social links.
 * Every value here comes from the resume PDF (Aug 2026 revision).
 */

const profile = {
  name: 'Ashutosh Singh',
  role: 'AI / ML Engineer',
  email: 'ashutosh.singh2024@nst.rishihood.edu.in',
  location: 'India',

  // Hero copy. Keep the headline at 4 words and the subtext under 20 words.
  headline: ['I build agentic', 'AI systems.'],
  subtext:
    'B.Tech Artificial Intelligence student at Newton School of Technology, working across LLM agents, applied ML and 3D simulation.',

  // About section
  about: [
    'I work where reinforcement learning and large language models meet. Most of what I build is agentic: multi-node LangGraph pipelines, retrieval and tool-use workflows, and classical ML models doing the parts that do not need a transformer.',
    'Alongside that I ship product. Two internships taught me the unglamorous half of engineering, containers, auth, image pipelines and talking to clients about scope.',
  ],

  education: {
    degree: 'B.Tech, Artificial Intelligence',
    school: 'Newton School of Technology, Rishihood University',
    period: '2024 - 2028',
    grade: '8.1 / 10.0 CGPA',
  },

  // Numbers shown in the profile rail. All verifiable from the resume or a live link.
  stats: [
    { value: '0.8859', label: 'F1 score, contract risk classifier' },
    { value: '8.1', label: 'CGPA, B.Tech Artificial Intelligence' },
    { value: '5', label: 'Anthropic and Stanford certifications' },
    { value: '2', label: 'Engineering internships shipped' },
  ],

  social: {
    github: 'https://github.com/ashyou09',
    linkedin: 'https://www.linkedin.com/in/ashutosh-singh2024',
    kaggle: 'https://www.kaggle.com/ashyou09',
    leetcode: 'https://leetcode.com/u/ash_you09/',
    codechef: 'https://www.codechef.com/users/glam_coyote_71',
  },

  resume: '/resume.pdf',
};

export default profile;
