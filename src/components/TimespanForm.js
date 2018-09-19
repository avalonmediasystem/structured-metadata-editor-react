import React, { Component } from 'react';
import { Field, getFormValues, formValueSelector, reduxForm } from 'redux-form';
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

  // Check timespan parent select has a value
  // TODO: Determine whether we want to validate this or not
  // if (!values.timeSpanSelectChildOf) {
  //   errors.timeSpanSelectChildOf = 'Required';
  // }

  // Check timespan title has a value
  if (!values.timeSpanInputTitle) {
    errors.timeSpanInputTitle = 'Required';
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
    // If form is valid (begin and end times are valid), populate heading options
    if (this.props.valid && !this.headingUpdateInProgress) {
      this.headingUpdateInProgress = true;
      this.buildHeadingsOptions();
    }
  }

  buildHeadingsOptions = () => {
    // TODO: Get valid heading options here
    this.validHeadings.splice(0, 2);

    // Update state with valid headings
    this.setState(
      { validHeadings: this.validHeadings },
      () => (this.headingUpdateInProgress = false)
    );
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
    const { handleSubmit, submitting} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <h4>Add New Time Span</h4>
        <div className="row">
          <div className="col-sm-6">
            <div className={`form-group`}>
              <label className="control-label" htmlFor="Child of">
                Child of
              </label>
              <select
                name="timeSpanSelectChildOf"
                className="form-control"
              >
                <option value="">Select one...</option>
                {this.state.validHeadings.map(option => (
                  <option value={option.label} key={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Field
              name="timeSpanInputTitle"
              component={RenderField}
              type="text"
              label="Title"
              placeholder="Title"
            />
          </div>
          <div className="col-sm-6">
            <Field
              name="timespanInputBeginTime"
              component={RenderField}
              type="text"
              label="Begin"
              placeholder="00:00:00"
            />
            <Field
              name="timespanInputEndTime"
              component={RenderField}
              type="text"
              label="End"
              placeholder="00:00:00"
            />
          </div>
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
