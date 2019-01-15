import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import * as actions from '../actions/sm-data';
import APIUtils from '../api/Utils';
import * as showFormActions from '../actions/show-forms';

const apiUtils = new APIUtils();

class SampleGenerateButtonContainer extends Component {
	constructor(props) {
		super(props);
		this.smData = [];
	}
	state = { error: null };

	handleBuildItClick = () => {
		this.props.buildSMUI(this.smData);
	};

	handleSaveItClick = () => {
		let postData = { json: this.smData[0] };
		apiUtils
			.postRequest('structure.json', postData)
			.then(response => {
				this.props.handleSuccess(response);
			})
			.catch(error => {
				this.props.handleError(error);
				// this.setState({ error });
			});
	};

	async componentDidMount() {
		await apiUtils
			.getRequest('structure.json')
			.then(response => {
				const structureJS = response.data;
				this.smData = [structureJS];
				this.props.buildSMUI(this.smData);
			})
			.catch(error => {
				this.props.handleError(error);
				// this.setState({ error });
			});
	}

	render() {
		if (this.state.error) {
			throw this.state.error;
		}
		return (
			<section className="demo-html-structure-tree">
				<hr />
				<h4>HTML Structure Tree from sample master file in server</h4>
				<ButtonToolbar>
					<Button onClick={this.handleBuildItClick}>Build It</Button>
					<Button onClick={this.handleSaveItClick}>Save It</Button>
				</ButtonToolbar>
			</section>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	buildSMUI: smData => dispatch(actions.buildSMUI(smData)),
	handleSuccess: response => dispatch(showFormActions.handleSuccess(response)),
	handleError: response => dispatch(showFormActions.handleError(response))
});

export default connect(
	null,
	mapDispatchToProps
)(SampleGenerateButtonContainer);
