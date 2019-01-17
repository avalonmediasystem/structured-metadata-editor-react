import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import * as showFormActions from '../actions/show-forms';

class AlertDismissable extends React.Component {
  constructor(props) {
    super(props);
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  handleDismiss() {
    this.props.closeAlert();
  }

  createAlert() {
    const status = this.props.showForms.statusCode;
    switch (true) {
      case status === 401:
        return (
          <div>
            <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
              <h4>Unauthorized to access the masterfile.</h4>
            </Alert>
          </div>
        );
      case status === 404:
        return (
          <div>
            <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
              <h4>Requested masterfile not found.</h4>
            </Alert>
          </div>
        );
      case status >= 200 && status < 300:
        return (
          <div>
            <Alert bsStyle="success" onDismiss={this.handleDismiss}>
              <h4>Successfully saved masterfile.</h4>
            </Alert>
          </div>
        );
      default:
        return (
          <div>
            <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
              <h4>Network error, please try again!</h4>
            </Alert>
          </div>
        );
    }
  }

  render() {
    return (
      <div>
        <br />
        {this.createAlert()}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  closeAlert: () => dispatch(showFormActions.closeAlert())
});

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertDismissable);
