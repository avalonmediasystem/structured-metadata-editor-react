import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/showForms';

class ButtonSection extends Component {
  handleHeadingClick = () => {
    const {toggleHeading, toggleTimespan, showForms} = this.props;
    toggleTimespan(false);
    toggleHeading(!showForms.heading);
  }

  handleTimeSpanClick = () => {
    const {toggleTimespan, toggleHeading, showForms} = this.props;
    toggleHeading(false);
    toggleTimespan(!showForms.timespan);
  }

  render() {
    return (
      <section className="button-section">
        <div className="alert alert-warning" role="alert">New heading and New Time span buttons currently are not working</div>
        <button className="btn btn-default" onClick={this.handleHeadingClick}>New Heading</button>
        <button className="btn btn-default" onClick={this.handleTimeSpanClick}>New Time Span</button>
        <button className="btn btn-link">Advanced Editor (xml)</button>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  toggleHeading: show => dispatch(actions.toggleHeading(show)),
  toggleTimespan: show => dispatch(actions.toggleTimespan(show))
});

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonSection);
