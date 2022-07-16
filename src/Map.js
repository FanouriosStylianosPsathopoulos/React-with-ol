//arcgis
import { ApiKey } from '@esri/arcgis-rest-auth';
import { geocode } from '@esri/arcgis-rest-geocoding';
// react
import React, { useState, useEffect, useRef , Component} from 'react';
//css
import './Map.css';

//json
import {return_json} from './Create_json.js'
//swagger openapi

//import {ApartmentControllerApi} from './generated_sources/openapi/apis/ApartmentControllerApi.ts';

//axios api 
import {handle_connection} from './axios_api.js'


// openlayers
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import Draw from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Modify from 'ol/interaction/Modify';
import Fill from 'ol/style/Fill';
import {fromLonLat,transform} from 'ol/proj';
import {unByKey} from 'ol/Observable';

import VectorLayer from 'ol/layer/Vector';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Control, defaults as defaultControls} from 'ol/control';
import MapRenderer from 'ol/renderer/Map';


class Render_Map extends React.Component{
  constructor(props){
    super(props);
    this.map_element=React.createRef();
    this.Polygon_Create=this.Polygon_Create.bind(this);
    this.Destroy_Feature=this.Destroy_Feature.bind(this);
    this.Polygon_Behaviour=this.Polygon_Behaviour.bind(this);
    this.Draw_Points=this.Draw_Points.bind(this);
    this.GivemeInfo=this.GivemeInfo.bind(this);
    this.Destroy_Info=this.Destroy_Info.bind(this);
    this.AddPointOfInterest_withArcGis=this.AddPointOfInterest_withArcGis.bind(this);
    this.Reject_The_Point=this.Reject_The_Point.bind(this)
    this.Draw_Single_Point_on_Map=this.Draw_Single_Point_on_Map.bind(this)
    this.Single_Point=this.Single_Point.bind(this)
    //this.AddPointOfInterest=this.AddPointOfInterest.bind(this);
    this.AddApartment_withArcGis=this.AddApartment_withArcGis.bind(this)
    this.RemovePointsofInterest=this.RemovePointsofInterest.bind(this)
    this.Reset_state=this.Reset_state.bind(this)
    this.Point_added=this.Point_added.bind(this)
    this.state={
      map_n: '',
      event_k: '',
      point_added:false
    }
  }

  componentDidMount(){ 
    const raster = new TileLayer({
        source: new OSM(),
    });

    const map = new Map({
      controls: defaultControls({ attribution: false }),
      layers: [raster],
      target: this.map_element.current,
      view: new View({
      center: [-11000000, 4600000],
      zoom: 4,
      }),
  });

    this.setState((state) => ({
        map_n: map
      }))

    this.props.func_handle(map)
}

  Point_added(arg){
    this.setState({point_added:arg})
  }

  AddApartment_withArcGis(){
    const apiKey='AAPK4f3d7610cd654ce19c5f022d71cfbbd46lSICiq2GPfHm7h6fRrKXG4GL5WBYc22ZwVIG38cKg5U_fUydC2y_s0DkhOsMbNI'
    const basemapId = "ArcGIS:Navigation";
    const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + apiKey;

    const authentication = new ApiKey({
        key: apiKey
      });

    const center = transform(this.state.map_n.getView().getCenter(), "EPSG:3857", "EPSG:4326");
    
    geocode({
      singleLine: this.props.address,
      authentication,

      params: {
        outFields: "*",
        location: center.join(","),
        outSR: 3857 // Request coordinates in Web Mercator to simplify displaying
      }
    }).then((response) => {

    const result = response.candidates[0];

    if (result == null) {
        alert("That query didn't match any geocoding results.");
        return;
      }

    const coords = [result.location.x, result.location.y];

    
    this.props.coord_change(coords); 

    this.state.map_n.getView().setCenter(coords);

    var specific=this.state.map_n.getAllLayers()[1]

    

    //two cases , no defined layer
    if (specific==null){
      //create layer and add it to map 
      var features=[];
      const vectorSource = new VectorSource({
        features
      });
    
      const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              image: new CircleStyle({
              radius: 5,
              fill: new Fill({color: 'red'})
            })
          })
        });

