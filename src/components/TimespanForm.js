import React, { Component } from 'react';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { ButtonToolbar, Button } from 'react-bootstrap';
import * as actions from '../actions/show-forms';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import RenderField from './form/RenderField';
import RenderTimespanSelect from './form/RenderTimespanSelect';

const structuralMetadataUtils = new StructuralMetadataUtils();
let allSpans = null;

/**
 * Field level validation
 */
const required = value => (value ? undefined : 'Required');
const timeFormat = value =>
  value && value.split(':').length !== 3
    ? 'Invalid time format, must be 00:00:00'
    : undefined;
const timeOrdering = (value, allValues) =>
  structuralMetadataUtils.validateBeforeEndTimeOrder(
    allValues.timespanInputBeginTime,
    allValues.timespanInputEndTime
  )
    ? undefined
    : 'End time must come after begin time';
const validBegin = value =>
  structuralMetadataUtils.validateBeginTime(value, allSpans)
    ? undefined
    : 'Invalid begin time';
const validEnd = value =>
  structuralMetadataUtils.validateEndTime(value, allSpans)
    ? undefined
    : 'Invalid end time';

/**
 * The form component itself
 */
class TimespanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.validHeadings = [];
    this.headingUpdateInProgress = false;

    allSpans = structuralMetadataUtils.getItemsOfType('span', props.smData);
  }

  componentDidUpdate() {
    const { mySyncErrors } = this.props;
    const timeSyncErrors =
      mySyncErrors.timespanInputBeginTime || mySyncErrors.timespanInputEndTime;
    const timesExist =
      this.props.timespanInputBeginTime && this.props.timespanInputEndTime;

    // console.log('mySyncErrors', mySyncErrors);
    // console.log('timeSyncErrors', timeSyncErrors);
    // console.log('timesExist', timesExist);
    // console.log('headingUpdateInProgress', this.headingUpdateInProgress);
    // console.log(' ');

    // If no sync errors for begin and end times, and an update is not already in progress,
    // and times exist, update heading dropdown
    if (!timeSyncErrors && timesExist && !this.headingUpdateInProgress) {
      this.headingUpdateInProgress = true;
      this.buildHeadingsOptions();
    }
  }

  buildHeadingsOptions = () => {
    let newSpan = {
      begin: this.props.timespanInputBeginTime,
      end: this.props.timespanInputEndTime
    };
    // Get spans in overall span list which fall before and after the new span
    let wrapperSpans = structuralMetadataUtils.findWrapperSpans(
      newSpan,
      allSpans
    );

    // Get all valid div headings
    let validHeadings = structuralMetadataUtils.getValidHeadings(
      newSpan,
      wrapperSpans,
      this.props.smData
    );

    // Update state with valid headings
    this.setState(
      { validHeadings },
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
          validate={[required]}
        />
        <div className="row">
          <div className="col-sm-6">
            <Field
              name="timespanInputBeginTime"
              component={RenderField}
              type="text"
              label="Begin"
              placeholder="00:00:00"
              validate={[required, timeFormat, validBegin]}
            />
          </div>
          <div className="col-sm-6">
            <Field
              name="timespanInputEndTime"
              component={RenderField}
              type="text"
              label="End"
              placeholder="00:00:00"
              validate={[required, timeFormat, timeOrdering, validEnd]}
            />
          </div>
        </div>
        <Field
          name="timespanSelectChildOf"
          component={RenderTimespanSelect}
          label="Child of"
          options={this.state.validHeadings}
          validate={[required]}
        />
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
  form: 'timespan'
})(TimespanForm);

const selector = formValueSelector('timespan');

const mapStateToProps = state => ({
  smData: state.smData,
  timespanInputBeginTime: selector(state, 'timespanInputBeginTime'),
  timespanInputEndTime: selector(state, 'timespanInputEndTime')
});

TimespanForm = connect(
  mapStateToProps,
  actions
)(TimespanForm);

export default TimespanForm;
