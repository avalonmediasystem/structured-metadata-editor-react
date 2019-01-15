import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class ErrorBoundary extends Component {
	state = {
		hasError: false,
		errorInfo: ''
	};

	componentDidCatch(error, info) {
		this.setState({
			hasError: true,
			errorInfo: error
		});
	}

	render() {
		if (this.state.hasError) {
			let errorInfo = this.state.errorInfo;
			switch (errorInfo.request.status) {
				case 401:
					return (
						<div>
							<Alert bsStyle="danger">
								<h4>Unauthorized to access the masterfile.</h4>
							</Alert>
						</div>
					);
				case 404:
					return (
						<div>
							<Alert bsStyle="danger">
								<h4>Requested masterfile not found at,</h4>
								<p>{errorInfo.request.responseURL}</p>
							</Alert>
						</div>
					);
				default:
					return (
						<div>
							<Alert bsStyle="danger">
								<h4>Network error, please try again!</h4>
							</Alert>
						</div>
					);
			}
		}
		return this.props.children;
	}
}
export default ErrorBoundary;
