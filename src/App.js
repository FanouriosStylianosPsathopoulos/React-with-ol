import './App.css';

// react
import React, { useState, useEffect } from 'react';

// openlayers
import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature';

// components
import MapElement from './components/MapWrapper'

function App() {
  


  // set intial state
  const [ features, setFeatures ] = useState([])

  
  
  return (
    <div className="App">
      
      <div className="app-label">
        <p>Web Map with React and OpenLayers</p>
        <p>Press button to move </p>
      </div>
      
      <MapElement features={features} />

    </div>
  )
}

export default App
