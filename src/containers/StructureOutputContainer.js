import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../components/List';
import ModalContainer from './ModalContainer';

class StructureOutputContainer extends Component {
  render() {
    const { smData = [] } = this.props;

    return (
      <section>
        <hr />
        <h2>Output</h2>
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
