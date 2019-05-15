import axios from 'axios';
import Archive from "./archive/Archive";
import Trends from "./trends/Trends";
import Keywords from "./keywords/Keywords";

const React = require('react');

const filterWords = ["junior", "micro services", "helm", "continuous delivery", "senior", "trainee", "intern", "full-time", "javascript", "java", "kotlin", "C#", "Spring", "Asp.net", "REST", "jquery", "html", "html5", "css", "json", "ajax", "fullstack", "full stack", "full-stack", "frontend", "backend", "responsive", "aws", "react", "redux",
  "angular", "vue", "meteor", "drupal", "bootstrap", "node", "php", ".net", "python", "django", "flask", "sql", "mysql", "postgresql", "nosql",
  "mongodb", "restful", "kubernetes", "yarn", "stripes", "scrum", "cloud", "google cloud", "agile", "wordpress", "hubspot", "devops", "graphql", "linux", "unix", "npm",
  "docker", "vagrant", "webpack", "vaadin", "ruby", "android", "mobile", "aem", "junit", "jenkins", "material-ui", "azure", "mern", "pug.js", "scss", "haskell", "rust", "clojure", "database", "webpack", "parcel", "bundler", "gulp", "grunt", "jest", "testing", "react native", "handlebars", "knockout", "web assembly", "wasm"];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      isArchiveShowing: true,
      isTrendsShowing: false,
      isKeywordsShowing: false,
      scrollY: 0
    }

    this.getJobData = this.getJobData.bind(this);
    this.handleChangeScrapeLocation = this.handleChangeScrapeLocation.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
  }

  getJobData() {
    axios
      .get('/api/jobs')
      .then(res => {
        //console.log(res.data)
        this.setState({ jobs: res.data })
        this.forceUpdate();
      });
  }

  componentDidMount() {
    // this.getJobData();
    window.addEventListener("scroll", () => {
      this.setState({ scrollY: window.scrollY })
    });
  }

  handleChangeScrapeLocation(e) {
    this.setState({ scrapeLocation: e.target.value });
  }

  handleChangePage(e) {
    let page = e.target.getAttribute("value");

    this.setState({ isArchiveShowing: false })
    this.setState({ isTrendsShowing: false })
    this.setState({ isKeywordsShowing: false })

    switch (page) {
      case "Archive":
        this.setState({ isArchiveShowing: true })
        break;
      case "Trends":
        this.setState({ isTrendsShowing: true })
        break;
      case "Keywords":
        this.setState({ isKeywordsShowing: true })
        break;
      default:
        this.setState({ isArchiveShowing: true })
    }
  }
  handleScrollUp() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  render() {

    return (
      <div>
        <button onClick={this.getJobData}>GET JOBS</button>
        <div className="navbar-container">
          <div className="navbar content">
            <h2 className="nav__logo">Dev Job Board</h2>
            <ul className="nav__link-container">
              <li className={"nav__link" + (this.state.isArchiveShowing ? " is-selected" : "")} onClick={this.handleChangePage} value="Archive">
                <i className="nav__icon fas fa-archive"></i>
                <figcaption>Archive</figcaption>
              </li>
              <li className={"nav__link" + (this.state.isTrendsShowing ? " is-selected" : "")} onClick={this.handleChangePage} value="Trends">
                <i className="nav__icon fas fa-chart-line"></i>
                <figcaption>Trends</figcaption>
              </li>
              <li className={"nav__link" + (this.state.isKeywordsShowing ? " is-selected" : "")} onClick={this.handleChangePage} value="Keywords">
                <i className="nav__icon fas fa-chart-bar"></i>
                <figcaption>Keywords</figcaption>
              </li>
            </ul>
          </div>

        </div>
        <div className="content">
          <div>

            <div className={"page" + (this.state.isArchiveShowing ? "" : " is-hidden")}>
              <Archive jobs={this.state.jobs} filterWords={filterWords} />
            </div>
            <div className={"page" + (this.state.isTrendsShowing ? "" : " is-hidden")}>
              <Trends jobs={this.state.jobs} filterWords={filterWords} />
            </div>
            <div className={"page" + (this.state.isKeywordsShowing ? "" : " is-hidden")}>
              <Keywords jobs={this.state.jobs} />
            </div>


          </div>

          <button onClick={this.handleScrollUp} className={"button--scroll-up" +
            (this.state.scrollY > 200 ? "" : " is-hidden")
          }>
            <i className="fas fa-level-up-alt"></i>
          </button>
        </div>

      </div>
    )
  }

}
export default App;
