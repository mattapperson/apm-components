import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import 'react-vis/dist/style.css';
import StatusText from './StatusText';
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  AbstractSeries
} from 'react-vis';

const X_TICK_TOTAL = 7;
class EUIBarSeries extends VerticalBarSeries {
  render() {
    const { name, data, color, labelFormat, onNearestX, ...rest } = this.props;

    return (
      <g>
        <VerticalBarSeries
          key={name}
          color={color}
          onNearestX={onNearestX(name)}
          style={{ rx: 2, ry: 2 }}
          data={data}
          {...rest}
        />
      </g>
    );
  }
}
export default EUIBarSeries;

EUIBarSeries.propTypes = {
  name: PropTypes.string.isRequired
};

EUIBarSeries.defaultProps = {
  color: '#3185fc'
};
