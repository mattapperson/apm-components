import React from 'react';
import { storiesOf } from '@storybook/react';
import { Chart, Bar, Line, Area, utils } from './CustomPlot';
import response from './test/responseWithData.json';

import { getResponseTimeSerieOrEmpty, getRpmSeriesOrEmpty } from './selectors';

class TwoCustomPlots extends React.Component {
  state = {
    hoverIndex: null,
    responseTimeSeries: [],
    rpmSeries: []
  };

  componentDidMount() {
    // Simulate http latency
    setTimeout(() => {
      this.setState({
        rpmSeries: getRpmSeriesOrEmpty({
          chartsData: response,
          transactionType: 'requests'
        })
      });
    }, 50);
  }

  onHover = hoverIndex => this.setState({ hoverIndex });
  onMouseLeave = () => this.setState({ hoverIndex: null });
  onSelectionEnd = selection => {
    console.log(new Date(selection.start), new Date(selection.end));
  };
  getResponseTimeTickFormat = t => `${response.totalHits === 0 ? '-' : t} ms`;
  getRPMTickFormat = t => `${response.totalHits === 0 ? '-' : t} rpm`;

  render() {
    var width = 100;
    var height = 100;

    if(this.state.rpmSeries.length === 0) {
      return <div>No data</div>
    }

    const tickValues = utils.getTickValues(
      this.state.rpmSeries,
      width,
      height
    );
    const filteredSeries = this.state.rpmSeries
      .filter(serie => !serie.isEmpty)
      .reverse();
    var changeingValue = filteredSeries[this.state.updatedData || 0]

    setTimeout(() => {
      if(this.state.updatedData !== 3) {
        this.setState({
          updatedData: 3
        })
      }
    }, 1500)

    return (
      <div>
      <Chart
        onHover={this.onHover}
        onMouseLeave={this.onMouseLeave}
        onSelectionEnd={this.onSelectionEnd}
        hoverIndex={this.state.hoverIndex}
        tickFormatY={this.getResponseTimeTickFormat}
        {...tickValues}
      >
        <Bar data={filteredSeries[3].data} color={filteredSeries[3].color} />
        <Area data={filteredSeries[0].data} color={'#db1374'} />
        <Line title="changeingValue" color={'#00b3a4'} data={changeingValue.data} />
      </Chart>

      <Chart
        onHover={this.onHover}
        onMouseLeave={this.onMouseLeave}
        onSelectionEnd={this.onSelectionEnd}
        hoverIndex={this.state.hoverIndex}
        tickFormatY={this.getResponseTimeTickFormat}
        {...tickValues}
      >
        <Line data={filteredSeries[3].data} />

      </Chart>
      </div>
    );
  }
}

storiesOf('CustomPlot', module).add('TSVB playground', () => (
  <TwoCustomPlots />
));
