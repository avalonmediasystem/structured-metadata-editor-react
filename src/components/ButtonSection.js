import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/show-forms';
import { ButtonToolbar, Button } from 'react-bootstrap';

class ButtonSection extends Component {
  handleHeadingClick = () => {
    this.props.showModal('ADD', 'div');
  }

  handleTimeSpanClick = () => {
    this.props.showModal('ADD', 'span');
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

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(
  mapStateToProps,
  actions
)(ButtonSection);
