import React, { Component } from 'react'
import Chart from "./Chart";

let gotProps = false;

const keywordsNonTech = [
    "senior", "database", "agile", "intern", "frontend", "aem", "fullstack", "full-stack", "full stack", "full-stack", "testing",
    "full-time", "scrum", "responsive", "json", "backend", "mobile", "jest", "rust"
];

class Keywords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywordsFiltered: [],
            keywordsFilteredCount: []
        }
        // this.setChartKeywordData = this.setChartKeywordData.bind(this);
        // this.filterChartDataByKeywords = this.filterChartDataByKeywords.bind(this);
        // this.filterChartDataByKeywords = this.filterOutChartDataByKeywords.bind(this);
        // this.filterChartDataByKeywords = this.filterChartDataByKeywords.bind(this);
        this.getKeyWordCount = this.getKeyWordCount.bind(this);
        // this.storeKeywordsInState = this.storeKeywordsInState.bind(this);
        this.getTransformedData = this.getTransformedData.bind(this);
        this.storeKeywordsInState = this.storeKeywordsInState.bind(this);
        this.handleChangeChartLocationFilter = this.handleChangeChartLocationFilter.bind(this);
        this.getChartBarColor = this.getChartBarColor.bind(this);
    }

    componentWillReceiveProps() {
        if (!gotProps) {
            setTimeout(() => {
                this.getTransformedData();
            }, 1000);
            gotProps = true;
        }
    }

    setChartKeywordData(kwsArr, kwsCountArr) {
        this.setState({ keywordsFiltered: kwsArr, keywordsFilteredCount: kwsCountArr })
    }
    getTransformedData() {
        const keywordsCountTotal = this.getKeyWordCount(this.props.jobs);
        this.storeKeywordsInState(keywordsCountTotal);
    }
    storeKeywordsInState(keywordCountArr) {
        //save the keywords and counts in arrays, so they can be used in charts
        let kwArr = []
        let kwCountArr = []
        keywordCountArr.forEach(kwObj => {
            kwArr.push(kwObj.keyword)
            kwCountArr.push(kwObj.count)
        })

        //store in state to update charts
        this.setState({
            keywordsFiltered: kwArr,
            keywordsFilteredCount: kwCountArr
        });
        this.forceUpdate();
    }
    handleChangeChartLocationFilter(e) {
        let location = e.target.value;
        let jobs = []
        if (location === "ALL") {
            jobs = this.props.jobs;
        } else {
            jobs = this.props.jobs.filter(job => job.location === location);
        }

        let keywordCountArr = this.getKeyWordCount(jobs);

        let kwArr = []
        let kwCountArr = []
        keywordCountArr.forEach(kwObj => {
            kwArr.push(kwObj.keyword)
            kwCountArr.push(kwObj.count)
        })

        this.setState({
            keywordsFiltered: kwArr, keywordsFilteredCount: kwCountArr
        });
    }

    // filterChartDataByNumberOfKeywords(kwsArr, kwsCountArr, category, nrOfKws) {
    //     let filteredKeywords = [];
    //     let filteredKeywordsCount = [];
    //     kwsArr.forEach((kw, i) => {
    //         if (i < nrOfKws) {
    //             filteredKeywords.push(kw);
    //             filteredKeywordsCount.push(kwsCountArr[i]);
    //         } else return;

    //     })
    //     this.setChartKeywordData(category, filteredKeywords, filteredKeywordsCount);
    // }

    // filterOutChartDataByKeywords(kwsArr, kwsCountArr, category, kwsToFilter) {
    //     let filteredKeywords = [];
    //     let filteredKeywordsCount = [];
    //     kwsArr.forEach((kw, i) => {
    //         if (!kwsToFilter.includes(kw)) {
    //             filteredKeywords.push(kw);
    //             filteredKeywordsCount.push(kwsCountArr[i]);
    //         }
    //     })
    //     this.setChartKeywordData(category, filteredKeywords, filteredKeywordsCount);
    // }

    // filterChartDataByKeywords(kwsArr, kwsCountArr, category, kwsToFilter) {
    //     let filteredKeywords = [];
    //     let filteredKeywordsCount = [];
    //     kwsArr.forEach((kw, i) => {
    //         kwsToFilter.forEach(kwToFilter => {
    //             if (kw === kwToFilter) {
    //                 filteredKeywords.push(kw);
    //                 filteredKeywordsCount.push(kwsCountArr[i]);
    //             }
    //         })

    //     })
    //     this.setChartKeywordData(category, filteredKeywords, filteredKeywordsCount);
    // }

    getKeyWordCount(jobsArray) {
        let keywordCountArr = [];

        let jobsKeywordsArray = [];
        for (let i = 0; i < jobsArray.length; i++) {
            if (jobsArray[i].keywords !== undefined && jobsArray[i].keywords.length > 0) {
                jobsKeywordsArray.push(jobsArray[i].keywords)
            }
        }

        jobsKeywordsArray.forEach(jobKeywordArray => {
            jobKeywordArray.forEach(kw => {
                //dont add keywords that arent technologies
                if (keywordsNonTech.includes(kw)) {
                    return;
                } else {
                    let exists = false;
                    keywordCountArr.forEach(elem => {
                        if (elem.keyword === kw) {
                            elem.count++;
                            exists = true;
                        }
                    })
                    if (!exists) keywordCountArr.push({ "keyword": kw, "count": 1 })
                }

            })
        })
        keywordCountArr.sort(function (a, b) {
            return b.count - a.count;
        });
        return keywordCountArr;
    }
    getChartBarColor() {
        //return "#" + Math.floor(Math.random() * 16777215).toString(16);
        return ("#46ABB0");
    }

    render() {
        return (
            <div>
                <h1 className="header header--big">Keyword Data</h1>
                <h2 className="header header--sub">Jobs mentioning keywords</h2>
                <label>Location:</label>
                <select onChange={this.handleChangeChartLocationFilter}>
                    <option value="ALL">ALL</option>
                    <option value="Helsinki">Helsinki</option>
                    <option value="Turku">Turku</option>
                    <option value="Tampere">Tampere</option>
                    <option value="Espoo">Espoo</option>
                </select>

                <Chart
                    labels={this.state.keywordsFiltered}
                    data={this.state.keywordsFilteredCount}
                    colors={this.state.keywordsFiltered.map(() => this.getChartBarColor())}
                />
            </div>
        )
    }
}

export default Keywords;