import React, { Component } from 'react';
import {
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Modal,
  Row
} from 'react-bootstrap';
import * as showFormActions from '../actions/show-forms';
import * as smActions from '../actions/sm-data';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import {
  getValidationBeginState,
  getValidationEndState,
  getValidationTitleState,
  isTitleValid,
  validTimespans
} from '../services/form-helper';

const structuralMetadataUtils = new StructuralMetadataUtils();

class TimespanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginTime: '',
      endTime: '',
      timespanChildOf: '',
      timespanTitle: '',
      validHeadings: []
    };
    this.unEditedItem = null;
  }

  componentDidMount() {
    const { showForms, smData } = this.props;

    if (showForms.mode === 'EDIT') {
      // Grab the currently edited item from the data structure
      let smItem = structuralMetadataUtils.findItem(showForms.id, smData);

      // Save the unedited, Form version of the item, so we can use it later
      this.unEditedFormItem = this.loadExistingValues();

      // Load existing form values
      this.setState(this.loadExistingValues());

      // Remove the timespan from data structure to make room for the saved edited version
      this.props.deleteItem(smItem);
    }

    // Save a reference to all the spans for future calculations
    this.allSpans = structuralMetadataUtils.getItemsOfType('span', smData);
  }

  buildHeadingsOptions = () => {
    let newSpan = {
      begin: this.state.beginTime,
      end: this.state.endTime
    };
    // Get spans in overall span list which fall before and after the new span
    let wrapperSpans = structuralMetadataUtils.findWrapperSpans(
      newSpan,
      this.allSpans
    );

    // Get all valid div headings
    let validHeadings = structuralMetadataUtils.getValidHeadings(
      wrapperSpans,
      this.props.smData
    );

    // Update state with valid headings
    this.setState({ validHeadings });
  };

  clearHeadingOptions = () => {
    this.setState({
      validHeadings: []
    });
  };

  formIsValid() {
    const titleValid = isTitleValid(this.state.timespanTitle);
    const childOfValid = this.state.timespanChildOf.length > 0;
    const timesValidResponse = this.localValidTimespans();

    return titleValid && childOfValid && timesValidResponse.valid;
  }

  handleInputChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { beginTime, endTime, timespanChildOf, timespanTitle } = this.state;

    this.props.onSubmit({
      beginTime,
      endTime,
      timespanChildOf,
      timespanTitle
    });
  };

  handleTimeChange = e => {
    this.setState({ [e.target.id]: e.target.value }, this.updateChildOfOptions);
  };

  handleCancelClick = () => {
    // Add the edited item back to data structure
    if (this.unEditedFormItem !== undefined) {
      this.props.onSubmit(this.unEditedFormItem);
    }

    this.props.closeModal();
  };

  handleChildOfChange = e => {
    this.setState({ timespanChildOf: e.target.value });
  };

  updateChildOfOptions() {
    let timesValidResponse = this.localValidTimespans();

    if (timesValidResponse.valid) {
      this.buildHeadingsOptions();
    } else {
      this.clearHeadingOptions();
    }
  }

  /**
   * A local wrapper for the reusable function 'validTimespans'
   */
  localValidTimespans() {
    const { beginTime, endTime } = this.state;
    const { allSpans } = this;

    return validTimespans(beginTime, endTime, allSpans, this.props.smData);
  }

  render() {
    const { beginTime, endTime, timespanChildOf, timespanTitle } = this.state;
    const { showForms } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {showForms.mode === 'ADD' ? 'Add' : 'Edit'} Timespan
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="timespanTitle"
            validationState={getValidationTitleState(timespanTitle)}
          >
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={timespanTitle}
              onChange={this.handleInputChange}
            />
            <FormControl.Feedback />
          </FormGroup>

          <Row>
            <Col sm={6}>
              <FormGroup
                controlId="beginTime"
                validationState={getValidationBeginState(
                  beginTime,
                  this.allSpans
                )}
              >
                <ControlLabel>Begin Time</ControlLabel>
                <FormControl
                  type="text"
                  value={beginTime}
                  placeholder="00:00:00"
                  onChange={this.handleTimeChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup
                controlId="endTime"
                validationState={getValidationEndState(
                  beginTime,
                  endTime,
                  this.allSpans
                )}
              >
                <ControlLabel>End Time</ControlLabel>
                <FormControl
                  type="text"
                  value={endTime}
                  placeholder="00:00:00"
                  onChange={this.handleTimeChange}
                />
                <FormControl.Feedback />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup controlId="timespanChildOf">
            <ControlLabel>Child Of</ControlLabel>
            <FormControl
              componentClass="select"
              placeholder="select"
              onChange={this.handleChildOfChange}
              value={timespanChildOf}
              disabled={showForms.mode === 'EDIT'}
            >
              <option value="">Select...</option>
              {this.state.validHeadings.map(item => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </FormControl>
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.formIsValid()}
          >
            {showForms.mode === 'EDIT' ? 'Update' : 'Add'}
          </Button>
          <Button onClick={this.handleCancelClick}>Cancel</Button>
        </Modal.Footer>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(showFormActions.closeModal()),
  deleteItem: item => dispatch(smActions.deleteItem(item))
});

TimespanForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanForm);

export default TimespanForm;
