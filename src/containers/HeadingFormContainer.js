import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import * as smActions from '../actions/sm-data';
import * as showFormsActions from '../actions/show-forms';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import AlertDismissable from '../components/AlertDismissable';
import { reset } from 'redux-form';

const structuralMetadataUtils = new StructuralMetadataUtils();

class HeadingFormContainer extends Component {
  state = {
    message: null
  };

  submit = (values) => {
    // Update the data structure with new heading
    const updatedData = structuralMetadataUtils.insertNewHeader(
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
        body: `Heading "${
          values.headingInputTitle
        }" has been added.`
      }
    });

    // Reset the form values
    this.props.reset('heading');

    // Close the form
    this.props.toggleHeading();
  };

  render() {
    const { heading } = this.props.showForms;
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
        {heading ? <HeadingForm onSubmit={this.submit} key={1} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  reset: formName => dispatch(reset(formName)),
  buildSMUI: data => dispatch(smActions.buildSMUI(data)),
  toggleHeading: () => dispatch(showFormsActions.toggleHeading())
});

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeadingFormContainer);
