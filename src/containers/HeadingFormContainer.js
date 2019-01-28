import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';
import * as smActions from '../actions/sm-data';
import * as showFormsActions from '../actions/show-forms';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';

const structuralMetadataUtils = new StructuralMetadataUtils();

class HeadingFormContainer extends Component {
  state = {
    message: null
  };

  submit = values => {
    const { showForms, smData } = this.props;
    let submittedItem = {
      headingChildOf: values.headingChildOf,
      headingTitle: values.headingTitle
    };
    let updatedSmData = null;

    // Edit an existing heading
    if (showForms.mode === 'EDIT') {
      // Add edited item id to the submitted object
      submittedItem.id = showForms.id;
      updatedSmData = structuralMetadataUtils.updateHeading(submittedItem, smData);
    }
    // Add a new heading
    else {
      // Update the data structure with new heading
      updatedSmData = structuralMetadataUtils.insertNewHeader(
        submittedItem,
        smData
      );
    }

    // Update redux store
    this.props.buildSMUI(updatedSmData);

    // Close the form
    this.props.closeModal();
  };

  render() {
    return <HeadingForm onSubmit={this.submit} />;
  }
}

const mapDispatchToProps = dispatch => ({
  buildSMUI: data => dispatch(smActions.buildSMUI(data)),
  closeModal: () => dispatch(showFormsActions.closeModal())
});

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeadingFormContainer);
