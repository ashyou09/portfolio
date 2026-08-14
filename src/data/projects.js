/**
 * Projects in two tiers.
 *
 * `featured` - the work a hiring manager should see first. Full deck cards.
 * `more`     - everything else, hidden behind a toggle so the page stays short.
 *
 * Every image is a real screenshot of the running product, in /public/projects.
 */

export const featured = [
  {
    id: 'contract-risk',
    title: 'Intelligent Contract Risk Analysis',
    period: 'February 2026',
    blurb:
      'A LangGraph agent that reads a contract, isolates every clause, and flags the ones that carry legal risk. The routing is agentic, the classification is not: a tuned logistic regression does the scoring at 0.8859 F1, which is faster and far cheaper than asking an LLM to grade every clause.',
    metric: { value: '0.8859', label: 'F1 on held-out clauses' },
    stack: ['LangGraph', 'Scikit-learn', 'Ollama', 'Streamlit', 'Plotly', 'Pandas'],
    image: '/projects/Contract_analysis.png',
    imageAlt: 'Contract risk analysis showing an executive summary and risk distribution charts',
    github: 'https://github.com/ashyou09/Contract-Risk-Classification',
    live: 'https://contract-risk-classification.streamlit.app',
  },
  {
    id: 'vizag-port',
    title: 'Visakhapatnam Port Digital Twin',
    period: '2026',
    blurb:
      'A browser-native 3D digital twin of the Eastern Arm dry-bulk terminal at Visakhapatnam Port. Cranes, quay, warehouses and the Bay of Bengal are modelled in Three.js; four hundred vehicles drive real Catmull-Rom road splines through a twenty-four hour traffic cycle with night and rain states.',
    metric: { value: '400+', label: 'Vehicles simulated live' },
    stack: ['Three.js', 'React Three Fiber', 'drei', 'Postprocessing', 'Zustand'],
    image: null, // the live scene further down this page is the visual
    github: 'https://github.com/ashyou09/3D-Port-visulaization',
    live: null,
    scene: true,
  },
  {
    id: 'interview-agent',
    title: 'Interview Agent',
    period: 'April 2025',
    blurb:
      'A mock-interview tool that generates a question set against a role and then conducts the interview by voice. Gemini handles generation and follow-ups, Vapi handles the call, and LangGraph keeps the interview state coherent between turns.',
    metric: null,
    stack: ['Next.js', 'Gemini API', 'Vapi', 'LangGraph', 'Firebase'],
    image: '/projects/interview_agent.png',
    imageAlt: 'The Interview Agent dashboard listing generated interview sets',
    github: 'https://github.com/ashyou09/interview-agent',
    live: 'https://ai-interview-agent-1974.vercel.app',
  },
  {
    id: 'eats',
    title: 'Eats',
    period: '2026',
    blurb:
      'A full MERN food-delivery platform: restaurant discovery with filtering and pagination, a cart scoped to one restaurant that debounce-syncs to MongoDB, JWT auth against either email or phone, and order tracking. The TypeScript backend is class-based rather than a pile of route handlers.',
    metric: null,
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    image: '/projects/eats.png',
    imageAlt: 'The Eats food delivery home page',
    github: 'https://github.com/ashyou09/Eats',
    live: 'https://eatindia.vercel.app',
  },
];

export const more = [
  {
    id: 'bookscan',
    title: 'BookScan',
    blurb:
      'A personal reading library for PDFs and textbooks. Custom canvas PDF engine, webtoon and single-page modes, reading position synced to the exact page across devices.',
    stack: ['Next.js', 'MongoDB', 'Zustand', 'pdfjs-dist'],
    image: '/projects/bookscan.png',
    github: 'https://github.com/ashyou09/BOOKSCANS',
    live: 'https://bookscans.vercel.app',
  },
  {
    id: 'estateverse',
    title: 'EstateVerse',
    blurb: 'Full-stack property price and buyer-persona predictor served from a FastAPI model.',
    stack: ['React', 'FastAPI', 'Scikit-learn', 'MongoDB'],
    image: '/projects/Estate.png',
    github: 'https://github.com/ashyou09/Realty-AI-Price-Persona-Predictor',
    live: 'https://realestate-ml-model.vercel.app/',
  },
  {
    id: 'photo-json',
    title: 'Photo to JSON',
    blurb: 'Pulls text out of an uploaded image and returns it as structured JSON.',
    stack: ['React', 'OCR'],
    image: '/projects/photo-json.png',
    github: 'https://github.com/ashyou09/json.convertor',
    live: 'https://ashyou09.github.io/json.convertor/',
  },
  {
    id: 'sushi',
    title: 'Japanese Sushi Site',
    blurb: 'An early hand-written CSS build, kept because the motion work still holds up.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: '/projects/sushi.png',
    github: 'https://github.com/ashyou09/sushi_website_learn_html_css',
    live: 'https://japanese-sushi-website.netlify.app/',
  },
];
