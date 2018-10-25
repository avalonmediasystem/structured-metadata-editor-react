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
    // TODO: Re-compute this after the data structure updates
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
    const timesValid = this.validBeginEndTimes();

    return titleValid && childOfValid && timesValid;
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
    if (this.validBeginEndTimes()) {
      this.buildHeadingsOptions();
    } else {
      this.clearHeadingOptions();
    }
  }

  validBeginEndTimes() {
    const { beginTime, endTime } = this.state;
    if (!this.validTimeFormat(beginTime)) {
      return false;
    }
    if (!this.validTimeFormat(endTime)) {
      return false;
    }

    if (!structuralMetadataUtils.doesTimeOverlap(beginTime, this.allSpans)) {
      return false;
    }
    if (!structuralMetadataUtils.doesTimeOverlap(endTime, this.allSpans)) {
      return false;
    }
    if (
      !structuralMetadataUtils.validateBeforeEndTimeOrder(beginTime, endTime)
    ) {
      return false;
    }
    return true;
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
