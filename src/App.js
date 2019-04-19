import React, { Component } from 'react';
import './App.css';
import WaveformContainer from './containers/WaveformContainer';
import ButtonSection from './components/ButtonSection';
import StructureOutputContainer from './containers/StructureOutputContainer';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

// Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faDotCircle,
  faMinusCircle,
  faPen,
  faSave,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
library.add(faDotCircle, faMinusCircle, faPen, faSave, faTrash);

class App extends Component {
  componentDidMount() {}
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className="container">
          <br />
          <WaveformContainer {...this.props.config} />
          <ButtonSection />
          <StructureOutputContainer {...this.props.config} />
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