      this.state.map_n.addLayer(vectorLayer);
      specific=this.state.map_n.getAllLayers()[1]
    }

    var new_features=[...specific.getSource().getFeatures()]

    

    var right_ones=transform(coords, 'EPSG:3857','EPSG:4326');
    this.props.coord_change(right_ones); 
    new_features.push(new Feature({
              
        geometry: new Point(fromLonLat([
          right_ones[0], right_ones[1]
        ]))
        }));

        var new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_ones[0], right_ones[1]
          ]))
          })
    
    this.Point_added(true)
    specific.getSource().addFeature(new_feature_to_make); 
    
    specific.changed()

    this.props.func_handle(this.state.map_n) //update map 

    
    //see if u want to keep the point 

    this.props.input_handle("New_Point")
  
    
})


  }
  AddPointOfInterest_withArcGis(){
    const apiKey='AAPK4f3d7610cd654ce19c5f022d71cfbbd46lSICiq2GPfHm7h6fRrKXG4GL5WBYc22ZwVIG38cKg5U_fUydC2y_s0DkhOsMbNI'
    const basemapId = "ArcGIS:Navigation";
    const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + apiKey;

    const authentication = new ApiKey({
        key: apiKey
      });

    const center = transform(this.state.map_n.getView().getCenter(), "EPSG:3857", "EPSG:4326");
    
    geocode({
      singleLine: this.props.address,
      authentication,

      params: {
        outFields: "*",
        location: center.join(","),
        outSR: 3857 // Request coordinates in Web Mercator to simplify displaying
      }
    }).then((response) => {

    const result = response.candidates[0];

    if (result == null) {
        alert("That query didn't match any geocoding results.");
        return;
      }

    const coords = [result.location.x, result.location.y];

    
    this.props.coord_change(coords); 

    this.state.map_n.getView().setCenter(coords);

    var specific=this.state.map_n.getAllLayers()[1]

    

    //two cases , no defined layer
    if (specific==null){
      //create layer and add it to map 
      var features=[];
      const vectorSource = new VectorSource({
        features
      });
    
      const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              image: new CircleStyle({
              radius: 5,
              fill: new Fill({color: 'red'})
            })
          })
        });

      this.state.map_n.addLayer(vectorLayer);
      specific=this.state.map_n.getAllLayers()[1]
    }

    var new_features=[...specific.getSource().getFeatures()]

    var right_ones=transform(coords, 'EPSG:3857','EPSG:4326');
    this.props.coord_change(right_ones); 
    new_features.push(new Feature({
              
        geometry: new Point(fromLonLat([
          right_ones[0], right_ones[1]
        ]))
        }));

        var new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_ones[0], right_ones[1]
          ]))
          })
    this.Point_added(true)
    
    specific.getSource().addFeature(new_feature_to_make); 
    
    specific.changed()

    this.props.func_handle(this.state.map_n) //update map 

    
    //see if u want to keep the point 

    this.props.input_handle("New_Point")
  
    
})

  }


  componentDidUpdate(prevProps, prevState, snapshot){
    
    var interactions=this.state.map_n.getInteractions()
    
    if (prevProps.map_features!=this.props.map_features){
  
      if (this.props.map_features[0]=="Polygon_Create"){
        if (this.props.map_features[1]==true){ //create feature 
          this.Polygon_Create()
        }
  
    }
      else if (this.props.map_features[0]=="GivemeInfo"){
        if (this.props.map_features[1]==true){ //create feature 
          this.GivemeInfo()
        }

      }
      else if (this.props.map_features[0]=="Address"){
        if (this.props.map_features[1]==true){ //create feature 
          this.AddPointOfInterest_withArcGis()
        }
  
      }
      else if (this.props.map_features[0]=="Draw Point"){
        if (this.props.map_features[1]==true){ //create feature 
          this.Draw_Single_Point_on_Map();
        }
        
      }
      else if (this.props.map_features[0]=="Add Apartment Address"){
        if (this.props.map_features[1]==true){ //create feature 
          this.AddPointOfInterest_withArcGis()
        }
      }
     
  }

  
  if (prevProps.reset_button!=this.props.reset_button && this.props.reset_button==true ){
    this.Reset_state()
  }

  if (prevProps.sub!=this.props.sub && this.props.sub=="Address"){
    var interactions=this.state.map_n.getInteractions()
    if (interactions!=null ){
      interactions.pop()
      this.props.func_handle(this.state.map_n)
      }
    }
}

  Draw_Single_Point_on_Map(){
    
    let draw; 
    const source = new VectorSource({wrapX: false});
    const value = "Point";
    if (value !== 'None') {
      draw = new Draw({
        source: source,
        type: value,
    });
    
    draw.on('drawend',this.Single_Point )
    this.state.map_n.addInteraction(draw);
    this.props.func_handle(this.state.map_n)

  }
  
}

