import React, { Component } from 'react';
import {
  ButtonToolbar,
  Button,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row
} from 'react-bootstrap';
import * as actions from '../actions/show-forms';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';

const structuralMetadataUtils = new StructuralMetadataUtils();
//let allSpans = null;

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
  }

  componentDidMount() {
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
    this.props.toggleTimespan();
  };

  handleChildOfChange = e => {
    this.setState({ timespanChildOf: e.target.value });
  };

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
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>Add New Time Span</h4>

        <FormGroup
          controlId="timespanTitle"
          validationState={this.getValidationTitleState()}
        >
          <ControlLabel>Title</ControlLabel>
          <FormControl
            type="text"
            value={this.state.timespanTitle}
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
          >
            <option value="">Select...</option>
            {this.state.validHeadings.map(item => (
              <option value={item.label} key={item.label}>
                {item.label}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <ButtonToolbar>
          <Button
            bsStyle="primary"
            type="submit"
            disabled={!this.formIsValid()}
          >
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

TimespanForm = connect(
  mapStateToProps,
  actions
)(TimespanForm);

export default TimespanForm;
