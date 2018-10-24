import React, { Component } from 'react';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import { ButtonToolbar, Button, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import * as actions from '../actions/show-forms';

const structuralMetadataUtils = new StructuralMetadataUtils();
class HeadingForm extends Component {
  state = {
    headingTitle: '',
    headingChildOf: '',
    childOfOptions: []
  };

  componentDidMount() {
    let childOfOptions = this.getOptions();
    this.setState({
      childOfOptions
    });
  }

  formIsValid() {
    const titleValid = this.state.headingTitle.length > 0;
    const childOfValid = this.state.headingChildOf.length > 0;

    return titleValid && childOfValid;
  }

  getOptions() {
    let allHeaders = structuralMetadataUtils.getItemsOfType(
      'div',
      this.props.smData
    );
    let options = allHeaders.map(header => (
      <option value={header.label} key={header.label}>
        {header.label}
      </option>
    ));

    return options;
  }

  getValidationTitleState() {
    if (this.state.headingTitle.length > 2) {
      return 'success';
    }
    if (this.state.headingTitle.length > 0) {
      return 'error';
    }
    return null;
  }

  handleCancelClick = () => {
    this.props.toggleHeading();
  };

  handleChildOfChange = e => {
    this.setState({ headingChildOf: e.target.value });
  }

  handleHeadingChange = e => {
    this.setState({ headingTitle: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { headingChildOf, headingTitle } = this.state;

    this.props.onSubmit({
      headingChildOf,
      headingTitle
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>Add New Heading</h4>
        <FormGroup
          controlId="headingTitle"
          validationState={this.getValidationTitleState()}
        >
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            value={this.state.headingTitle}
            onChange={this.handleHeadingChange}
          />
          <FormControl.Feedback />
        </FormGroup>

        <FormGroup controlId="headingChildOf">
          <ControlLabel>Child Of</ControlLabel>
          <FormControl componentClass="select" placeholder="select" onChange={this.handleChildOfChange}>
            <option value="">Select...</option>
            {this.state.childOfOptions}
          </FormControl>
        </FormGroup>

        <ButtonToolbar>
          <Button bsStyle="primary" type="submit" disabled={!this.formIsValid()}>
            Add
          </Button>
          <Button onClick={this.handleCancelClick}>Cancel</Button>
        </ButtonToolbar>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(
  mapStateToProps,
  actions
)(HeadingForm);
