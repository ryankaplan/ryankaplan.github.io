// Browser helpers
////////////////////////////////////////////////////

function onMouseDown(element, callback) {
  const result = Object.create(null);
  result['mousedown'] = callback; element.addEventListener('mousedown', callback);
  result['touchstart'] = callback; element.addEventListener('touchstart', callback);
  return result;
}

function onMouseMove(element, callback) {
  const result = Object.create(null);
  result['mousemove'] = callback; element.addEventListener('mousemove', callback)
  result['touchmove'] = callback; element.addEventListener('touchmove', callback)
  return result;
}

function onMouseUp(element, callback) {
  const result = Object.create(null);
  result['mouseup'] = callback; element.addEventListener('mouseup', callback);
  result['mouseleave'] = callback; element.addEventListener('mouseleave', callback);
  result['touchend'] = callback; element.addEventListener('touchend', callback);
  return result;
}

function removeEventListeners(element, listeners) {
  for (let key in listeners) {
    const listener = listeners[key];
    element.removeEventListener(key, listener);
  }
}

// Math helpers
////////////////////////////////////////////////////

function sum(numbers) {
	let total = 0
  for (let i = 0; i < numbers.length; i++) {
  	total += numbers[i];
  }
  return total;
}

function multipliedArray(distribution, scaleFactor) {
	const scaled = []
  for (const value of distribution) {
  	scaled.push(value * scaleFactor);
	}
  return scaled;
}

function normalDistribution(numSamples) {
	const result = [];

  for (let i = 0; i < numSamples; i++) {
  	const x = (i / numSamples) * 4 - 2;
    let y = Math.pow(Math.E, - .5 * x * x);
    y /= Math.sqrt(2 * Math.PI);
		result.push(y);
	}

  return result;
}

// Returns a new distribution whose values are between 0 and 1
function normalizedDistribution(distribution) {
	const total = sum(distribution);
  return multipliedArray(distribution, 1 / total);
}

function entropy(distribution) {
  const normalized = normalizedDistribution(distribution);

	let total = 0
  for (let i = 0; i < normalized.length; i++) {
		const p = normalized[i]
    if (p > 0.0001) {
	  	total -= p * Math.log2(p);
		}
  }
  return total;
}

// Application
////////////////////////////////////////////////////

function getHandle(bar) { return bar.children[0]; }
function getProbabilityLabel(bar) { return bar.children[1]; }

// Returns an array of elements that look like this...
//
// <div class="bar">
//   <div class="handleContainer">
//     <div class="handle" />
//     <div class="probabilityLabel" />
//   </div>
// </div>
//
function createBars(barsContainer, numBars) {
	const bars = [];
  for (let i = 0; i < numBars; i++) {
		const bar = document.createElement('div')
    bar.className = 'bar'
		bars.push(bar)
    barsContainer.appendChild(bar)

    const handle = document.createElement('div')
    handle.className = 'handle'
    bar.appendChild(handle)

    const label = document.createElement('div')
    label.className = 'probabilityLabel sans-serif'
    bar.appendChild(label)
  }
  return bars
}

function render(env) {
  const bars = env.bars;
  const distribution = env.distribution;

	if (bars.length !== distribution.length) {
  	throw new Error('Bars and distribution must be the same length')
	}

  const barWidth = env.width / bars.length
 	const distributionTotal = sum(distribution);

	for (let i = 0; i < distribution.length; i++) {
  	const value = distribution[i]
    bars[i].style.width = `${barWidth}px`
		bars[i].style.left = `${i * barWidth}px`;
    bars[i].style.height = `${distribution[i]}px`

    const label = getProbabilityLabel(bars[i]);
    const p = value / distributionTotal;
		label.innerHTML = `p = ${p.toFixed(2)}`;
	}

  const entropyValue = entropy(distribution).toFixed(2);
  env.entropyLabel.innerHTML = `Entropy ${entropyValue}`;
}

function registerMouseHandlers(env) {
  const bars = env.bars;
  const distribution = env.distribution;

  for (let i = 0; i < bars.length; i++) {
    const handle = getHandle(bars[i]);
    (() => {
      let mouseDown = -1;

      onMouseDown(handle, (e) => {
        mouseDown = e.clientY
        render(env)

        const mouseMoveListeners = onMouseMove(document, (e) => {
          if (mouseDown > 0) {
            const diff = mouseDown - e.clientY
            mouseDown = e.clientY;
            distribution[i] += diff;
            distribution[i] = Math.max(0, distribution[i]);
            distribution[i] = Math.min(env.height, distribution[i]);
          }
          render(env)
        })

        const mouseUpListeners = onMouseUp(document, () => {
          mouseDown = -1;
          render(env);

          removeEventListeners(document, mouseMoveListeners);
          removeEventListeners(document, mouseUpListeners);
        })
      })
    })()
  }
}

const env = {
  // Size of container
  height: 400,

  // Number of samples in the distribution
  numSamples: 5,

  // <div /> showing entropy of distribution
  entropyLabel: null,

  // Array of numbers
  distribution: [],

  // Array of <div /> elements
  bars: [],
};

window.onload = () => {
  env.entropyLabel = document.getElementById('entropy-label');

  const barsContainer = document.getElementsByClassName('bars-container')[0]
  const rect = barsContainer.getBoundingClientRect()
  env.width = rect.width;

  barsContainer.style.width = `${env.width}px`
  barsContainer.style.height = `${env.height}px`
  env.bars = createBars(barsContainer, env.numSamples);

  // Start off with a normal distribution
  env.distribution = normalDistribution(env.bars.length);
  env.distribution = multipliedArray(env.distribution, 500);

  registerMouseHandlers(env);
  render(env);
}

