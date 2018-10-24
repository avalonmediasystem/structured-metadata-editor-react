import React, { Component } from 'react';
import TimespanForm from '../components/TimespanForm';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import { CSSTransitionGroup } from 'react-transition-group';
import * as smActions from '../actions/sm-data';
import * as showFormsActions from '../actions/show-forms';
import AlertDismissable from '../components/AlertDismissable';

const structuralMetadataUtils = new StructuralMetadataUtils();

class TimespanFormContainer extends Component {
  state = {
    message: null
  };

  submit = values => {
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
        body: `Timespan "${values.timespanTitle}" has been added.`
      }
    });

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
        {timespan ? <TimespanForm onSubmit={this.submit} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  buildSMUI: data => dispatch(smActions.buildSMUI(data)),
  toggleTimespan: () => dispatch(showFormsActions.toggleTimespan())
});

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanFormContainer);
