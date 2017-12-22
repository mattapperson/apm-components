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
  MarkSeries
} from 'react-vis';

const X_TICK_TOTAL = 7;
class StaticPlot extends Component {
  render() {
    const {data, SVGPlot, curve, hasLineMarks, lineMarkColor, lineMarkSize, color} = this.props

    return (
      <SVGPlot>
        <LineSeries
              key={`${this.props.id}-border`}
              xType="time"
              curve={curve}
              data={data}
              style={{strokeWidth: 4}}
              color={'white'}
            />
          <LineSeries
              key={this.props.id}
              xType="time"
              curve={curve}
              data={data}
              style={{strokeWidth: 2}}
              color={color}
            />
        
          {hasLineMarks && (
              <MarkSeries 
                data={data}
                color={color || lineMarkColor}
                size={lineMarkSize}
                stroke={'white'}
                strokeWidth={2}
              />
          )}
      </SVGPlot>
    )
  }
}
export default StaticPlot;

StaticPlot.propTypes = {
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  curve: PropTypes.string,
  hasLineMarks: PropTypes.bool,
  lineMarkColor:PropTypes.string,
  lineMarkSize:PropTypes.number,
};

StaticPlot.defaultProps = {
  color: '#3185fc',
  curve: 'linear',
  hasLineMarks: true,
  lineMarkSize: 5
};

