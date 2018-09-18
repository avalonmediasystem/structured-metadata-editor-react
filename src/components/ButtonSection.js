import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/show-forms';
import { ButtonToolbar, Button } from 'react-bootstrap';

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
        <hr />
        <ButtonToolbar>
          <Button onClick={this.handleHeadingClick}>Add a Heading</Button>
          <Button onClick={this.handleTimeSpanClick}>Add a Timespan</Button>
        </ButtonToolbar>
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
