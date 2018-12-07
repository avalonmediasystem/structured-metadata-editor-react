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
    if (this.props.showForms.mode === 'EDIT') {
      // Grab the currently edited item from the data structure
      let smItem = structuralMetadataUtils.findItemByLabel(
        this.props.showForms.label,
        this.props.smData
      );

      // Save the unedited, Form version of the item, so we can use it later
      this.unEditedFormItem = this.loadExistingValues();

      // Load existing form values
      this.setState(this.unEditedFormItem);

      // Remove the timespan from data structure to make room for the saved edited version
      this.props.deleteItem(smItem);
    }

    // Save a reference to all the spans for future calculations
    this.allSpans = structuralMetadataUtils.getItemsOfType(
      'span',
      this.props.smData
    );
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
      newSpan,
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
    const titleValid = this.state.timespanTitle.length > 0;
    const childOfValid = this.state.timespanChildOf.length > 0;
    const timesValidResponse = this.validTimespans();

    return titleValid && childOfValid && timesValidResponse.valid;
  }

  getValidationBeginState() {
    const { beginTime } = this.state;

    if (!beginTime || beginTime.indexOf(':') === -1) {
      return null;
    }

    const validFormat = this.validTimeFormat(beginTime);
    const validBeginTime = structuralMetadataUtils.doesTimeOverlap(
      beginTime,
      this.allSpans
    );

    if (validFormat && validBeginTime) {
      return 'success';
    }
    if (!validFormat || !validBeginTime) {
      return 'error';
    }
    return null;
  }

  getValidationEndState() {
    const { beginTime, endTime } = this.state;

    if (!endTime || endTime.indexOf(':') === -1) {
      return null;
    }

    const validFormat = this.validTimeFormat(endTime);
    const validEndTime = structuralMetadataUtils.doesTimeOverlap(
      endTime,
      this.allSpans
    );
    const validOrdering = structuralMetadataUtils.validateBeforeEndTimeOrder(
      beginTime,
      endTime
    );
    const doesTimespanOverlap = structuralMetadataUtils.doesTimespanOverlap(
      beginTime,
      endTime,
      this.allSpans
    );

    if (validFormat && validEndTime && validOrdering && !doesTimespanOverlap) {
      return 'success';
    }
    if (
      !validFormat ||
      !validEndTime ||
      !validOrdering ||
      doesTimespanOverlap
    ) {
      return 'error';
    }
    return null;
  }

  getValidationTitleState() {
    const { timespanTitle } = this.state;

    if (timespanTitle.length > 2) {
      return 'success';
    }
    if (timespanTitle.length > 0) {
      return 'error';
    }
    return null;
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
    console.log('unEditedFormItem', this.unEdiunEditedFormItemtedItem);
    this.props.onSubmit(this.unEditedFormItem);

    this.props.closeModal();
  };

  handleChildOfChange = e => {
    this.setState({ timespanChildOf: e.target.value });
  };

  /**
   * Load existing form values to state, if in 'EDIT' mode
   */
  loadExistingValues() {
    const { showForms, smData } = this.props;
    let item = structuralMetadataUtils.findItemByLabel(showForms.label, smData);
    let parentDiv = structuralMetadataUtils.getParentDiv(item, smData);

    if (parentDiv) {
      parentDiv = parentDiv.label;
    }

    return {
      beginTime: item.begin,
      endTime: item.end,
      timespanChildOf: parentDiv || '',
      timespanTitle: item.label
    };
  }

  updateChildOfOptions() {
    let timesValidResponse = this.validTimespans();

    if (timesValidResponse.valid) {
      this.buildHeadingsOptions();
    } else {
      this.clearHeadingOptions();
    }
  }

  /**
   * Validates that the begin and end time span values are valid separately, and together
   * in the region which they will create.
   *
   * This function also preps handy feedback messages we might want to display to the user
   */
  validTimespans() {
    const { beginTime, endTime } = this.state;
    const { allSpans } = this;

    // Valid formats?
    if (!this.validTimeFormat(beginTime)) {
      return {
        valid: false,
        message: 'Invalid begin time format'
      };
    }
    if (!this.validTimeFormat(endTime)) {
      return {
        valid: false,
        message: 'Invalid end time format'
      };
    }
    // Any individual overlapping?
    if (!structuralMetadataUtils.doesTimeOverlap(beginTime, allSpans)) {
      return {
        valid: false,
        message: 'Begin time overlaps an existing timespan region'
      };
    }
    if (!structuralMetadataUtils.doesTimeOverlap(endTime, allSpans)) {
      return {
        valid: false,
        message: 'End time overlaps an existing timespan region'
      };
    }
    // Begin comes before end?
    if (
      !structuralMetadataUtils.validateBeforeEndTimeOrder(beginTime, endTime)
    ) {
      return {
        valid: false,
        message: 'Begin time must start before end time'
      };
    }
    // Timespan range overlaps an existing timespan?
    if (
      structuralMetadataUtils.doesTimespanOverlap(beginTime, endTime, allSpans)
    ) {
      return {
        valid: false,
        message: 'New timespan region overlaps an existing timespan region'
      };
    }

    // Success!
    return { valid: true };
  }

  validTimeFormat(value) {
    return value && value.split(':').length === 3;
  }

  render() {
    const { beginTime, endTime, timespanChildOf, timespanTitle } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.showForms.mode === 'ADD' ? 'Add' : 'Edit'} Timespan
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup
            controlId="timespanTitle"
            validationState={this.getValidationTitleState()}
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
                validationState={this.getValidationBeginState()}
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
                validationState={this.getValidationEndState()}
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
            >
              <option value="">Select...</option>
              {this.state.validHeadings.map(item => (
                <option value={item.label} key={item.label}>
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
            Add
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
