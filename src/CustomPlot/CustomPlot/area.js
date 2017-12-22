import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import 'react-vis/dist/style.css';
import StatusText from './StatusText';
import Line from './line'
import {
  AreaSeries,
  LineSeries,
  MarkSeries
} from 'react-vis';

const X_TICK_TOTAL = 7;
class StaticPlot extends Component {
  render() {
    const {data, opacity, SVGPlot, curve, hasLineMarks, lineMarkColor, lineMarkSize, color} = this.props

    return (
      <SVGPlot>
        <AreaSeries
          key={`${this.props.id}-area`}
          curve={curve}
          opacity={opacity}
          color={color}
          data={data}
        />
        <LineSeries
            key={`${this.props.id}-line`}
            xType="time"
            curve={curve}
            data={data}
            color={color}
          />
          {hasLineMarks && (
            <MarkSeries 
              data={data}
              color={lineMarkColor}
              size={lineMarkSize}
            />
          )}
      </SVGPlot>
    )
  }
}
export default StaticPlot;

StaticPlot.propTypes = {
  ...Line.propTypes,
  opacity: PropTypes.number

  
};

StaticPlot.defaultProps = {
  ...Line.defaultProps,
  opacity: 0.7
};

