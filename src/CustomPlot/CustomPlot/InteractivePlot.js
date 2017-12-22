import React, { PureComponent } from 'react';
import _ from 'lodash';
import 'react-vis/dist/style.css';
import PropTypes from 'prop-types';
import SelectionMarker from './SelectionMarker';

import { MarkSeries, VerticalGridLines } from 'react-vis';
import Tooltip from './tooltip';

class InteractivePlot extends PureComponent {
  getMarkPoints = hoverIndex => {
    if (!this.props.series[0].data[hoverIndex]) {
      return [];
    }

    return this.props.series.map(serie => {
      const { x, y } = serie.data[hoverIndex] || {};
      return {
        x,
        y,
        color: serie.color
      };
    });
  };

  getTooltipPoints = hoverIndex => {
    if (!this.props.series[0].data[hoverIndex]) {
      return [];
    }

    return this.props.series.map(serie => ({
      color: serie.color,
      value: this.props.tickFormatY(_.get(serie.data[hoverIndex], 'y')),
      text: serie.titleShort || serie.title
    }));
  };

  getHoveredX = hoverIndex => {
    const defaultSerie = this.props.series[0].data;
    return _.get(defaultSerie[hoverIndex], 'x');
  };

  render() {
    const {
      hoverIndex,
      series,
      XYPlot,
      x,
      isDrawing,
      selectionStart,
      selectionEnd
    } = this.props;

    if (_.isEmpty(series)) {
      return null;
    }

    const tooltipPoints = this.getTooltipPoints(hoverIndex);
    const markPoints = this.getMarkPoints(hoverIndex);
    const hoveredX = this.getHoveredX(hoverIndex);

    return (
      <XYPlot>
        {hoveredX && (
          <Tooltip tooltipPoints={tooltipPoints} x={hoveredX} y={0} />
        )}

        {hoveredX && <MarkSeries data={markPoints} colorType="literal" />}
        {hoveredX && <VerticalGridLines tickValues={[hoveredX]} />}

        {isDrawing &&
          selectionEnd !== null && (
            <SelectionMarker start={x(selectionStart)} end={x(selectionEnd)} />
          )}
      </XYPlot>
    );
  }
}

InteractivePlot.propTypes = {
  hoverIndex: PropTypes.number,
  series: PropTypes.array.isRequired,
  XYPlot: PropTypes.func.isRequired,
  tickFormatY: PropTypes.func.isRequired,
  x: PropTypes.func.isRequired,
  isDrawing: PropTypes.bool.isRequired,
  selectionStart: PropTypes.number,
  selectionEnd: PropTypes.number
};

export default InteractivePlot;
