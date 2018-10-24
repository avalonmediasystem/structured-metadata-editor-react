import React, { Component } from 'react';
import TimespanForm from '../components/TimespanForm';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import { CSSTransitionGroup } from 'react-transition-group';
import * as smActions from '../actions/sm-data';
import * as showFormsActions from '../actions/show-forms';
import AlertDismissable from '../components/AlertDismissable';
import { reset, getFormSyncErrors } from 'redux-form';

const structuralMetadataUtils = new StructuralMetadataUtils();

class TimespanFormContainer extends Component {
  state = {
    message: null
  };

  submit = values => {
    console.log('Submit new timespan values', values);
    // Update the data structure with new heading
    const updatedData = structuralMetadataUtils.insertNewTimespan(
      values,
      this.props.smData
    );

    // Update redux store
    this.props.buildSMUI(updatedData);

    // Show success message
    this.setState({
      message: {
        type: 'success',
        header: 'Success',
        body: `Timespan "${values.timespanInputTitle}" has been added.`
      }
    });

    // Reset the form values
    this.props.reset('timespan');

    // Close the form
    this.props.toggleTimespan();
  };

  render() {
    const { timespan } = this.props.showForms;
    const { message } = this.state;

    return (
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {message && (
          <AlertDismissable
            type={message.type}
            messageHeader={message.header}
            message={message.body}
          />
        )}
        {timespan ? <TimespanForm onSubmit={this.submit} mySyncErrors={this.props.syncErrors} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  reset: formName => dispatch(reset(formName)),
  buildSMUI: data => dispatch(smActions.buildSMUI(data)),
  toggleTimespan: () => dispatch(showFormsActions.toggleTimespan())
});

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData,
  syncErrors: getFormSyncErrors('timespan')(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanFormContainer);