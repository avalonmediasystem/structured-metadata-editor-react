import React, { Component } from 'react';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Modal
} from 'react-bootstrap';
import * as actions from '../actions/show-forms';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const structuralMetadataUtils = new StructuralMetadataUtils();
class HeadingForm extends Component {
  constructor(props) {
    super(props);
    this.unEditedItem = null;
  }

  state = {
    headingTitle: '',
    headingChildOf: '',
    childOfOptions: []
  };

  componentDidMount() {
    const { showForms } = this.props;

    // Save the unedited version of item so we can find it later
    if (this.props.showForms.mode === 'EDIT') {
      this.unEditedItem = structuralMetadataUtils.findItemByLabel(
        this.props.showForms.label,
        this.props.smData
      );
    }

    // Get select dropdown options
    let obj = {
      childOfOptions: this.getOptions()
    };

    // Edit mode: Load existing form values
    if (showForms.mode === 'EDIT') {
      obj = { ...obj, ...this.loadExistingValues() };
    }
    this.setState(obj);
  }

  formIsValid() {
    const { headingTitle } = this.state;
    const titleValid = headingTitle && headingTitle.length > 0;

    return titleValid;
  }

  getOptions() {
    let allHeaders = structuralMetadataUtils.getItemsOfType(
      'div',
      this.props.smData
    );
    let options = allHeaders.map(header => (
      <option value={header.label} key={header.label}>
        {ReactHtmlParser(header.label)}
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
  };

  handleHeadingChange = e => {
    this.setState({ headingTitle: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { headingChildOf, headingTitle } = this.state;

    this.props.onSubmit({
      headingChildOf,
      headingTitle,
      unEditedItem: this.unEditedItem
    });
  };

  loadExistingValues() {
    const { showForms, smData } = this.props;
    let item = structuralMetadataUtils.findItemByLabel(showForms.label, smData);
    let parentDiv = structuralMetadataUtils.getParentDiv(item, smData);

    if (parentDiv) {
      parentDiv = parentDiv.label;
    }

    return {
      headingTitle: showForms.label,
      headingChildOf: parentDiv || ''
    };
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.showForms.mode === 'ADD' ? 'Add' : 'Edit'} Heading</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="headingTitle"
            validationState={this.getValidationTitleState()}
          >
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={ReactHtmlParser(this.state.headingTitle)}
              onChange={this.handleHeadingChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="headingChildOf">
            <ControlLabel>Child Of</ControlLabel>
            <FormControl
              componentClass="select"
              placeholder="select"
              onChange={this.handleChildOfChange}
              value={this.state.headingChildOf}
            >
              <option value="">Select...</option>
              {this.state.childOfOptions}
            </FormControl>
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.formIsValid()}
          >
            Save
          </Button>
          <Button onClick={this.props.closeModal}>Cancel</Button>
        </Modal.Footer>
      </form>
    );
  }
}

HeadingForm.propTypes = {
  onSubmit: PropTypes.func
};

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  actions
)(HeadingForm);
