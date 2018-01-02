import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import 'react-vis/dist/style.css';
import StatusText from './StatusText';
import Line from './line';
import { AreaSeries, LineSeries, MarkSeries, AbstractSeries } from 'react-vis';

const X_TICK_TOTAL = 7;
class StaticPlot extends AbstractSeries {
  constructor(props) {
    super(props);

    this.seriesDataAtIndex = this.seriesDataAtIndex.bind(this);
    props.regesterSeriesDataCallback(props.name, this.seriesDataAtIndex);
  }

  seriesDataAtIndex = index => {
    return this.props.data[index];
  };

  render() {
    const {
      name,
      data,
      curve,
      hasLineMarks,
      lineMarkColor,
      lineMarkSize,
      onNearestX,
      color,
      ...rest
    } = this.props;

    return (
      <g>
        <AreaSeries
          {...rest}
          key={`${name}-area`}
          curve={curve}
          _opacityValue={0.2}
          color={color}
          data={data}
        />
        <Line
          {...rest}
          key={`${name}`}
          curve={curve}
          onNearestX={onNearestX}
          color={color}
          data={data}
        />
      </g>
    );
  }
}
export default StaticPlot;

StaticPlot.displayName = 'EUIAreaSeries';

StaticPlot.propTypes = {
  ...Line.propTypes
};

StaticPlot.defaultProps = {
  ...Line.defaultProps
};
