import React, { PureComponent } from 'react';
import {
  makeWidthFlexible,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  AreaSeries
} from 'react-vis';
import PropTypes from 'prop-types';
import d3 from 'd3';
import _ from 'lodash';
import { XYPlot } from 'react-vis';
import { createSelector } from 'reselect';

import Legends from './Legends';
import StaticPlot from './StaticPlot';
import InteractivePlot from './InteractivePlot';
import VoronoiPlot from './VoronoiPlot';
import { unit } from '../../variables';

const VISIBLE_SERIES = 5;
const XY_HEIGHT = unit * 16;
const XY_MARGIN = {
  top: unit,
  left: unit * 5,
  right: unit,
  bottom: unit * 2
};
const topSeries = createSelector(
  props => props.series,
  series => series.slice(0, VISIBLE_SERIES)
);

const getEnabledSeries = (props, seriesVisibility) => {
  return topSeries(props).filter((serie, i) => !seriesVisibility[i]);
};

const X_TICK_TOTAL = 7;
export class InnerCustomPlot extends PureComponent {
  state = {
    isDrawing: false,
    selectionStart: null,
    selectionEnd: null
  };

  onMouseLeave = (...args) => {
    if (this.state.isDrawing) {
      this.setState({ isDrawing: false });
    }
    this.props.onMouseLeave(...args);
  };

  onMouseDown = node =>
    this.setState({
      isDrawing: true,
      selectionStart: node.x,
      selectionEnd: null
    });

  onMouseUp = () => {
    if (this.state.selectionEnd !== null) {
      const [start, end] = [
        this.state.selectionStart,
        this.state.selectionEnd
      ].sort();
      this.props.onSelectionEnd({ start, end });
    }
    this.setState({ isDrawing: false });
  };

  onHover = node => {
    const index = this.props.series[0].data.findIndex(
      item => item.x === node.x
    );
    this.props.onHover(index);

    if (this.state.isDrawing) {
      this.setState({ selectionEnd: node.x });
    }
  };

  clickLegend = i => {};

  getSVGPlot = _.memoize(
    (x, y, width) => {
      function XYPlotWrapper({children}) {
        return (
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <XYPlot
              dontCheckIfEmpty
              width={width}
              animation={true}
              height={XY_HEIGHT}
              margin={XY_MARGIN}
              xType="time"
              xDomain={x.domain()}
              yDomain={y.domain()}
            >
              {children}
            </XYPlot>
          </div>
        );
      }

      return XYPlotWrapper;
    },
    (x, y, width) => [...x.domain(), ...y.domain(), width].join('_')
  );


  render() {
    var {
      chartTitle,
      width,
      tickFormatX,
      tickFormatY,
      yTickValues,
      truncateLegends,
      children,
      x,
      y
    } = this.props;

    // <Legends
    //   chartTitle={chartTitle}
    //   truncateLegends={truncateLegends}
    //   series={series}
    //   hiddenSeries={hiddenSeries}
    //   clickLegend={this.clickLegend}
    //   seriesVisibility={this.state.seriesVisibility}
    // />;
    return (
      <div>
        <div style={{ position: 'relative', height: XY_HEIGHT }}>
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <XYPlot
              dontCheckIfEmpty
              width={width}
              height={XY_HEIGHT}
              margin={XY_MARGIN}
              xType="time"
              xDomain={x.domain()}
              yDomain={y.domain()}
            >
              <HorizontalGridLines tickValues={yTickValues} />
              <XAxis
                tickSize={0}
                tickTotal={X_TICK_TOTAL}
                tickFormat={tickFormatX}
              />
              <YAxis
                tickSize={0}
                tickValues={yTickValues}
                tickFormat={tickFormatY}
              />
              {React.Children.map(this.props.children, ((child, i) => React.cloneElement(child, { 
                SVGPlot: this.getSVGPlot(x, y, width),
                id:`chart-${i}`
              })))}
            </XYPlot>
          </div>
        </div>
      </div>
    );
  }
}

InnerCustomPlot.propTypes = {
  width: PropTypes.number.isRequired,
  onHover: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onSelectionEnd: PropTypes.func.isRequired,
  hoverIndex: PropTypes.number,
  tickFormatY: PropTypes.func,
  truncateLegends: PropTypes.bool
};

InnerCustomPlot.defaultProps = {
  tickFormatY: y => y,
  truncateLegends: false
};

export default makeWidthFlexible(InnerCustomPlot);
