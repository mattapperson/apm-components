import React, { PureComponent } from 'react';
import d3 from 'd3';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { scaleLinear } from 'd3-scale';
import SingleRect from './SingleRect';
import 'react-vis/dist/style.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalRectSeries,
  Voronoi,
  makeWidthFlexible
} from 'react-vis';
import { colors } from '../variables';

const XY_HEIGHT = 120;
const XY_MARGIN = {
  top: 20,
  left: 50,
  right: 10
};

const X_TICK_TOTAL = 10;

class Histogram extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoveredBucket: null
    };
  }

  onClick = bucket => {
    if (bucket.y > 0) {
      this.props.onClick(bucket);
    }
  };

  onHover = bucket => {
    if (bucket.y > 0) {
      this.setState({ hoveredBucket: bucket });
    }
  };

  onBlur = () => {
    this.setState({ hoveredBucket: null });
  };

  getChartData(items, transactionId) {
    return items
      .map(item => ({
        ...item,
        color: item.transactionId === transactionId ? colors.blue1 : undefined
      }))
      .map(item => {
        const padding = (item.x - item.x0) / 20;
        return { ...item, x: item.x - padding, x0: item.x0 + padding };
      });
  }

  render() {
    const { buckets, transactionId, bucketSize, width: XY_WIDTH } = this.props;
    if (_.isEmpty(buckets) || XY_WIDTH === 0) {
      return null;
    }

    const selectedBucket =
      transactionId &&
      buckets.find(bucket => bucket.transactionId === transactionId);

    const xMin = d3.min(buckets, d => d.x0);
    const xMax = d3.max(buckets, d => d.x);
    const yMin = 0;
    const yMax = d3.max(buckets, d => d.y);
    const chartData = this.getChartData(buckets, transactionId);

    const x = scaleLinear()
      .domain([xMin, xMax])
      .range([XY_MARGIN.left, XY_WIDTH - XY_MARGIN.right]);
    const y = scaleLinear()
      .domain([yMin, yMax])
      .range([XY_HEIGHT, 0])
      .nice();

    const yDomainNice = y.domain();
    const yTickValues = [0, yDomainNice[1] / 2, yDomainNice[1]];

    return (
      <XYPlot
        xType={this.props.xType}
        width={XY_WIDTH}
        height={XY_HEIGHT}
        margin={XY_MARGIN}
        xDomain={x.domain()}
        yDomain={y.domain()}
      >
        <HorizontalGridLines tickValues={yTickValues} />
        <XAxis
          style={{ strokeWidth: '1px' }}
          marginRight={10}
          tickSizeOuter={10}
          tickSizeInner={0}
          tickTotal={X_TICK_TOTAL}
        />
        <YAxis
          tickSize={0}
          hideLine
          tickValues={yTickValues}
          tickFormat={this.props.formatYValue}
        />
        {this.state.hoveredBucket && (
          <SingleRect
            x={x(this.state.hoveredBucket.x0)}
            width={x(bucketSize) - x(0)}
            style={{
              fill: colors.gray4
            }}
          />
        )}
        {selectedBucket && (
          <SingleRect
            x={x(selectedBucket.x0)}
            width={x(bucketSize) - x(0)}
            style={{
              fill: 'transparent',
              stroke: 'rgb(172, 189, 220)'
            }}
          />
        )}
        <VerticalRectSeries
          colorType="literal"
          color="rgb(172, 189, 216)"
          data={chartData}
          style={{
            rx: '2px',
            ry: '2px'
          }}
        />
        <Voronoi
          extent={[[XY_MARGIN.left, XY_MARGIN.top], [XY_WIDTH, XY_HEIGHT]]}
          nodes={this.props.buckets.map(item => ({
            ...item,
            x: (item.x0 + item.x) / 2
          }))}
          onClick={this.onClick}
          onHover={this.onHover}
          onBlur={this.onBlur}
          x={d => x(d.x)}
          y={() => 1}
        />
      </XYPlot>
    );
  }
}

Histogram.propTypes = {
  width: PropTypes.number.isRequired,
  transactionId: PropTypes.string,
  bucketSize: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  buckets: PropTypes.array.isRequired,
  xType: PropTypes.string,
  formatYValue: PropTypes.func
};

Histogram.defaultProps = {
  onClick: () => {},
  xType: 'linear'
};

export default makeWidthFlexible(Histogram);
