import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../components/List';
import ModalContainer from './ModalContainer';
import GenerateStructureContainer from './GenerateStructureContainer';

class StructureOutputContainer extends Component {
	render() {
		const { smData = [] } = this.props;

		return (
			<section>
				<hr />
				<h3>HTML Structure Tree from a masterfile in server</h3>
				<br />
				<GenerateStructureContainer />
				<List items={smData} />
				<ModalContainer />
			</section>
		);
	}
}

const mapStateToProps = state => ({
	smData: state.smData
});

export default connect(mapStateToProps)(StructureOutputContainer);
