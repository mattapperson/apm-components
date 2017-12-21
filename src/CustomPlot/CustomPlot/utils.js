import { scaleLinear } from 'd3-scale';
import { unit } from '../../variables';

const XY_HEIGHT = unit * 16;
const XY_MARGIN = {
  top: unit,
  left: unit * 5,
  right: unit,
  bottom: unit * 2
};

const getXScale = _.memoize(
  (xMin, xMax, width) => {
    return scaleLinear()
      .domain([xMin, xMax])
      .range([XY_MARGIN.left, width - XY_MARGIN.right]);
  },
  (...args) => args.join('_')
);

const getYScale = _.memoize(
  (yMin, yMax) => {
    return scaleLinear()
      .domain([yMin, yMax])
      .range([XY_HEIGHT, 0])
      .nice();
  },
  (...args) => args.join('_')
);

const getYTickValues = _.memoize(yMaxNice => [0, yMaxNice / 2, yMaxNice]);

export function getTickValues(series, width, height) {
  const allCoordinates = _.flatten(series.map(serie => serie.data));
  const xMin = d3.min(allCoordinates, d => d.x);
  const xMax = d3.max(allCoordinates, d => d.x);
  const yMin = 0;
  const yMax = d3.max(allCoordinates, d => d.y);

  const x = getXScale(xMin, xMax, width);
  const y = getYScale(yMin, yMax);
  const yTickValues = getYTickValues(y.domain()[1]);
  // const xTickValues = getYTickValues(y.domain()[1]);

  return { x, y, yTickValues };
}
