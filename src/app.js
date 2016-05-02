import Data from '../report/data.json';
import React from 'react';
import ReactDOM from 'react-dom';
import { LineChart } from 'react-d3';

console.log(Data);

class AristoleApp extends React.Component {
  render(){
    return <p>Test</p>;
  }
}

ReactDOM.render(<AristoleApp />, document.getElementById('app'));
