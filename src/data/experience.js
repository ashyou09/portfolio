/**
 * Internships, newest first. The SWOT Automations role is ongoing, so its
 * `period` ends in "Present"; give it an end date when the internship wraps.
 */

const experience = [
  {
    id: 'swot',
    company: 'SWOT Automations',
    role: 'AI & Mobile Development Intern',
    period: 'Jun 2026 - Present',
    mode: 'Ongoing',
    summary:
      'Split between React Native product work and a 3D visualisation track, with client-facing scope conversations on the side.',
    highlights: [
      'Built and shipped mobile features in React Native across the 4Paws marketplace apps, including a vendor-side build.',
      'Took the 3D visualisation track: modelled and rendered interactive scenes in Three.js, using Claude to move from geometry sketches to running code.',
      'Worked through the full Claude curriculum alongside the build, which is where the four Anthropic certifications in Agent Skills, Claude Coding, API Integration and MCP came from.',
      'Sat in on client calls, translated loose requirements into scoped tickets, and learned how delivery timelines actually get negotiated.',
    ],
    stack: ['React Native', 'Three.js', 'Claude', 'MCP', 'Node.js'],
  },
  {
    id: 'mentorship',
    company: 'Mentorship Project',
    role: 'Full-Stack Mobile Development Intern',
    period: 'May 2025 - Jul 2025',
    mode: 'Remote',
    summary:
      'An intelligent receipt digitisation platform for automated expense tracking, built with a small distributed team.',
    highlights: [
      'Developed the image-processing pipeline in Node.js and Sharp, compressing receipt captures before storage.',
      'Integrated Keycloak for authentication and session handling across the mobile client.',
      'Managed the Docker-based service topology so the team could run the whole stack locally.',
    ],
    stack: ['React Native', 'Node.js', 'TypeScript', 'Docker', 'Keycloak'],
  },
];

export default experience;
