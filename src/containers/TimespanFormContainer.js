import React, { Component } from 'react';
import TimespanForm from '../components/TimespanForm';
import { connect } from 'react-redux';

class TimespanFormContainer extends Component {
  submit = values => {
    console.log('values', values);
  };

  render() {
    const { timespan } = this.props.showForms;
    return timespan ? <TimespanForm onSubmit={this.submit} /> : null;
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps)(TimespanFormContainer);
