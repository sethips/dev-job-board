import React, { Component } from 'react'
import { Line as LineChart } from "react-chartjs-2"

class Chart extends Component {
    constructor(props) {
        super(props);
        this.chartData = this.chartData.bind(this);
    }

    chartData() {
        return {
            labels: this.props.labels,
            datasets: [
                {
                    label: 'My First dataset',
                    fillColor: 'rgba(220,220,220,0.2)',
                    strokeColor: 'rgba(220,220,220,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: this.props.data,
                }
            ]
        }
    }

    render() {
        const options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        }
                    }
                }]
            },
            scaleShowGridLines: true,
            scaleGridLineColor: 'rgba(0,0,0,.05)',
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: true,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
        }

        const styles = {
            graphContainer: {
                padding: '15px'
            }
        }
        return (

            <div style={styles.graphContainer}>
                <LineChart data={this.chartData()}
                    options={options}
                    width={600} height={250} />
            </div>
        )
    }
}
export default Chart;
