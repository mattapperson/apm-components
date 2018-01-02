import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import 'react-vis/dist/style.css';
import StatusText from './StatusText';
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  AbstractSeries
} from 'react-vis';

const X_TICK_TOTAL = 7;
class EUILineSeries extends AbstractSeries {
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
      data,
      name,
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
        <LineSeries
          {...rest}
          key={`${name}-border`}
          xType="time"
          curve={curve}
          data={data}
          opacity={1}
          style={{ strokeWidth: 4 }}
          _colorValue={'white'}
        />
        <LineSeries
          {...rest}
          key={name}
          xType="time"
          curve={curve}
          data={data}
          opacity={1}
          style={{ strokeWidth: 2 }}
          color={color}
        />

        {hasLineMarks && (
          <MarkSeries
            {...rest}
            key={`${name}-mark`}
            data={data}
            color={color || lineMarkColor}
            onNearestX={onNearestX}
            size={lineMarkSize}
            stroke={'white'}
            opacity={1}
            strokeWidth={2}
          />
        )}
      </g>
    );
  }
}
export default EUILineSeries;
EUILineSeries.displayName = 'EUILineSeries';

EUILineSeries.propTypes = {
  name: PropTypes.string,
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  curve: PropTypes.string,
  hasLineMarks: PropTypes.bool,
  lineMarkColor: PropTypes.string,
  lineMarkSize: PropTypes.number
};

EUILineSeries.defaultProps = {
  color: '#3185fc',
  curve: 'linear',
  hasLineMarks: true,
  lineMarkSize: 5
};
