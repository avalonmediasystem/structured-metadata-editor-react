import React, { Component } from 'react';
import TimespanForm from '../components/TimespanForm';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import * as smActions from '../actions/sm-data';

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

    // Close the form
    this.props.cancelClick();
  };

  render() {
    return (
      <TimespanForm onSubmit={this.submit} cancelClick={this.props.cancelClick} />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  buildSMUI: data => dispatch(smActions.buildSMUI(data))
});

const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimespanFormContainer);
