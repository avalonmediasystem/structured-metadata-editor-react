import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/show-forms';
import { ButtonToolbar, Button } from 'react-bootstrap';
import APIUtils from '../api/Utils';
import AlertContainer from '../containers/AlertContainer';

const apiUtils = new APIUtils();

class ButtonSection extends Component {
  handleHeadingClick = () => {
    this.props.showModal('ADD', 'div');
  };

  handleTimeSpanClick = () => {
    this.props.showModal('ADD', 'span');
  };

  handleSaveItClick = () => {
    let postData = { json: this.props.smData[0] };
    apiUtils
      .postRequest('structure.json', postData)
      .then(response => {
        this.props.handleResponse(response.status, response.statusText);
      })
      .catch(error => {
        if (error.response !== undefined) {
          this.props.handleResponse(error.response.status);
        } else {
          this.props.handleResponse(error.request.status);
        }
      });
  };

  render() {
    return (
      <section className="button-section">
        <hr />
        <ButtonToolbar>
          <Button onClick={this.handleHeadingClick}>Add a Heading</Button>
          <Button onClick={this.handleTimeSpanClick}>Add a Timespan</Button>
          <Button onClick={this.handleSaveItClick}>Save Structure</Button>
        </ButtonToolbar>
        <AlertContainer />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  actions
)(ButtonSection);
