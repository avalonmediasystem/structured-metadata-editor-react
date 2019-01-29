import React, { Component } from 'react';
import './App.css';
import Waveform from './components/Waveform';
import ButtonSection from './components/ButtonSection';
import StructureOutputContainer from './containers/StructureOutputContainer';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDotCircle, faMinusCircle, faPen, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
library.add(faDotCircle, faMinusCircle, faPen, faSave, faTrash);

class App extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Test Structural Metadata Editor</h1>
          <Waveform />
          <ButtonSection />
          <StructureOutputContainer />
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
