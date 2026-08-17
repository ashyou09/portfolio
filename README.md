<div align="center">

# ✦ Ashutosh Singh — Portfolio

**AI / ML Engineer · Agentic Systems · Browser-Native 3D**

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev)
[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)](LICENSE)

A performance-first portfolio featuring **live neural network training in the browser**, an **interactive 3D transformer block**, and a **digital twin of Visakhapatnam Port** — all running in real-time WebGL.

[**View Live →**](https://ashutosh-singh-portfolio.vercel.app)&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;[**Resume**](https://ashutosh-singh-portfolio.vercel.app/resume.pdf)&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;[**LinkedIn**](https://www.linkedin.com/in/ashutosh-singh2024)

</div>

---

## ⚡ Highlights

| Feature | Description |
|:--------|:------------|
| 🧠 **Live MLP Training** | A real 2→N→1 multilayer perceptron trains with SGD directly in the browser. Loss, accuracy, and decision boundary are computed live — not scripted. Network depth and width are editable in real-time. |
| 🔮 **3D Transformer Block** | An interactive, labelled 3D model of a transformer block you can orbit, zoom, and inspect layer by layer. |
| 🚢 **Port Digital Twin** | A trimmed rebuild of the [Visakhapatnam Port Digital Twin](https://github.com/ashyou09/3D-Port-visulaization) — 400+ vehicles driving Catmull-Rom splines through a 24-hour traffic cycle with night/rain states. |
| 🌌 **Black Hole Hero** | A cinematic WebGL black hole with gravitational lensing renders as the hero backdrop. |
| 🎨 **Dot Matrix Portrait** | A dynamic dot-matrix portrait effect rendered on canvas. |
| ✨ **Micro-Interactions** | Magnetic cursor, scroll-reveal animations, film grain overlay, and a tech stack marquee — all powered by Motion. |

---

## 🏗️ Architecture

```
portfolio/
├── public/
│   ├── projects/          # Project screenshots (real product captures)
│   ├── me.jpg             # Portrait photo
│   ├── resume.pdf         # Downloadable resume
│   └── favicon.svg
│
├── src/
│   ├── components/        # Shared UI primitives
│   │   ├── BlackHole.jsx      # WebGL black hole (hero backdrop)
│   │   ├── BrandIcon.jsx      # Dynamic simple-icons resolver
│   │   ├── Cursor.jsx         # Custom magnetic cursor
│   │   ├── DotPortrait.jsx    # Canvas dot-matrix portrait
│   │   ├── Magnetic.jsx       # Magnetic hover wrapper
│   │   ├── Nav.jsx            # Navigation bar
│   │   ├── Reveal.jsx         # Scroll-triggered reveal animation
│   │   ├── SceneBoundary.jsx  # Error boundary for 3D scenes
│   │   └── Footer.jsx
│   │
│   ├── sections/          # Page sections (one component each)
│   │   ├── Hero.jsx           # Landing section with black hole
│   │   ├── StackMarquee.jsx   # Infinite tech stack scroll
│   │   ├── About.jsx          # Bio + education + stats
│   │   ├── Experience.jsx     # Work history timeline
│   │   ├── Work.jsx           # Featured & extended projects
│   │   ├── Network.jsx        # Live neural network playground
│   │   ├── Transformer.jsx    # 3D transformer visualization
│   │   ├── Lab.jsx            # Port digital twin embed
│   │   ├── Certifications.jsx # Credentials & verifications
│   │   └── Contact.jsx        # Contact form / links
│   │
│   ├── three/             # WebGL scenes (React Three Fiber)
│   │   ├── mlp.js             # Pure-JS MLP implementation (forward + backward pass)
│   │   ├── LiveNetwork.jsx    # 3D visualization of the training MLP
│   │   ├── TransformerStack.jsx # Interactive transformer block model
│   │   └── PortTwin.jsx       # Visakhapatnam Port digital twin scene
│   │
│   ├── data/              # Content layer (single source of truth)
│   │   ├── profile.js         # Identity, bio, social links, stats
│   │   ├── experience.js      # Internship history
│   │   ├── projects.js        # Featured & additional projects
│   │   ├── certifications.js  # Credentials with verification links
│   │   └── stack.js           # Tech stack for marquee
│   │
│   ├── styles/            # Stylesheets (one per section + tokens)
│   │   └── tokens.css         # Design tokens & CSS custom properties
│   │
│   ├── App.jsx            # Root layout
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── vite.config.js         # Build config with manual chunk splitting
├── eslint.config.js       # ESLint configuration
└── package.json
```

> **Content is data-driven.** To update anything shown on the page — profile, projects, experience, certifications, tech stack — edit the corresponding file in `src/data/`. The sections read from there, so you never need to touch JSX to update copy.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|:------|:-------------|
| **Framework** | React 19 · Vite 6 |
| **3D / WebGL** | Three.js · React Three Fiber · drei |
| **Animation** | Motion (Framer Motion) |
| **Fonts** | Geist · Geist Mono (Fontsource) |
| **Icons** | Phosphor Icons · Simple Icons |
| **Styling** | Vanilla CSS · Custom design tokens |
| **Linting** | ESLint 9 · eslint-plugin-react |
| **Build** | Rollup manual chunk splitting (three / motion isolated) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/ashyou09/portfolio.git
cd portfolio

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server (hot reload)
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📂 Featured Projects

<table>
<tr>
<td width="50%">

### 🔍 Intelligent Contract Risk Analysis
A **LangGraph agent** that reads contracts, isolates clauses, and flags legal risk. Uses a tuned logistic regression at **0.8859 F1** for scoring — faster and cheaper than LLM grading.

`LangGraph` `Scikit-learn` `Ollama` `Streamlit`

[GitHub](https://github.com/ashyou09/Contract-Risk-Classification) · [Live Demo](https://contract-risk-classification.streamlit.app)

</td>
<td width="50%">

### 🎙️ Interview Agent
A mock-interview tool generating role-specific questions and conducting interviews by voice. Gemini handles generation, Vapi handles calls, LangGraph maintains interview state.

`Next.js` `Gemini API` `Vapi` `LangGraph` `Firebase`

[GitHub](https://github.com/ashyou09/interview-agent) · [Live Demo](https://ai-interview-agent-1974.vercel.app)

</td>
</tr>
<tr>
<td width="50%">

### 🍔 Eats
Full **MERN food-delivery** platform with restaurant discovery, cart scoped to one restaurant with debounce-sync to MongoDB, JWT auth, and order tracking.

`React` `TypeScript` `Node.js` `Express` `MongoDB`

[GitHub](https://github.com/ashyou09/Eats) · [Live Demo](https://eatindia.vercel.app)

</td>
<td width="50%">

### 🚢 Visakhapatnam Port Digital Twin
Browser-native 3D digital twin of the Eastern Arm dry-bulk terminal. **400+ vehicles** drive real Catmull-Rom road splines through a 24-hour cycle.

`Three.js` `React Three Fiber` `drei` `Zustand`

[GitHub](https://github.com/ashyou09/3D-Port-visulaization)

</td>
</tr>
</table>

**More projects:** [BookScan](https://github.com/ashyou09/BOOKSCANS) · [EstateVerse](https://github.com/ashyou09/Realty-AI-Price-Persona-Predictor) · [Photo to JSON](https://github.com/ashyou09/json.convertor) · [Sushi Site](https://github.com/ashyou09/sushi_website_learn_html_css)

---

## 📜 Certifications

| Credential | Issuer | Tracks |
|:-----------|:-------|:-------|
| **Anthropic AI Certifications** | Anthropic | Agent Skills · Claude Coding · API Integration · MCP |
| **Machine Learning Specialization** | Stanford / DeepLearning.AI | Supervised Learning · Advanced Algorithms · Unsupervised Learning |

---

## ⚙️ Build Optimizations

- **Manual Chunk Splitting** — Three.js and React Three Fiber are isolated into a dedicated `three` chunk, and Motion into a `motion` chunk. This keeps the initial page load light while the 3D scenes lazy-load.
- **Code Splitting** — WebGL scenes load on-demand, so users on slower connections see the page content first.
- **Geist Variable Fonts** — Self-hosted via Fontsource for zero layout shift and FOIT-free rendering.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ☕ and curiosity by [Ashutosh Singh](https://github.com/ashyou09)**

[![GitHub](https://img.shields.io/badge/GitHub-ashyou09-181717?style=flat-square&logo=github)](https://github.com/ashyou09)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ashutosh--singh2024-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ashutosh-singh2024)
[![Kaggle](https://img.shields.io/badge/Kaggle-ashyou09-20BEFF?style=flat-square&logo=kaggle)](https://www.kaggle.com/ashyou09)
[![LeetCode](https://img.shields.io/badge/LeetCode-ash__you09-FFA116?style=flat-square&logo=leetcode&logoColor=white)](https://leetcode.com/u/ash_you09/)

</div>
