// react
import React, { useState, useEffect, useRef , Component} from 'react'

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import XYZ from 'ol/source/XYZ'
import {transform} from 'ol/proj'
import {OSM, Vector as VectorSource} from 'ol/source';


import {Control, defaults as defaultControls} from 'ol/control';

import {toStringXY} from 'ol/coordinate';


/*class Go_2_Home extends Component{

  
  
  constructor(props){
    console.log("sth spectacular");
    super(props);
    console.log(props);
    this.button=props;
    this.mapElement_1 = React.createRef() ;
  
    this.type_element_1= React.createRef();
  }
  
  componentDidMount(){
    
    console.log("logic message",this.button.other[0])
  }
  render(){
    return (      
      <div className="subclass_1">
        
        <div ref={this.mapElement_1} className="subclass_2"></div>
        <form className="subclass_3" >
        <label>Geometry type: &nbsp;</label>
        <select ref={this.type_element_1} id="subclass_4">
          <option value="Point">Point</option>
          <option value="LineString">LineString</option>
          <option value="Polygon">Polygon</option>
          <option value="Circle">Circle</option>
          <option value="None">None</option>
        </select>
      </form>
      </div>
    );
}

} */


function MapElement(props) {

  // pull refs
  const mapElement_1 = useRef()
  
  const type_element_1= useRef()

  var button_1_name,button_2_name,long_1,long_2,lat_1,lat_2;

  

  if (props.other.length!=0){
    button_1_name=props.other[0]["button"];
    button_2_name=props.other[1]["button"];
    
    long_1=props.other[0]["longitude"];
    lat_1=props.other[0]["latitude"];

    long_2=props.other[0]["longitude"];
    lat_2=props.other[0]["latitude"];
  }

  class GoHome extends Control {
      options_new="";
      constructor(opt_options) {

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
        
        super({
          element: element,
          target: options.target,
        });

        this.options_new=options;
        
        if (options=="M_H")
        {
          
          button.addEventListener('click', this.GoHome.bind(this), false);
          element.myParam = options;
        }
        else
        { 
            
            button.addEventListener('click', this.GoSecondHome.bind(this), false);
            element.myParam = options;
            
        }      
        
        element.appendChild(button);
        }
      
      GoHome() {
        
        this.getMap().getView().setCenter([lat_1,long_1]);
        this.getMap().getView().setZoom(10);
      }

      GoSecondHome() {
        
        this.getMap().getView().setCenter([long_2, lat_2]);
        this.getMap().getView().setZoom(10);
      }
    }


    
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource()
    })


    // create map
    const map = new Map({
      controls: defaultControls().extend([new GoHome(button_1_name),new GoHome(button_2_name)]),
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
    
    let draw; 
    const source = new VectorSource({wrapX: false});
    
    function addInteraction() {
      const value = "Polygon";
      if (value !== 'None') {
        draw = new Draw({
          source: source,
          type: value,
        });
        map.addInteraction(draw);
    }
  }
    function add(event)
    {
      
      console.log(event.coordinate)
      
    }
    map.addEventListener("click",add)

  addInteraction();
  // render component
  return (      
    <div className="subclass">
      
      <div ref={mapElement_1} className="map-container"></div>
      <form className="ok" >
      <label>Geometry type: &nbsp;</label>
      <select ref={type_element_1} id="type">
        <option value="Point">Point</option>
        <option value="LineString">LineString</option>
        <option value="Polygon">Polygon</option>
        <option value="Circle">Circle</option>
        <option value="None">None</option>
      </select>
    </form>
    </div>
  ) 

}
export default MapElement;
