import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import {
  getExistingFormValues,
  getValidationBeginState,
  getValidationEndState,
  getValidationTitleState,
  isTitleValid,
  validTimespans
} from '../services/form-helper';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import { cloneDeep } from 'lodash';
import ListItemInlineEditControls from './ListItemInlineEditControls';
import * as peaksActions from '../actions/peaks-instance';

const structuralMetadataUtils = new StructuralMetadataUtils();

const styles = {
  formControl: {
    margin: '0 5px'
  }
};

class TimespanInlineForm extends Component {
  constructor(props) {
    super(props);

    // To implement validation logic on begin and end times, we need to remove the current item
    // from the stored data
    this.tempSmData = undefined;
  }

  static propTypes = {
    item: PropTypes.object,
    cancelFn: PropTypes.func,
    saveFn: PropTypes.func
  };

  state = {
    beginTime: '',
    endTime: '',
    timespanTitle: ''
  };

  componentDidMount() {
    const { smData } = this.props;

    // Get a fresh copy of store data
    this.tempSmData = cloneDeep(smData);

    // Load existing form values
    this.setState(getExistingFormValues(this.props.item.id, this.tempSmData));

    // Remove current list item from the data we're doing validation against in this form
    this.tempSmData = structuralMetadataUtils.deleteListItem(
      this.props.item.id,
      this.tempSmData
    );

    // Save a reference to all the spans for future calculations
    this.allSpans = structuralMetadataUtils.getItemsOfType(
      'span',
      this.tempSmData
    );

    this.props.activateSegment(this.props.item.id);
  }

  formIsValid() {
    const { beginTime, endTime } = this.state;
    const titleValid = isTitleValid(this.state.timespanTitle);
    const timesValidResponse = validTimespans(
      beginTime,
      endTime,
      this.allSpans,
      this.tempSmData
    );

    return titleValid && timesValidResponse.valid;
  }

  handleCancelClick = () => {
    this.props.deactivateSegment(this.props.item.id);
    this.props.cancelFn();
  };

  handleInputChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSaveClick = () => {
    const { beginTime, endTime, timespanTitle } = this.state;
    this.props.saveFn(this.props.item.id, {
      beginTime,
      endTime,
      timespanTitle
    });
  };

  render() {
    const { beginTime, endTime, timespanTitle } = this.state;

    return (
      <Form inline>
        <div className="row-wrapper">
          <div>
            <FormGroup
              controlId="timespanTitle"
              validationState={getValidationTitleState(timespanTitle)}
            >
              <ControlLabel>Title</ControlLabel>
              <FormControl
                type="text"
                style={styles.formControl}
                value={timespanTitle}
                onChange={this.handleInputChange}
              />
            </FormGroup>
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
                style={styles.formControl}
                value={beginTime}
                onChange={this.handleInputChange}
              />
            </FormGroup>
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
                style={styles.formControl}
                value={endTime}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </div>
          <ListItemInlineEditControls
            formIsValid={this.formIsValid()}
            handleSaveClick={this.handleSaveClick}
            handleCancelClick={this.handleCancelClick}
          />
        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

const mapDispatchToProps = {
  activateSegment: peaksActions.activateSegment,
  deactivateSegment: peaksActions.deactivateSegment
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanInlineForm);
