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
    const { mode } = this.props.showForms;

    let newItem = {
      headingChildOf: values.headingChildOf,
      headingTitle: values.headingTitle
    };

    // Delete the original heading item first, if editing
    let smData =
      mode === 'EDIT'
        ? structuralMetadataUtils.deleteListItem(
            values.unEditedItem,
            this.props.smData
          )
        : this.props.smData;

    // Update the data structure with new heading
    const updatedData = structuralMetadataUtils.insertNewHeader(
      newItem,
      smData
    );

    // Update redux store
    this.props.buildSMUI(updatedData);

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
