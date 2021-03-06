import React, { Component } from 'react';
import { makeWidthFlexible } from 'react-vis';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Legends from './Legends';
import StaticPlot from './StaticPlot';
import InteractivePlot from './InteractivePlot';
import VoronoiPlot from './VoronoiPlot';
import { createSelector } from 'reselect';
import getSharedPlot from './getSharedPlot';

const VISIBLE_SERIES_COUNT = 5;

export class InnerCustomPlot extends Component {
  state = {
    seriesEnabledState: [],
    isDrawing: false,
    selectionStart: null,
    selectionEnd: null
  };

  getEnabledSeries = createSelector(
    state => state.visibleSeries,
    state => state.seriesEnabledState,
    (visibleSeries, seriesEnabledState) =>
      visibleSeries.filter((serie, i) => !seriesEnabledState[i])
  );

  getSharedPlot = createSelector(
    state => state.series,
    state => state.width,
    getSharedPlot
  );

  getVisibleSeries = createSelector(
    state => state.series,
    series => series.slice(0, VISIBLE_SERIES_COUNT)
  );

  clickLegend = i => {
    this.setState(({ seriesEnabledState }) => {
      const nextSeriesEnabledState = this.props.series.map((value, _i) => {
        const disabledValue = seriesEnabledState[_i];
        return i === _i ? !disabledValue : !!disabledValue;
      });

      return {
        seriesEnabledState: nextSeriesEnabledState
      };
    });
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

  render() {
    const { chartTitle, series, truncateLegends, width } = this.props;

    if (_.isEmpty(series)) {
      return null;
    }

    const hiddenSeriesCount = Math.max(series.length - VISIBLE_SERIES_COUNT, 0);
    const visibleSeries = this.getVisibleSeries({ series });
    const enabledSeries = this.getEnabledSeries({
      visibleSeries,
      seriesEnabledState: this.state.seriesEnabledState
    });
    const sharedPlot = this.getSharedPlot({ series: enabledSeries, width });

    return (
      <div>
        <Legends
          chartTitle={chartTitle}
          truncateLegends={truncateLegends}
          series={visibleSeries}
          hiddenSeriesCount={hiddenSeriesCount}
          clickLegend={this.clickLegend}
          seriesEnabledState={this.state.seriesEnabledState}
        />

        <div style={{ position: 'relative', height: sharedPlot.XY_HEIGHT }}>
          <StaticPlot
            sharedPlot={sharedPlot}
            series={enabledSeries}
            tickFormatY={this.props.tickFormatY}
            tickFormatX={this.props.tickFormatX}
          />

          <InteractivePlot
            sharedPlot={sharedPlot}
            hoverIndex={this.props.hoverIndex}
            series={enabledSeries}
            tickFormatY={this.props.tickFormatY}
            isDrawing={this.state.isDrawing}
            selectionStart={this.state.selectionStart}
            selectionEnd={this.state.selectionEnd}
          />

          <VoronoiPlot
            sharedPlot={sharedPlot}
            series={enabledSeries}
            onHover={this.onHover}
            onMouseLeave={this.onMouseLeave}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
          />
        </div>
      </div>
    );
  }
}

InnerCustomPlot.propTypes = {
  hoverIndex: PropTypes.number,
  onHover: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onSelectionEnd: PropTypes.func.isRequired,
  series: PropTypes.array.isRequired,
  tickFormatY: PropTypes.func,
  truncateLegends: PropTypes.bool,
  width: PropTypes.number.isRequired
};

InnerCustomPlot.defaultProps = {
  tickFormatY: y => y,
  truncateLegends: false
};

export default makeWidthFlexible(InnerCustomPlot);
