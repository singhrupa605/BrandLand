import React from 'react';
import { Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import DataTable from "./components/Table"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path = "/table" element ={<DataTable/>} />
      </Routes>
    </div>
  );
}

export default App;
