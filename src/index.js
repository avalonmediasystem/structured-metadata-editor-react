import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Root from './Root';

const props = {
  baseURL: 'https://spruce.dlib.indiana.edu',
  masterFileID: 'sj1392061',
  initStructure: '',
  audioStreamURL:
    'https://spruce.dlib.indiana.edu/master_files/sj1392061/auto.m3u8'
};

ReactDOM.render(<Root {...props} />, document.getElementById('root'));
registerServiceWorker();
