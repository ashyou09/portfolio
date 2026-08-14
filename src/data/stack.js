/**
 * Tech marquee. Slugs are simple-icons export names, resolved at render time
 * so a missing icon degrades to a wordmark instead of throwing.
 */

const stack = [
  { slug: 'siPython', name: 'Python' },
  { slug: 'siTypescript', name: 'TypeScript' },
  { slug: 'siLangchain', name: 'LangChain' },
  { slug: 'siAnthropic', name: 'Anthropic' },
  { slug: 'siScikitlearn', name: 'scikit-learn' },
  { slug: 'siTensorflow', name: 'TensorFlow' },
  { slug: 'siHuggingface', name: 'Hugging Face' },
  { slug: 'siOllama', name: 'Ollama' },
  { slug: 'siPandas', name: 'pandas' },
  { slug: 'siNumpy', name: 'NumPy' },
  { slug: 'siThreedotjs', name: 'Three.js' },
  { slug: 'siReact', name: 'React' },
  { slug: 'siNextdotjs', name: 'Next.js' },
  { slug: 'siNodedotjs', name: 'Node.js' },
  { slug: 'siDocker', name: 'Docker' },
  { slug: 'siStreamlit', name: 'Streamlit' },
  { slug: 'siMongodb', name: 'MongoDB' },
  { slug: 'siSupabase', name: 'Supabase' },
  { slug: 'siFirebase', name: 'Firebase' },
  { slug: 'siMysql', name: 'MySQL' },
  { slug: 'siGit', name: 'Git' },
  { slug: 'siVercel', name: 'Vercel' },
];

export default stack;
