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
import axios from 'axios';

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
class Alert extends Component{
  constructor(props){
    
    super(props)
    
  }

  hit_alert(){
    window.alert("Your coordinates were successfully ");
    this.setState({

            response_id: 0
       });
    console.log(this.props.props_pass)
  }

  componentDidMount() {
    this.hit_alert()
  }

  componentDidUpdate(prevProps){
    console.log("poses",prevProps.props_pass,this.props.props_pass)
    if (prevProps.props_pass!=this.props.props_pass){
      this.hit_alert()
    }
    
    //this.send_lang_lat();
  }


   render(){
    return (      
      <div className="subclass_1">
    
      </div>
    );
}

}
//sth
class Post_Method extends Component{
  constructor(props){
    super(props)
    this.state={response_id: 0}
    this.var=0;
    
  }

  send_lang_lat(){
    const coords = this.props.prop_array;
    const baseURL="https://jsonplaceholder.typicode.com/posts";
    axios
      .post(baseURL, coords)
      .then((response) => {
        this.var=response.status
        if (this.state.response_id==response.status) {

        this.setState({

            response_id: response.status + 1
       });
      }
      else{
        this.setState({

            response_id: response.status
       });
      }
      });
    
  }

  componentDidMount() {
    
    this.send_lang_lat();
  }

  componentDidUpdate(prevProps){
  

    if (prevProps.prop_array!=this.props.prop_array)
    {
        this.send_lang_lat();
    }
    //this.send_lang_lat();
  }
  
  render(){
    return (      
      <div className="subclass_1">
      {(this.state.response_id!=0) ? <Alert props_pass={this.state.response_id}/> : null }

      </div>
    );
}
}


function MapElement(props) {

  // pull refs
  
  const mapElement_1 = useRef()
  
  const type_element_1= useRef()

  var button_1_name,button_2_name,long_1,long_2,lat_1,lat_2;

  const [array_with_cords, set_cords] = useState([]);

  const [boolean_value,set_bool]=useState(5==6);
  const typical_array=new Array();

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
    draw.on('drawend', function(evt) { 
      //console.log("sth",evt.feature.getGeometry().getCoordinates());
      var array_temp=evt.feature.getGeometry().getCoordinates();
      set_cords(array_temp);
      set_bool(5==5)
      console.log(array_with_cords,array_temp)
      //console.log(boolean_value);
    });
  }


    function add(event)
    {
      if (typical_array.length==0) {
        typical_array.push(event.coordinate);
      }
      else if (typical_array.includes(event.coordinate)){
        set_cords(typical_array);
        typical_array=[]

      }
      else{
        typical_array.push(event.coordinate);
      }

      //console.log(event.coordinate)
      //console.log("The array is",typical_array)
      
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

    {boolean_value ? <Post_Method prop_array={array_with_cords}/> : null}
    </div>
  ) 

}
export default MapElement;
