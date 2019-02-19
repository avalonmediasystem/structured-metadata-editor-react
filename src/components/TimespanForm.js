import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Row
} from 'react-bootstrap';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import {
  getValidationBeginState,
  getValidationEndState,
  getValidationTitleState,
  isTitleValid,
  validTimespans
} from '../services/form-helper';
import { isEqual } from 'lodash';

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
    this.allSpans = null;
  }

  componentDidUpdate(prevProps) {
    const { smData } = this.props;
    if (!isEqual(smData, prevProps.smData)) {
      this.allSpans = structuralMetadataUtils.getItemsOfType('span', smData);
    }
  }

  buildHeadingsOptions = () => {
    const { smData } = this.props;
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
      smData
    );

    // Update state with valid headings
    this.setState({ validHeadings });
  };

  clearHeadingOptions = () => {
    this.setState({
      validHeadings: []
    });
  };

  clearFormValues() {
    this.setState({
      beginTime: '',
      endTime: '',
      timespanChildOf: '',
      timespanTitle: '',
      validHeadings: []
    });
  }

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

    // Clear form values
    this.clearFormValues();
  };

  handleTimeChange = e => {
    this.setState({ [e.target.id]: e.target.value }, this.updateChildOfOptions);
  };

  handleCancelClick = () => {
    // Add the edited item back to data structure
    if (this.unEditedFormItem !== undefined) {
      this.props.onSubmit(this.unEditedFormItem);
    }

    this.props.cancelClick();
  };

  handleChildOfChange = e => {
    this.setState({ timespanChildOf: e.target.value });
  };

  updateChildOfOptions() {
    const timesValidResponse = this.localValidTimespans();

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

    return (
      <form onSubmit={this.handleSubmit}>
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
          >
            <option value="">Select...</option>
            {this.state.validHeadings.map(item => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </FormControl>
        </FormGroup>

        <Row>
          <Col xs={12}>
            <ButtonToolbar className="pull-right">
              <Button onClick={this.props.cancelClick}>Cancel</Button>
              <Button
                bsStyle="primary"
                type="submit"
                disabled={!this.formIsValid()}
              >
                Save
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

TimespanForm = connect(mapStateToProps)(TimespanForm);

export default TimespanForm;
