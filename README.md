# Ashutosh Singh — Portfolio

Personal portfolio built around two things that actually run: a small neural
network training live in the browser, with a real forward and backward pass
you can rebuild and resize, and a transformer block you can turn over and
inspect part by part. Everything else on the page (experience, projects,
certifications) is pulled from a plain data layer in `src/data/`.

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Motion](https://motion.dev/) for page animation
- [Three.js](https://threejs.org/) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for the two 3D scenes
- [Phosphor Icons](https://phosphoricons.com/) and [Simple Icons](https://simpleicons.org/) for iconography
- Plain CSS with a small token system in `src/styles/tokens.css`, no framework

## Structure

```
src/
  data/          content: profile, experience, projects, certifications, tech stack
  sections/      one component per page section
  three/         the WebGL scenes (live-training network, transformer, port digital twin)
  components/    shared UI (nav, cursor, reveal-on-scroll, brand icons)
  styles/        one stylesheet per section/component, plus tokens.css
```

To update the content shown on the page, edit the files in `src/data/` — the
sections read from there rather than hard-coding copy.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run lint     # eslint
```

## Notes

- The hero network (`src/three/mlp.js` + `src/three/LiveNetwork.jsx`) runs a
  real 2-N-1 multilayer perceptron trained with plain SGD. The loss, accuracy
  and decision boundary shown are computed, not scripted, and the network's
  size and depth can be edited live from the panel.
- The transformer section (`src/three/TransformerStack.jsx`) is a labelled
  3D model of a transformer block, built to be handled rather than just read.
- The 3D Lab section runs a trimmed rebuild of a separate project, the
  [Visakhapatnam Port Digital Twin](https://github.com/ashyou09/3D-Port-visulaization).
