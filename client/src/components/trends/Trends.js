import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import LineChart from "./LineChart";

let location = "ALL";
let filterWord = "ALL";
let someTimeAgo = new Date();
someTimeAgo.setDate(someTimeAgo.getDate() - 50);
let startDate = someTimeAgo;
let endDate = Date.now();
let firstFilteredJobDate;
let firstStoredJobDate;
let showDaysWithoutPosts = false;

class Trends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChartData: {
                labels: ["none"],
                data: [0]
            }
        }
        this.getLineChartData = this.getLineChartData.bind(this);
        this.handleChangeFilterWord = this.handleChangeFilterWord.bind(this);
        this.handleChangeLocationFilter = this.handleChangeLocationFilter.bind(this);
        this.toggleShowDaysWithoutPosts = this.toggleShowDaysWithoutPosts.bind(this);
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.getFirstJobPostDate = this.getFirstJobPostDate.bind(this);
    }

    componentWillReceiveProps() {
        if (!firstStoredJobDate) {
            firstStoredJobDate = this.getFirstJobPostDate(this.props.jobs);
            this.getLineChartData();
            this.forceUpdate();
        }

    }

    getFirstJobPostDate(jobArr) {
        let jobDates = [];
        jobArr.forEach((job, i) => {
            jobDates.push(job.datePosted);
        })
        jobDates.sort(function (a, b) {
            return Date.parse(a) - Date.parse(b);
        });
        return jobDates[0];
    }

    getLineChartData() {
        let chartData = {}
        chartData.labels = [];
        chartData.data = [];

        function isDateWithinRange(date) {
            if (Date.parse(date) > startDate && Date.parse(date) < endDate) return true;
            else return false;
        }
        function filterJobsByLocationAndKeywords(jobArray) {
            let filteredJobsDates = [];
            jobArray.forEach((job, i) => {
                //if no filter applied
                if (location === "ALL" && filterWord === "ALL") {
                    filteredJobsDates.push(job.datePosted);

                }
                //else, filter jobs
                else {
                    //if only location is filtered
                    if (location !== "ALL" && filterWord === "ALL") {
                        if (job.location === location) filteredJobsDates.push(job.datePosted);
                    }
                    //if only keyword is filtered
                    else if (location === "ALL" && filterWord !== "ALL") {
                        if (job.keywords.includes(filterWord)) filteredJobsDates.push(job.datePosted);
                    }
                    //else, both filters are applied
                    else {
                        if ((job.location === location) && job.keywords.includes(filterWord)) filteredJobsDates.push(job.datePosted);
                    }
                }
            })
            return filteredJobsDates;
        }

        function filterJobsByDateRange(dateArray) {
            let filteredJobsDates = [];
            dateArray.forEach(date => {
                //if no filter applied
                if (isDateWithinRange(date)) {
                    filteredJobsDates.push(date);

                }
            })
            return filteredJobsDates;
        }

        //first filter by the location and keywords....
        let filteredJobsDatesTemp = filterJobsByLocationAndKeywords(this.props.jobs);
        //sort job dates in ascending order
        filteredJobsDatesTemp.sort(function (a, b) {
            return Date.parse(a) - Date.parse(b);
        });
        let allDates;
        //then grab the first job date
        //this is to gray out dates earlier than first job returned by filter
        firstFilteredJobDate = filteredJobsDatesTemp[0];

        //....then filter the jobs within the date picker time range
        let filteredJobsDates = filterJobsByDateRange(filteredJobsDatesTemp);

        //
        if (showDaysWithoutPosts) {
            //formate date helper function
            let formatDate = (date) => {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-');
            }

            //return array of dates between start and end date
            let getDateArray = (start, end) => {
                let arr = new Array();
                let dt = new Date(start);

                while (dt <= end) {
                    arr.push(formatDate(new Date(dt)).toString());
                    dt.setDate(dt.getDate() + 1);
                }
                return arr;
            }

            //create array of full dates between job postings
            allDates = getDateArray(Date.parse(filteredJobsDates[0]), Date.parse(filteredJobsDates[filteredJobsDates.length - 1]));
        }
        //count occurences of dates
        let jobDatesCount = [];
        let jobDatesNoDups = [];

        //count jobs with same date, for graph
        let i = 0;
        while (i < filteredJobsDates.length) {
            if (jobDatesNoDups.includes(filteredJobsDates[i])) {
                jobDatesCount[jobDatesNoDups.indexOf(filteredJobsDates[i])]++;
            } else {
                jobDatesCount.push(1);
                jobDatesNoDups.push(filteredJobsDates[i]);
            }
            i++;
        }
        //add days with no posts to chart data if that option is selected
        if (showDaysWithoutPosts) {
            let allJobDatesCount = [];
            allDates.forEach((date, i) => {
                if (jobDatesNoDups.includes(date)) {
                    allJobDatesCount[i] = jobDatesCount[jobDatesNoDups.indexOf(date)];
                } else {
                    allJobDatesCount[i] = 0;
                }
            })
            chartData.labels = allDates;
            chartData.data = allJobDatesCount;
        }
        // else add only days with job posts to chart
        else {
            chartData.labels = jobDatesNoDups;
            chartData.data = jobDatesCount;
        }

        this.setState({ lineChartData: chartData })

        return chartData;
    }

    handleChangeLocationFilter(e) {
        location = e.target.value;
        this.getLineChartData();
    }

    handleChangeFilterWord(e) {
        filterWord = e.target.value;
        this.getLineChartData();
    }

    handleChangeStartDate(date) {
        startDate = date;
        this.getLineChartData();
        this.forceUpdate();
    }

    handleChangeEndDate(date) {
        endDate = date;
        this.getLineChartData();
    }

    toggleShowDaysWithoutPosts() {
        if (!showDaysWithoutPosts) showDaysWithoutPosts = true;
        else showDaysWithoutPosts = false;
        this.getLineChartData();
    }

    render() {
        return (

            <div>
                <h1 className="header header--big">Visualize Trends</h1>
                <h2 className="header header--sub">Jobs posted per day</h2>

                <div className="archive__filters">
                    <label>Location:</label>
                    <select onChange={this.handleChangeLocationFilter}>
                        <option value="ALL">ALL</option>
                        <option value="Helsinki">Helsinki</option>
                        <option value="Turku">Turku</option>
                        <option value="Tampere">Tampere</option>
                        <option value="Espoo">Espoo</option>
                    </select>


                    <label>Keywords:</label>
                    <select onChange={this.handleChangeFilterWord}>
                        <option defaultValue="ALL" value="ALL">ALL</option>
                        {this.props.filterWords.map((kw, key) => {
                            return (
                                <option key={key} value={kw}>{kw}</option>
                            )
                        })}
                    </select>

                    <input type="checkbox" onClick={this.toggleShowDaysWithoutPosts} />
                    <label>Show Days Without Posts</label>

                </div>
                <LineChart labels={this.state.lineChartData.labels} data={this.state.lineChartData.data} />

                <label>Start Date:</label>
                <DatePicker
                    selected={Date.parse(startDate)}
                    onChange={this.handleChangeStartDate}
                    minDate={Date.parse(firstStoredJobDate)}
                    maxDate={endDate}
                />

                <label>End Date:</label>
                <DatePicker
                    selected={endDate}
                    onChange={this.handleChangeEndDate}
                    minDate={startDate}
                    maxDate={new Date()}
                />
            </div >
        )
    }
}

export default Trends;
