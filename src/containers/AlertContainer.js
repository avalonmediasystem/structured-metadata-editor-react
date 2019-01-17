import React, { Component } from 'react';
import { connect } from 'react-redux';
import AlertDismissable from '../components/AlertDismissable';

class AlertContainer extends Component {
  render() {
    return <div>{this.props.showForms.alert && <AlertDismissable />}</div>;
  }
}
const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps)(AlertContainer);
