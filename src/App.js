import React, { Component } from 'react';
import './App.css';
import Waveform from './components/Waveform';
import ButtonSection from './components/ButtonSection';
import HeadingFormContainer from './containers/HeadingFormContainer';
import TimespanFormContainer from './containers/TimespanFormContainer';
import SampleGenerateButtonContainer from './containers/SampleGenerateButtonContainer';
import StructureOutputContainer from './containers/StructureOutputContainer';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDotCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faDotCircle, faPen, faTrash);

class App extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Test Structural Metadata Editor</h1>
          <Waveform />
          <SampleGenerateButtonContainer />
          <ButtonSection />
          <HeadingFormContainer />
          <TimespanFormContainer />
          <StructureOutputContainer />
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
