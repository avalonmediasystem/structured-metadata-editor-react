import React, { Component} from 'react';

class SampleGenerateButtonContainer extends Component {
  render() {
    return (
      <section className="demo-html-structure-tree">
        <hr />
        <h4>HTML Structure Tree from hardcoded JSON</h4>
        <button id="build-structure-button" className="btn btn-default build-structure-button">Build It</button>
        <button id="build-flat-structure-button" className="btn btn-default build-structure-button">Build From Flat List</button>

        <section id="mount-nested-list"></section>

      </section>
    );
  }
}

export default SampleGenerateButtonContainer;
