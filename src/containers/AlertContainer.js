import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

class AlertContainer extends Component {
  static propTypes = {
    message: PropTypes.string,
    alertStyle: PropTypes.oneOf(['success', 'warning', 'danger', 'info'])
  };

  state = {
    show: false
  };

  componentDidMount() {
    if (this.props.message) {
      this.setState({ show: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.message && !prevState.show) {
      this.setState({ show: true });
    }
  }

  handleDismiss = () => {
    this.setState({ show: false });
  };

  render() {
    const { alertStyle, message } = this.props;

    if (!this.state.show) {
      return null;
    }

    return (
      <Alert bsStyle={alertStyle} onDismiss={this.handleDismiss}>
        <p>{message}</p>
      </Alert>
    );
  }
}

export default AlertContainer;
