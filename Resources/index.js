import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
//import './index.css';
import About from './About';

<Route path="/about" component={About}/>

const App = () => (
  <Router>
    <div>
      Hi there
      <Route path="/about" component={About}/>
    </div>
  </Router>
)

ReactDOM.render(<App />, document.getElementById('container'));