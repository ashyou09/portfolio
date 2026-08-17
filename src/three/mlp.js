/**
 * A small multilayer perceptron with real forward and backward passes.
 *
 * Nothing here is faked for the visual: the weights the hero renders are the
 * weights this trains, the loss it prints is the binary cross-entropy it
 * actually computes, and the decision boundary is this network's own output
 * evaluated over a grid.
 *
 * Architecture is configurable at runtime: 2 inputs, any number of tanh hidden
 * layers, one sigmoid output. Plain SGD, no momentum, no regularisation, so
 * what you see is the bare algorithm.
 */

const tanh = Math.tanh;
const dtanh = (y) => 1 - y * y;
const sigmoid = (z) => 1 / (1 + Math.exp(-z));

function randn() {
  // Box-Muller. Uniform init makes the first frames look dead.
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const ARCHITECTURE_LIMITS = {
  minHiddenLayers: 0,
  maxHiddenLayers: 4,
  minUnits: 2,
  maxUnits: 10,
};

export const DATASETS = {
  circles: {
    label: 'Circles',
    generate(count) {
      const points = [];
      for (let i = 0; i < count; i += 1) {
        const inner = i % 2 === 0;
        const radius = inner ? Math.random() * 0.42 : 0.62 + Math.random() * 0.3;
        const angle = Math.random() * Math.PI * 2;
        points.push({
          x: Math.cos(angle) * radius + (Math.random() - 0.5) * 0.06,
          y: Math.sin(angle) * radius + (Math.random() - 0.5) * 0.06,
          label: inner ? 1 : 0,
        });
      }
      return points;
    },
  },
  spiral: {
    label: 'Spiral',
    generate(count) {
      const points = [];
      for (let i = 0; i < count; i += 1) {
        const arm = i % 2;
        const t = (i / count) * 3.4 + 0.35;
        const angle = t * 2.1 + arm * Math.PI;
        points.push({
          x: Math.cos(angle) * t * 0.28 + (Math.random() - 0.5) * 0.09,
          y: Math.sin(angle) * t * 0.28 + (Math.random() - 0.5) * 0.09,
          label: arm,
        });
      }
      return points;
    },
  },
  xor: {
    label: 'XOR',
    generate(count) {
      const points = [];
      for (let i = 0; i < count; i += 1) {
        const x = (Math.random() - 0.5) * 1.9;
        const y = (Math.random() - 0.5) * 1.9;
        points.push({ x, y, label: x * y > 0 ? 1 : 0 });
      }
      return points;
    },
  },
  moons: {
    label: 'Moons',
    generate(count) {
      const points = [];
      for (let i = 0; i < count; i += 1) {
        const upper = i % 2 === 0;
        const angle = Math.random() * Math.PI;
        const jitter = () => (Math.random() - 0.5) * 0.14;
        points.push(
          upper
            ? {
                x: Math.cos(angle) * 0.7 - 0.3 + jitter(),
                y: Math.sin(angle) * 0.7 - 0.28 + jitter(),
                label: 1,
              }
            : {
                x: -Math.cos(angle) * 0.7 + 0.3 + jitter(),
                y: -Math.sin(angle) * 0.7 + 0.28 + jitter(),
                label: 0,
              }
        );
      }
      return points;
    },
  },
};

export function createNetwork(hidden = [8, 8]) {
  const sizes = [2, ...hidden, 1];
  const layers = [];

  for (let l = 1; l < sizes.length; l += 1) {
    const fanIn = sizes[l - 1];
    const size = sizes[l];
    // Xavier, with the gain tanh wants. The old sqrt(1/fanIn) shrinks the
    // signal a little at every layer, which one or two layers absorb and four
    // do not: by the fourth the activations sit in the flat part of tanh, the
    // gradient that reaches layer one is nothing, and the run never leaves its
    // initial guess. sqrt(2/(fanIn+fanOut)) keeps the variance steady on the
    // way forward and back, and the 5/3 is the correction for tanh's slope.
    const last = l === sizes.length - 1;
    const scale = (last ? 1 : 5 / 3) * Math.sqrt(2 / (fanIn + size));
    layers.push({
      weights: Array.from({ length: size }, () =>
        Array.from({ length: fanIn }, () => randn() * scale)
      ),
      biases: new Array(size).fill(0),
      outputs: new Array(size).fill(0),
      deltas: new Array(size).fill(0),
    });
  }

  return { sizes, layers };
}

export function forward(net, input) {
  let activations = input;

  net.layers.forEach((layer, index) => {
    const last = index === net.layers.length - 1;
    for (let n = 0; n < layer.weights.length; n += 1) {
      let sum = layer.biases[n];
      const row = layer.weights[n];
      for (let w = 0; w < row.length; w += 1) sum += row[w] * activations[w];
      layer.outputs[n] = last ? sigmoid(sum) : tanh(sum);
    }
    activations = layer.outputs;
  });

  return activations[0];
}

/** Gradients above this are clipped. Deep tanh stacks occasionally throw one
 *  enormous delta, and a single one is enough to fling every weight in the
 *  model somewhere it cannot come back from — the boundary goes to noise and
 *  the loss never recovers. */
const CLIP = 2;

/** One SGD step over a shuffled minibatch. Returns mean loss and accuracy. */
export function trainStep(net, points, learningRate = 0.16, batch = 24) {
  let loss = 0;
  let correct = 0;

  // Each layer contributes its own share of the update, so a step that suits
  // one hidden layer overshoots with four. Scaling by sqrt of the depth is
  // what keeps the same dial usable across the whole range the panel offers.
  const rate = learningRate / Math.sqrt(net.layers.length);

  for (let b = 0; b < batch; b += 1) {
    const point = points[Math.floor(Math.random() * points.length)];
    const input = [point.x, point.y];
    const prediction = forward(net, input);

    const clamped = Math.min(Math.max(prediction, 1e-7), 1 - 1e-7);
    loss += -(point.label * Math.log(clamped) + (1 - point.label) * Math.log(1 - clamped));
    if ((prediction > 0.5 ? 1 : 0) === point.label) correct += 1;

    // Output layer: sigmoid with cross-entropy collapses to (p - y).
    const outputLayer = net.layers[net.layers.length - 1];
    outputLayer.deltas[0] = prediction - point.label;

    for (let l = net.layers.length - 2; l >= 0; l -= 1) {
      const layer = net.layers[l];
      const next = net.layers[l + 1];
      for (let n = 0; n < layer.outputs.length; n += 1) {
        let sum = 0;
        for (let m = 0; m < next.deltas.length; m += 1) {
          sum += next.weights[m][n] * next.deltas[m];
        }
        const grad = sum * dtanh(layer.outputs[n]);
        layer.deltas[n] = Math.min(CLIP, Math.max(-CLIP, grad));
      }
    }

    for (let l = 0; l < net.layers.length; l += 1) {
      const layer = net.layers[l];
      const previous = l === 0 ? input : net.layers[l - 1].outputs;
      for (let n = 0; n < layer.weights.length; n += 1) {
        const delta = layer.deltas[n];
        const row = layer.weights[n];
        for (let w = 0; w < row.length; w += 1) {
          row[w] -= rate * delta * previous[w];
        }
        layer.biases[n] -= rate * delta;
      }
    }
  }

  return { loss: loss / batch, accuracy: correct / batch };
}

/** Evaluate the network over a square grid, for the decision-boundary texture. */
export function sampleGrid(net, resolution, extent = 1.15) {
  const values = new Float32Array(resolution * resolution);
  for (let j = 0; j < resolution; j += 1) {
    for (let i = 0; i < resolution; i += 1) {
      const x = (i / (resolution - 1)) * 2 * extent - extent;
      const y = (j / (resolution - 1)) * 2 * extent - extent;
      values[j * resolution + i] = forward(net, [x, y]);
    }
  }
  return values;
}

/** Parameter count, so the panel can show what an added layer actually costs. */
export function countParameters(sizes) {
  let total = 0;
  for (let l = 1; l < sizes.length; l += 1) {
    total += sizes[l] * sizes[l - 1] + sizes[l];
  }
  return total;
}
