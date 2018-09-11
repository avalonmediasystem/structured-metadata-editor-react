import React, { Component } from 'react';
import './App.css';
import Waveform from './components/Waveform';
import ButtonSection from './components/ButtonSection';
import HeadingFormContainer from './containers/HeadingFormContainer';
import TimespanFormContainer from './containers/TimespanFormContainer';
import SampleGenerateButtonContainer from './containers/SampleGenerateButtonContainer';
import StructureOutputContainer from './containers/StructureOutputContainer';

// Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faPen, faTrash);

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Test Structural Metadata Editor</h1>
        <Waveform />
        <ButtonSection />
        <HeadingFormContainer />
        <TimespanFormContainer />
        <StructureOutputContainer />
        <SampleGenerateButtonContainer />
      </div>
    );
  }
}

export default App;
