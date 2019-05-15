import React, { Component } from 'react'
import { HorizontalBar } from "react-chartjs-2"

class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: ((this.props.data.length * 30) + 60) + "px"
        }
    }
    // componentDidUpdate() {
    //     this.setState({ height: ((this.props.data.length * 30) + 60) + "px" })
    //     console.log("filtered chart data by location")
    // }

    render() {
        return (

            <div className="chart" style={{
                height: ((this.props.data.length * 30) + 60) + "px"
            }}>
                <HorizontalBar
                    data={{
                        labels: this.props.labels,
                        datasets: [
                            {
                                label: "Amount",
                                data: this.props.data,
                                backgroundColor: this.props.colors
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function (value) {
                                        if (value % 1 === 0) {
                                            return value;
                                        }
                                    }
                                }
                            }]
                        }
                    }}
                />
            </div>
        )
    }
}
export default Chart;
