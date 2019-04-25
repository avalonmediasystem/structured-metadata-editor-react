import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Root from './Root';

const props = {
  baseURL: 'https://spruce.dlib.indiana.edu',
  masterFileID: 'd791sg30j',
  initStructure: '',
  mp3URL: ''
};

ReactDOM.render(<Root {...props} />, document.getElementById('root'));
registerServiceWorker();
