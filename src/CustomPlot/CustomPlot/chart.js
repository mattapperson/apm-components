import React, { PureComponent } from 'react';
import {
  makeWidthFlexible,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  AreaSeries,
  Crosshair
} from 'react-vis';
import PropTypes from 'prop-types';
import d3 from 'd3';
import _ from 'lodash';
import { XYPlot } from 'react-vis';
import { createSelector } from 'reselect';

import Legends from './Legends';
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
    crosshairValues: []
  };

  getSVGPlot = _.memoize(
    (x, y, width) => {
      function XYPlotWrapper({ children, data }) {
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

  _onMouseLeave() {
    this.setState({ crosshairValues: [] });
  }

  _onNearestX = name => value => {
    console.log(name, value);
    //this.setState({ crosshairValues: DATA.map(d => d[index]) });
  };
  recursiveMap(children, fn) {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }

      if (child.props.children) {
        child = React.cloneElement(child, {
          children: recursiveMap(child.props.children, fn)
        });
      }

      return fn(child);
    });
  }
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
              onMouseLeave={this._onMouseLeave}
              width={width}
              animation={true}
              height={XY_HEIGHT}
              margin={XY_MARGIN}
              xType="time"
              xDomain={x.domain()}
              yDomain={y.domain()}
            >
              <HorizontalGridLines
                tickValues={yTickValues}
                style={{ strokeDasharray: '5 5' }}
              />
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
              {React.Children.map(this.props.children, (child, i) =>
                React.cloneElement(child, {
                  SVGPlot: this.getSVGPlot(x, y, width),
                  onNearestX: this._onNearestX,
                  id: `chart-${i}`
                })
              )}
              <Crosshair values={this.state.crosshairValues} />
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
