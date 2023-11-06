import React from "react";
import './App.css';
import NavBar from './NavBar.js'
import ImageGenForm from './ImageGenForm.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

  return (

    <Router>

      <NavBar/>

      <Routes>
      <Route path="/" element={<ImageGenForm />} />
      </Routes>

  </Router>
  );


}

export default App;

