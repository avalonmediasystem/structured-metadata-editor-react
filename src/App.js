import React, { Component } from 'react';
import './App.css';
import Waveform from './components/Waveform';
import ButtonSection from './components/ButtonSection';
import HeadingFormContainer from './containers/HeadingFormContainer';
import TimespanFormContainer from './containers/TimespanFormContainer';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Test Structural Metadata Editor</h1>
        <Waveform />
        <ButtonSection />
        <HeadingFormContainer />
        <TimespanFormContainer />
      </div>
    );
  }
}

export default App;
