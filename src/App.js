import {BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import './App.css';
import ProductList from './components/ProductList';
import ProductAdd from './components/ProductAdd';
// import Form from './components/form'
import React, { useState } from 'react'

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route index element={<ProductList />} />
          <Route path='/addproduct' element={<ProductAdd />} />
        </Routes>
      </div>
    </Router>
  );
}
// function App() {
//   return (
//     <div className="App">
//       <ProductAdd/>
//     </div>
//   );
// }

export default App;
