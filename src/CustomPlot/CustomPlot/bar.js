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
} from 'react-vis';

const X_TICK_TOTAL = 7;
class StaticPlot extends Component {
  render() {
    const {data, color, SVGPlot, labelFormat} = this.props

    return (
      <SVGPlot>
        <VerticalBarSeries
          key={this.props.id}
          color={color}
          data={data}
        />
      </SVGPlot>
    )
  }
}
export default StaticPlot;

StaticPlot.propTypes = {

};

StaticPlot.defaultProps = {

};
