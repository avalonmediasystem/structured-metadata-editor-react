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
              <p>Unauthorized to access the masterfile.</p>
            </Alert>
          </div>
        );
      case status === 404:
        return (
          <div>
            <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
              <p>Requested masterfile not found.</p>
            </Alert>
          </div>
        );
      case status >= 200 && status < 300:
        return (
          <div>
            <Alert bsStyle="success" onDismiss={this.handleDismiss}>
              <p>Successfully saved to masterfile.</p>
            </Alert>
          </div>
        );
      default:
        return (
          <div>
            <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
              <p>Network error, please try again!</p>
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
