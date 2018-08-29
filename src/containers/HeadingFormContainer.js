import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';

class HeadingFormContainer extends Component {
  submit = values => {
    console.log('values', values);
  };

  render() {
    const { heading } = this.props.showForms;
    return heading ? <HeadingForm onSubmit={this.submit} /> : null;
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps)(HeadingFormContainer);
