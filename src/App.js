import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import MakeABlog from './components/MakeABlog'; // Adjust the import path as necessary



const App = () => {
  return (
    
    <Router>
      {/* Other routes can go here */}
      
      <MakeABlog />
      
      
      {/* More components or routes can go here */}
    </Router>
  );
};

export default App;
