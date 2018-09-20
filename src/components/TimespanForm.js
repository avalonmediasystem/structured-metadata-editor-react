import React, { Component } from 'react';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { ButtonToolbar, Button } from 'react-bootstrap';
import * as actions from '../actions/show-forms';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import RenderField from './form/RenderField';

const structuralMetadataUtils = new StructuralMetadataUtils();
let allSpans = null;

/**
 * Validate function for time span inputs
 */
const validate = (values, props) => {
  const { smData } = props;
  const errors = {};

  if (!allSpans) {
    allSpans = structuralMetadataUtils.getItemsOfType('span', smData);
  }

  // Check timespan title has a value
  if (!values.timespanInputTitle) {
    errors.timespanInputTitle = 'Required';
  }

  // Check begin time has a value
  if (!values.timespanInputBeginTime) {
    errors.timespanInputBeginTime = 'Required';
  } else if (
    // Check begin time is valid
    !structuralMetadataUtils.validateBeginTime(
      values.timespanInputBeginTime,
      allSpans
    )
  ) {
    errors.timespanInputBeginTime = 'Invalid Begin Time';
  }

  // Check end time has a value
  if (!values.timespanInputEndTime) {
    errors.timespanInputEndTime = 'Required';
  } else if (
    // Check for valid end time
    !structuralMetadataUtils.validateEndTime(
      values.timespanInputEndTime,
      allSpans
    )
  ) {
    errors.timespanInputEndTime = 'Invalid End Time';
  } else if (
    !structuralMetadataUtils.validateBeforeEndTimeOrder(
      values.timespanInputBeginTime,
      values.timespanInputEndTime
    )
  ) {
    errors.timespanInputEndTime = 'End time must come after begin time';
  }

  return errors;
};

class TimespanForm extends Component {
  constructor(props) {
    super(props);
    this.validHeadings = structuralMetadataUtils.getItemsOfType(
      'div',
      props.smData
    );
    this.headingUpdateInProgress = false;

    this.state = {};
    this.state.validHeadings = this.validHeadings;
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: Additional check that the begin and end time values didn't change
    // If so, don't move forward
    console.log(
      'prevProps',
      prevProps.valid,
      prevProps.timespanInputBeginTime,
      prevProps.timespanInputEndTime
    );
    console.log(
      'props',
      this.props.valid,
      this.props.timespanInputBeginTime,
      this.props.timespanInputEndTime
    );

    // During a form submit, values may be empty.  Just return, no need to do anything
    if (
      !this.props.timespanInputBeginTime ||
      !this.props.timespanInputEndTime
    ) {
      return;
    }

    // If form is valid (begin and end times are valid), populate heading options
    if (this.props.valid && !this.headingUpdateInProgress) {
      this.headingUpdateInProgress = true;
      this.buildHeadingsOptions();
    }
  }

  buildHeadingsOptions = () => {
    let newSpan = {
      begin: this.props.timespanInputBeginTime,
      end: this.props.timespanInputEndTime
    };
    // Get preceding span whose time ends before start time of new span
    let wrapperSpans = structuralMetadataUtils.findWrapperSpans(
      newSpan,
      allSpans
    );
    console.log('wrapperSpans', wrapperSpans);

    // Get all valid div headings
    let validHeadings = structuralMetadataUtils.getValidHeadings(
      newSpan,
      wrapperSpans,
      this.props.smData
    );
    console.log('validHeadings', validHeadings);

    // Update state with valid headings
    this.setState(
      { validHeadings },
      () => (this.headingUpdateInProgress = false)
    );

    // TODO: Update the value itself of the select dropdown
  };

  clearHeadingOptions = () => {
    this.setState({
      validHeadings: [],
      selectOptions: []
    });
  };

  handleCancelClick = () => {
    this.props.toggleTimespan();
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <h4>Add New Time Span</h4>
        <Field
          name="timespanInputTitle"
          component={RenderField}
          type="text"
          label="Title"
          placeholder="Title"
        />
        <div className="row">
          <div className="col-sm-6">
            <Field
              name="timespanInputBeginTime"
              component={RenderField}
              type="text"
              label="Begin"
              placeholder="00:00:00"
            />
          </div>
          <div className="col-sm-6">
            <Field
              name="timespanInputEndTime"
              component={RenderField}
              type="text"
              label="End"
              placeholder="00:00:00"
            />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="Child of">
            Child of
          </label>
          <Field
            name="timespanSelectChildOf"
            component="select"
            className="form-control"
          >
            <option value="">Select one...</option>
            {this.state.validHeadings.map(option => (
              <option value={option.label} key={option.label}>
                {option.label}
              </option>
            ))}
          </Field>
        </div>

        <ButtonToolbar>
          <Button bsStyle="primary" type="submit" disabled={submitting}>
            Add
          </Button>
          <Button onClick={this.handleCancelClick}>Cancel</Button>
        </ButtonToolbar>
      </form>
    );
  }
}

TimespanForm = reduxForm({
  form: 'timespan',
  validate
})(TimespanForm);

const selector = formValueSelector('timespan');

const mapStateToProps = state => ({
  timespanInputBeginTime: selector(state, 'timespanInputBeginTime'),
  timespanInputEndTime: selector(state, 'timespanInputEndTime'),
  smData: state.smData
});

TimespanForm = connect(
  mapStateToProps,
  actions
)(TimespanForm);

export default TimespanForm;
