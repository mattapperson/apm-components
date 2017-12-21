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
  AreaSeries
} from 'react-vis';

const X_TICK_TOTAL = 7;
class StaticPlot extends Component {
  render() {
    const {series, SVGPlot} = this.props
  console.log(series)

    return (
      <SVGPlot>
        <LineSeries
            key={this.props.id}
            xType="time"
            curve={'curveMonotoneX'}
            data={series.data}
            color={series.color}
          />
      </SVGPlot>
    )
  }
}
export default StaticPlot;

StaticPlot.propTypes = {
  //series: PropTypes.object.isRequired
};
