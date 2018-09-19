import React, { Component} from 'react';
import structuralTree from '../data/sample-json3-edited.json';
import { connect } from 'react-redux';
import * as actions from '../actions/sm-data';

class SampleGenerateButtonContainer extends Component {
  handleBuildItClick = () => {
    this.props.buildSMUI(structuralTree);
  }

  render() {
    return (
      <section className="demo-html-structure-tree">
        <hr />
        <h4>HTML Structure Tree from hardcoded JSON</h4>
        <p><a href="../data/sample-json3.json" target="_blank">Uses this JSON file</a></p>
        <button onClick={this.handleBuildItClick} className="btn btn-default build-structure-button">Build It</button>
      </section>
    );
  }
}

export default connect(null, actions)(SampleGenerateButtonContainer);
