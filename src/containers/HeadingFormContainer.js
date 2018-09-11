import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import * as actions from '../actions/sm-data';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';

const structuralMetadataUtils = new StructuralMetadataUtils();

class HeadingFormContainer extends Component {
  submit = values => {
    // Update the data structure with new heading
    const updatedData = structuralMetadataUtils.insertNewHeader(values, this.props.smData);

    // Update redux store
    this.props.buildSMUI(updatedData);
  };

  render() {
    const { heading } = this.props.showForms;

    return (
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {heading ? <HeadingForm onSubmit={this.submit} key={1} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  actions
)(HeadingFormContainer);
