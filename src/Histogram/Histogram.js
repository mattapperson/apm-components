import _ from 'lodash';
import React, { PureComponent } from 'react';
import { scaleLinear } from 'd3-scale';
import SingleRect from './SingleRect';
import 'react-vis/dist/style.css';
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalRectSeries,
  Voronoi
} from 'react-vis';
import { getYMax, getXMax, getYMaxRounded } from '../chart_utils';

const XY_MARGIN_LEFT = 50;
const XY_MARGIN_RIGHT = 10;
const XY_MARGIN_TOP = 20;
const XY_HEIGHT = 120;
const XY_WIDTH = 900;
const NUM_OF_X_TICK = 10;

class Histogram extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoveredBucket: null
    };
  }

  onClick = bucket => {
    return this.props.buckets[bucket.i].y > 0 && this.props.onClick(bucket.i);
  };

  onHover = bucket => {
    this.props.buckets[bucket.i].y > 0 &&
      this.setState({ hoveredBucket: bucket });
  };

  onBlur = () => {
    this.setState({ hoveredBucket: null });
  };

  getWithHighlightedBucket(items, selected) {
    return items
      .map((item, i) => {
        if (i === selected) {
          return { ...item, color: '#3360a3' };
        }
        return item;
      })
      .map((item, i) => {
        const padding = (item.x - item.x0) / 20;
        return { ...item, x: item.x - padding, x0: item.x0 + padding, i };
      });
  }

  render() {
    const { buckets, selectedBucket, bucketSize } = this.props;

    if (!buckets) {
      return null;
    }

    const xMax = getXMax(buckets);
    const yMax = getYMax(buckets);
    const yMaxRounded = getYMaxRounded(yMax);
    const yTickValues = [yMaxRounded, yMaxRounded / 2];

    const x = scaleLinear()
      .domain([0, xMax])
      .range([XY_MARGIN_LEFT, XY_WIDTH - XY_MARGIN_RIGHT]);
    const y = scaleLinear().domain([0, yMaxRounded]).range([XY_HEIGHT, 0]);

    return (
      <XYPlot
        onMouseLeave={this.onLeave}
        margin={{ left: XY_MARGIN_LEFT, top: XY_MARGIN_TOP }}
        width={XY_WIDTH}
        height={XY_HEIGHT}
        xDomain={x.domain()}
        yDomain={y.domain()}
      >
        <HorizontalGridLines tickValues={yTickValues} />
        <XAxis
          style={{ strokeWidth: '1px' }}
          marginRight={10}
          tickSizeOuter={10}
          tickSizeInner={0}
          tickTotal={NUM_OF_X_TICK}
        />
        <YAxis
          tickSize={0}
          hideLine
          marginTop={XY_MARGIN_TOP}
          tickValues={yTickValues}
          tickFormat={y => {
            return `${y} reqs.`;
          }}
        />

        {this.state.hoveredBucket
          ? <SingleRect
              x={x(this.state.hoveredBucket.x0)}
              width={x(bucketSize) - x(0)}
              marginTop={XY_MARGIN_TOP}
              style={{
                fill: '#dddddd'
              }}
            />
          : null}

        {Number.isInteger(selectedBucket)
          ? <SingleRect
              x={x(selectedBucket * bucketSize)}
              width={x(bucketSize) - x(0)}
              marginTop={XY_MARGIN_TOP}
              style={{
                fill: 'transparent',
                stroke: 'rgb(172, 189, 220)'
              }}
            />
          : null}

        <VerticalRectSeries
          colorType="literal"
          color="rgb(172, 189, 216)"
          data={this.getWithHighlightedBucket(buckets, selectedBucket)}
          style={{
            rx: '2px',
            ry: '2px'
          }}
        />

        <Voronoi
          extent={[[XY_MARGIN_LEFT, XY_MARGIN_TOP], [XY_WIDTH, XY_HEIGHT]]}
          nodes={this.props.buckets.map(item => ({
            ...item,
            x: (item.x0 + item.x) / 2,
            y: 1
          }))}
          onClick={this.onClick}
          onHover={this.onHover}
          onBlur={this.onBlur}
          x={d => x(d.x)}
          y={d => y(d.y)}
        />
      </XYPlot>
    );
  }
}

export default Histogram;