import React from 'react';
import { connect } from "react-redux";
import Pick from './pick';
import * as nflActions from '../../actions/schedule/nfl_actions';
import * as ncaaActions from '../../actions/schedule/ncaaf_actions';
import * as pickActions from '../../actions/pick_actions';
import RingLoader from "react-spinners/RingLoader";
import Nav from '../nav/nav';
import './schedule.css'

class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sport: 'nfl',
    }
    this.setSport = this.setSport.bind(this);
    this.selectThePick = this.selectThePick.bind(this);
  }

  componentDidMount() {
    this.props.clearPick();
    this.props.fetchNFLTeams();
    this.props.fetchNFLSeason()
      .then(season => {
        this.props.fetchNFLWeek()
          .then(week => {
            this.props.fetchStandingsNFL(season.season.data)
              .then(standings => {
                this.props.fetchOddsNFL(week.week.data)
              })
          })
      })
    this.props.fetchNCAAFWeek()
      .then(week => {
        this.props.fetchOddsNCAAF(week.week.data)
      })
  }

  setSport(selectedSport) {
    this.props.clearPick();
    this.setState({
      sport: selectedSport
    })
    debugger
  }

  selectThePick(e) {
    let pickHomeTeam = this.props[this.state.sport].schedule[e.currentTarget.id];
    if (pickHomeTeam.HomeTeamName === this.props.pick.HomeTeamName) {
      this.props.clearPick()
    } else {
      this.props.selectPick(pickHomeTeam);
    }
  }

  render() {
    if (!this.props.nfl.teams ||
      !this.props.nfl.season ||
      !this.props.nfl.week ||
      !this.props.nfl.schedule ||
      !this.props.nfl.standings ||
      !this.props.ncaaf.week ||
      !this.props.ncaaf.schedule) {
      return (
        <div>
          <Nav />
          <div className="sweet-loading">
            <RingLoader
              size={150}
              color={"#123abc"}
            />
          </div>
        </div>
      )
    }

    let scheduleArray = [];
    Object.values(this.props[this.state.sport].schedule).forEach((game, idx) => {
      if (game.PregameOdds.length === 0) return;
      if (!game.PregameOdds[0].SportsbookUrl) return;
      scheduleArray.push(
        <div 
          className="schedule-game-container"
          key={idx}
          id={game.HomeTeamName}
          onClick={this.selectThePick}
        >
          <div className="schedule-game-teamName-container">
            <p>{game.HomeTeamName}</p>
            <img className="schedule-game-home-team-img" src={this.props[this.state.sport].teams[game.HomeTeamName].WikipediaLogoUrl}/>
            <p>({this.props[this.state.sport].standings[game.HomeTeamName].Wins} 
              - {this.props[this.state.sport].standings[game.HomeTeamName].Losses})</p>
            <p>vs.</p>
            <p>{game.AwayTeamName}</p>
            <p>({this.props[this.state.sport].standings[game.AwayTeamName].Wins} 
              - {this.props[this.state.sport].standings[game.AwayTeamName].Losses})</p>
          </div>
        </div>
      )
    })

    return (
      <div>
        <Nav />
        <div className="select-sport-container">
          <p 
            className="schedule-sport-select"
            onClick={() => this.setSport('nfl')}
          >NFL</p>
          <p 
            className="schedule-sport-select"
            onClick={() => this.setSport('ncaaf')}
          >NCAA Football</p>
        </div>
        <div className="schedule-and-pick-container">
          <div className="schedule-container">
            {scheduleArray}
          </div>
          <Pick />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history,
  loggedIn: state.session.isAuthenticated,
  username: state.session.user.username,
  nfl: state.entities.schedule.nfl,
  ncaaf: state.entities.schedule.ncaaf,
  pick: state.entities.pick
});

const mapDispatchToProps = dispatch => ({
  fetchNFLTeams: () => dispatch(nflActions.fetchNFLTeams()),
  fetchNFLSeason: () => dispatch(nflActions.fetchNFLSeason()),
  fetchNFLWeek: () => dispatch(nflActions.fetchNFLWeek()),
  fetchOddsNFL: (week) => dispatch(nflActions.fetchOddsNFL(week)),
  fetchStandingsNFL: (season) => dispatch(nflActions.fetchStandingsNFL(season)),
  fetchOddsNCAAF: (week) => dispatch(ncaaActions.fetchOddsNCAAF(week)),
  fetchNCAAFWeek: () => dispatch(ncaaActions.fetchNCAAFWeek()),
  selectPick: (pick) => dispatch(pickActions.receivePick(pick)),
  clearPick: () => dispatch(pickActions.clearPick()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);