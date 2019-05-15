import React, { Component } from 'react'

class Archive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archivedJobsFilters: {
                nrJobsToShow: 5,
                location: "ALL",
                startDate: "01-01-2019",
                filterWord: "ALL"
            }
        }

        this.handleChangeArchivedJobsLocationFilter = this.handleChangeArchivedJobsLocationFilter.bind(this);
        this.handleChangeArchivedJobsNrJobsToShowFilter = this.handleChangeArchivedJobsNrJobsToShowFilter.bind(this);
        this.handleChangeArchivedJobsFilterWord = this.handleChangeArchivedJobsFilterWord.bind(this);

    }
    handleChangeArchivedJobsLocationFilter(e) {
        let newArchivedJobsFilters = this.state.archivedJobsFilters;
        newArchivedJobsFilters.location = e.target.value;
        this.setState({ archivedJobsFilters: newArchivedJobsFilters })
    }

    handleChangeArchivedJobsNrJobsToShowFilter(e) {
        let newArchivedJobsFilters = this.state.archivedJobsFilters;
        newArchivedJobsFilters.nrJobsToShow = parseInt(e.target.value);
        this.setState({ archivedJobsFilters: newArchivedJobsFilters })
    }

    handleChangeArchivedJobsFilterWord(e) {
        let newArchivedJobsFilters = this.state.archivedJobsFilters;
        newArchivedJobsFilters.filterWord = e.target.value;
        this.setState({ archivedJobsFilters: newArchivedJobsFilters });
    }
    render() {
        let jobsDisplayed = 0;
        return (
            <div>
                <h1 className="header header--big">Browse Archived Jobs</h1>

                <div className="archive__filters">
                    <label>Show:</label>
                    <select onChange={this.handleChangeArchivedJobsNrJobsToShowFilter}>
                        <option value="5">5 Jobs</option>
                        <option value="10">10 Jobs</option>
                        <option value="20">20 Jobs</option>
                        <option value="50">50 Jobs</option>
                    </select>

                    <label>Location:</label>
                    <select onChange={this.handleChangeArchivedJobsLocationFilter}>
                        <option value="ALL">ALL</option>
                        <option value="Helsinki">Helsinki</option>
                        <option value="Turku">Turku</option>
                        <option value="Tampere">Tampere</option>
                        <option value="Espoo">Espoo</option>
                    </select>

                    <label>Keywords:</label>
                    <select onChange={this.handleChangeArchivedJobsFilterWord}>
                        <option defaultValue="ALL" value="ALL">ALL</option>
                        {this.props.filterWords.map((kw, key) => {
                            return (
                                <option key={key} value={kw}>{kw}</option>
                            )
                        })}
                    </select>
                </div>

                {this.props.jobs.map((job, key) => {
                    if (((this.state.archivedJobsFilters.location === "ALL") ? true :
                        job.location === this.state.archivedJobsFilters.location)
                        && jobsDisplayed < this.state.archivedJobsFilters.nrJobsToShow
                        && ((this.state.archivedJobsFilters.filterWord === "ALL") ? true :
                            job.keywords.includes(this.state.archivedJobsFilters.filterWord))) {
                        jobsDisplayed++;
                        let expanded = false;
                        return (
                            <div key={key} className="job-posting">

                                <h4 className="job-posting__title">{job.title}</h4>
                                <p onClick={(e) => {
                                    if (!expanded) {
                                        e.target.classList += " is-expanded"
                                        expanded = true;
                                    } else {
                                        e.target.classList.remove("is-expanded")
                                        expanded = false;
                                    }
                                }} className="job-posting__description">
                                    <i className="job-posting-description__arrow fas fa-caret-right"></i>
                                    {job.description}
                                </p>
                                <div>
                                    {job.keywords.map((kw, key) => {
                                        return (
                                            <span key={key} className="job-posting__keyword">{kw} </span>
                                        )
                                    })}
                                </div>
                                <p>Location: {job.location}</p>
                                <a className="job-posting__link" target="_blank" rel="noopener noreferrer" href={job.url}>Link to job</a>
                            </div>
                        )
                    }


                })}
            </div>
        )
    }
}
export default Archive;