Reset_state(){
  //check polygon interaction
  
  if (this.props.map_features[0]=="Polygon_Create"){
    this.Destroy_Feature()
    this.props.trigger_func()
  }
  else if (this.props.map_features[0]=="GivemeInfo"){
    this.props.trigger_func()
    this.Destroy_Info()
  }
  else if (this.props.map_features[0]=="Address"){
    this.Reject_The_Point();

    this.props.trigger_func()

    this.props.reset_func(false)

  }
  else if (this.props.map_features[0]=="Draw Point"){
    
    //this.props.reset_func(false)
    this.Reject_The_Point();
    var interactions=this.state.map_n.getInteractions()
    
    if (interactions!=null){
      interactions.pop()
      this.props.func_handle(this.state.map_n)
      }
      interactions=this.state.map_n.getInteractions()
      
      this.props.trigger_func()
      this.props.reset_func(false)

  }
  else if (this.props.map_features[0]==""){
    //check if any feature must be removed
    
    var interactions=this.state.map_n.getInteractions()
    
    if (interactions!=null && interactions.length>8){
    
    interactions.pop()
    this.props.func_handle(this.state.map_n)
    
    }
    
    //interactions=this.state.map_n.getInteractions()
    
    this.props.trigger_func()
    this.props.reset_func(false)
  }
  else if (this.props.map_features[0]=="Reject"){
    
    this.Reject_The_Point();
    this.props.trigger_func()
    this.props.reset_func(false)
    this.props.rejection_handle("Reject_of_poi")
  }
}
RemovePointsofInterest(){
  
  var interactions=this.state.map_n.getInteractions()
  if (interactions!=null){
  interactions.pop()
  }
  
  this.props.func_handle(this.state.map_n)
}
  Single_Point(evt){

    
    

    //get the coords
    var array_temp=evt.feature.getGeometry().getCoordinates();

    var specific=this.state.map_n.getAllLayers()[1]

    

    //two cases , no defined layer
    if (specific==null){
      //create layer and add it to map 
      var features=[];
      const vectorSource = new VectorSource({
        features
      });
    
      const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              image: new CircleStyle({
              radius: 5,
              fill: new Fill({color: 'red'})
            })
          })
        });

      this.state.map_n.addLayer(vectorLayer);
      specific=this.state.map_n.getAllLayers()[1]
    }

    var new_features=[...specific.getSource().getFeatures()]


    var right_ones=transform(array_temp, 'EPSG:3857','EPSG:4326');
    new_features.push(new Feature({
              
        geometry: new Point(fromLonLat([
          right_ones[0], right_ones[1]
        ]))
        }));

        var new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_ones[0], right_ones[1]
          ]))
          })
    
    this.props.coord_change(right_ones); 
    specific.getSource().addFeature(new_feature_to_make); 
    
    specific.changed()



    this.Point_added(true)
    this.props.func_handle(this.state.map_n) //update map 

    var interactions=this.state.map_n.getInteractions()
    if (interactions!=null){
    interactions.pop()
    }

    //see if u want to keep the point 

    this.props.input_handle("New_Point")
    
  }

  Reject_The_Point(){
    
    if(this.state.point_added==true){
    
    var specific=this.state.map_n.getAllLayers()[1]

    var new_features=[...specific.getSource().getFeatures()]

    var feature_for_removal=new_features.pop()

    specific.getSource().removeFeature(feature_for_removal)
    
    specific.changed();
    
    this.Point_added(false)
    this.props.func_handle(this.state.map_n)
    
    }
  }



  GivemeInfo(evt){
    //define the on event
    const inside_this=this //global
    var feature;

    var event_key=this.state.map_n.on('click', function (evt) {
        
        feature = inside_this.state.map_n.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
    
      });

        //give console input
        var msg_string,json='',coords;
        if (feature==null){
          msg_string="This is not a legit validated point to give you info about"
          inside_this.props.input_handle(msg_string)
        }
        else {
          coords=transform(feature.getGeometry().getCoordinates(), 'EPSG:3857','EPSG:4326') 
          var msg_string="The coords of the feature are: " + transform(feature.getGeometry().getCoordinates(), 'EPSG:3857','EPSG:4326')
          
          json=return_json("Info_Point",coords)
          console.log("Info point is ",JSON.stringify(json, null, 2))

          //var right_ones=transform(coords, 'EPSG:3857','EPSG:4326');
          //send the coords 
          var data;

          handle_connection("POST","pointInfo",json).then(val => {
              // got value here
              data=val
          
              inside_this.props.input_handle(data)
          })

         
          //msg_string=data;

        }

        //inside_this.props.input_handle(msg_string)
      
    })
    this.setState({event_k:event_key})
    
    this.props.func_handle(this.state.map_n)
}

  Polygon_Behaviour(evt){
    //get the coords
    var array_temp=evt.feature.getGeometry().getCoordinates();
    //var right_ones=transform(array_temp, 'EPSG:3857','EPSG:4326') 
  
    var right_ones = array_temp[0].map(x=> transform(x, 'EPSG:3857','EPSG:4326') )
    
    array_temp[0]=right_ones
    
    ///array_temp[0].push(array_temp[0][0])

    //make json to send to back-end
    
    var json=return_json("Polygon_json",array_temp)

  
    //send them to back-end and get Interesting Points
    //Send_Coords
    
    var data;

    handle_connection("POST","Polygon_Area",json).then(val => {
      // got value here
      data=val
  
      
      //inside_this.props.input_handle(data)
      
      if (data.general_points!=null){
       
        this.Draw_Points(data.general_points)
      }

  })

    //this.Draw_Points(array_temp[0][0])


    

  }

  Draw_Points(array_with_coords){
    var features = [], new_feature_to_make ;
    for (var i = 0; i <array_with_coords.length ; i++) {
      //var right_coords=transform(array_with_coords,'EPSG:3857','EPSG:4326')
      
      var right_coords=[array_with_coords[i].longitude,array_with_coords[i].latitude]
      //right_coords=transform(array_with_coords,'EPSG:4326','EPSG:3857')
    
      features.push(right_coords);

        new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_coords[0], right_coords[1]
          ]))
          })
        
    } 
   

    new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat(
            features
          ))
          })

    
    
    var specific=this.state.map_n.getAllLayers()[1]

    

    //two cases , no defined layer
    if (specific==null){
      //create layer and add it to map 
      
      var empty_set=[]
      const vectorSource = new VectorSource({
        empty_set
      });
    
      const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
              image: new CircleStyle({
              radius: 5,
              fill: new Fill({color: 'red'})
            })
          })
        });

      this.state.map_n.addLayer(vectorLayer);
      specific=this.state.map_n.getAllLayers()[1]
    }

    
    var new_features=[...specific.getSource().getFeatures()]

    


    for (var i = 0; i <array_with_coords.length ; i++) {
      //var right_coords=transform(array_with_coords,'EPSG:3857','EPSG:4326')
      
      var right_coords=[array_with_coords[i].longitude,array_with_coords[i].latitude]
      //right_coords=transform(array_with_coords,'EPSG:4326','EPSG:3857')
      
      //features.push(right_coords);

        new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_coords[0], right_coords[1]
          ]))
          })
        specific.getSource().addFeature(new_feature_to_make); 
        
    } 

    
    specific.changed()


    this.props.func_handle(this.state.map_n) //update map 


}

  Destroy_Info(){
    //unlisten the event 
    unByKey(this.state.event_k)

    this.setState({event_key:''})
  }
  Destroy_Feature(){
    
    var interactions=this.state.map_n.getInteractions()
    interactions.pop()
    this.props.func_handle(this.state.map_n)
  }

  Polygon_Create(){
    let draw; 
    const source = new VectorSource({wrapX: false});
    const value = "Polygon";
    if (value !== 'None') {
      draw = new Draw({
        source: source,
        type: value,
    });
    
    draw.on('drawend',this.Polygon_Behaviour );
    this.state.map_n.addInteraction(draw);
    this.props.func_handle(this.state.map_n)

    
    }
  }

  render(){

    return(
      <div>
      <div ref={this.map_element} className='Map'>
      </div>
      </div>
      )
    }
}


export default Render_Map;