// react
import React, { useState, useEffect, useRef } from 'react'

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import {transform} from 'ol/proj'
import OSM from 'ol/source/OSM'

import {Control, defaults as defaultControls} from 'ol/control';

import {toStringXY} from 'ol/coordinate';

function MapElement(props) {

  // pull refs
  const mapElement_1 = useRef()
  

  var button_1_name,button_2_name;

  

  if (props.features.length!=0){
    button_1_name=props.features[0]["button"];
    button_2_name=props.features[1]["button"];
  }

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect( () => {

    class GoHome extends Control {
 
      constructor(opt_options) {
        console.log(opt_options)
        const options = opt_options || {};
        

        const button = document.createElement('button');
        

        const element = document.createElement('div');
        if (options=="M_H")
        {
          button.innerHTML = "M_H";
          element.className="M_H";
        }
        else
        {
          button.innerHTML = "S_H";
          element.className="S_H";
        }
        
        element.appendChild(button);

        
        super({
          element: element,
          target: options.target,
        });

        if (options=="M_H")
        {
          
          button.addEventListener('click', this.GoHome.bind(this), false);
        }
        else
        { 
            
            button.addEventListener('click', this.GoSecondHome.bind(this), false);
        }      
        }
      
      GoHome() {
        this.getMap().getView().setCenter([2634988.7369055296, 4585178.285664959]);
        this.getMap().getView().setZoom(17);
      }

      GoSecondHome() {
        this.getMap().getView().setCenter([28999.7369055296, 4585178.285664959]);
        this.getMap().getView().setZoom(17);
      }
    }


    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource()
    })

    // create map
    const map = new Map({
      controls: defaultControls().extend([new GoHome(button_1_name),new GoHome(button_2_name),new GoHome(button_1_name)]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: mapElement_1.current,
      view: new View({
        center: [0,0],
        zoom: 17,
        rotation: 0,
      }),
    });

  

  },[props.features])

  // update map if features prop changes - logic formerly put into componentDidUpdate


  // render component
  return (      
    <div>
      
      <div ref={mapElement_1} className="map-container"></div>
    

    </div>
  ) 

}

export default MapElement