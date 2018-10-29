import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import * as smActions from '../actions/sm-data';
import * as showFormsActions from '../actions/show-forms';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import AlertDismissable from '../components/AlertDismissable';

const structuralMetadataUtils = new StructuralMetadataUtils();

class HeadingFormContainer extends Component {
  state = {
    message: null
  };

  submit = values => {
    const { mode } = this.props.showForms;
    console.log('mode', mode);
    console.log('values', values);
    // TODO: possibly move "add" or "edit" to an abstracted Redux action?

    let newItem = {
      headingChildOf: values.headingChildOf,
      headingTitle: values.headingTitle
    };

    // Delete the original heading item first, if editing
    let smData =
      mode === 'EDIT'
        ? structuralMetadataUtils.deleteListItem(values.unEditedItem, this.props.smData)
        : this.props.smData;
    
    // Update the data structure with new heading
    const updatedData = structuralMetadataUtils.insertNewHeader(newItem, smData);

    // Update redux store
    this.props.buildSMUI(updatedData);

    let message = `Heading "${values.headingTitle}" has been ${
      mode === 'EDIT' ? 'updated' : 'added'
    }.`;

    // Show success message
    this.setState({
      message: {
        type: 'success',
        header: 'Success',
        body: message
      }
    });

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
        {heading ? <HeadingForm onSubmit={this.submit} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapDispatchToProps = dispatch => ({
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
