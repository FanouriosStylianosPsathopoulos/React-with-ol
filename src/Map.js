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

    console.log("Arcgis is ",coords)
    this.props.coord_change(coords); 

    this.state.map_n.getView().setCenter(coords);

    var specific=this.state.map_n.getAllLayers()[1]

    console.log("Specific is ",specific)

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

    console.log("New features are",new_features)

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

    console.log("Arcgis is ",coords)
    this.props.coord_change(coords); 

    this.state.map_n.getView().setCenter(coords);

    var specific=this.state.map_n.getAllLayers()[1]

    console.log("Specific is ",specific)

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

    console.log("New features are",new_features)

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
    //console.log("Props are ",this.props)
    var interactions=this.state.map_n.getInteractions()
    console.log("intereactions are 2 ",interactions)
    if (prevProps.map_features!=this.props.map_features){
      console.log("Props are ",this.props,this.props.map_features[0])
      console.log(this.props.map_features)
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
     /* else if (this.props.map_features[0]=="Reject"){
        console.log("EDW POSES FORES GAMW ",this.props.map_features)
        //reject the point
          this.Reject_The_Point()
          var interactions=this.state.map_n.getInteractions()
          if (interactions!=null){
            interactions.pop()
            this.props.func_handle(this.state.map_n)
        }
        //reset the option for poi

          this.props.rejection_handle("Reject_of_poi")
          console.log("to etrexes")
        } */
  }

  console.log(prevProps.reset_button,this.props.reset_button)
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
    console.log("Single point on Map ")
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
  console.log("Re kwlopaidi",this.props.map_features)
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
    console.log("Optimistic ")
    //this.props.reset_func(false)
    this.Reject_The_Point();
    var interactions=this.state.map_n.getInteractions()
    console.log("intereactions are ",interactions)
    if (interactions!=null){
      interactions.pop()
      this.props.func_handle(this.state.map_n)
      }
      interactions=this.state.map_n.getInteractions()
      console.log("intereactions are ",interactions)
      this.props.trigger_func()
      this.props.reset_func(false)

  }
  else if (this.props.map_features[0]==""){
    //check if any feature must be removed
    console.log("edw mallon gia to keno")
    var interactions=this.state.map_n.getInteractions()
    console.log("intereactions are ",interactions)
    console.log("mphke 1")
    if (interactions!=null && interactions.length>8){
    console.log("mphke 2")
    interactions.pop()
    this.props.func_handle(this.state.map_n)
    
    }
    console.log("mphke 3")
    //interactions=this.state.map_n.getInteractions()
    //console.log("intereactions are ",interactions)
    this.props.trigger_func()
    this.props.reset_func(false)
  }
  else if (this.props.map_features[0]=="Reject"){
    console.log("edw pera")
    this.Reject_The_Point();
    this.props.trigger_func()
    this.props.reset_func(false)
    this.props.rejection_handle("Reject_of_poi")
  }
}
RemovePointsofInterest(){
  console.log("Remove")
  var interactions=this.state.map_n.getInteractions()
  if (interactions!=null){
  interactions.pop()
  }
  
  this.props.func_handle(this.state.map_n)
}
  Single_Point(evt){

    console.log("Not")
    //const features = [];

    //get the coords
    var array_temp=evt.feature.getGeometry().getCoordinates();

    var specific=this.state.map_n.getAllLayers()[1]

    console.log("Specific is ",specific)

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

    console.log("New features are",new_features)

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

    console.log("Ws edw ")
    //see if u want to keep the point 

    this.props.input_handle("New_Point")
    
  }

  Reject_The_Point(){
    console.log("U are trying to reject point ")
    if(this.state.point_added==true){
    console.log("U are inside of reject ")
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
          console.log(msg_string)
          json=return_json("Info_Point",coords)
          console.log("Info point is ",JSON.stringify(json, null, 2))

          //var right_ones=transform(coords, 'EPSG:3857','EPSG:4326');
          //send the coords 
          var data;

          handle_connection("POST","pointInfo",json).then(val => {
              // got value here
              data=val
          
              console.log("Print this",data.description)
              inside_this.props.input_handle(data)
          })

          //console.log("tsouftsis")
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
    //console.log("Sick and tired",array_temp)
    //console.log("Bre makaka",array_temp[0][0],transform(array_temp[0], 'EPSG:3857','EPSG:4326'))
    var right_ones = array_temp[0].map(x=> transform(x, 'EPSG:3857','EPSG:4326') )
    
    console.log("Previous are ",array_temp[0])
    //console.log(right_ones)
    
    array_temp[0]=right_ones
    
    ///array_temp[0].push(array_temp[0][0])

    //make json to send to back-end
    
    var json=return_json("Polygon_json",array_temp)

    


    console.log("Json is: ",JSON.stringify(json, null, 2));
    //console.log("Right ones",right_ones)
    //send them to back-end and get Interesting Points
    //Send_Coords
    
    var data;

    handle_connection("POST","Polygon_Area",json).then(val => {
      // got value here
      data=val
  
      console.log("Print this",data)
      //inside_this.props.input_handle(data)
      
      if (data.general_points!=null){
        console.log("Not null")
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
      console.log("Right coords are ",right_coords)
      features.push(right_coords);

        new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_coords[0], right_coords[1]
          ]))
          })
        console.log("Right results",new_feature_to_make)
    } 
   
    console.log("Feature coords are ",features)

    new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat(
            features
          ))
          })

    console.log("Wrons results",new_feature_to_make)
    
    var specific=this.state.map_n.getAllLayers()[1]

    console.log("Specific is ",specific)

    //two cases , no defined layer
    if (specific==null){
      //create layer and add it to map 
      console.log("so")
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

    console.log(specific)
    var new_features=[...specific.getSource().getFeatures()]

    console.log("New features are",new_features)


    for (var i = 0; i <array_with_coords.length ; i++) {
      //var right_coords=transform(array_with_coords,'EPSG:3857','EPSG:4326')
      
      var right_coords=[array_with_coords[i].longitude,array_with_coords[i].latitude]
      //right_coords=transform(array_with_coords,'EPSG:4326','EPSG:3857')
      console.log("Right coords are ",right_coords)
      //features.push(right_coords);

        new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_coords[0], right_coords[1]
          ]))
          })
        specific.getSource().addFeature(new_feature_to_make); 
        console.log("Right results",new_feature_to_make)
    } 

    //var right_ones=transform(coords, 'EPSG:3857','EPSG:4326');
    //this.props.coord_change(right_ones); 
    /*new_features.push(new Feature({
              
        geometry: new Point(fromLonLat([
          right_ones[0], right_ones[1]
        ]))
        }));

      var new_feature_to_make= new Feature({ 
          geometry: new Point(fromLonLat([
            right_ones[0], right_ones[1]
          ]))
          }) */
    
    //specific.getSource().addFeature(new_feature_to_make); 
    
    specific.changed()

    console.log("New features are",specific.getSource().getFeatures())

    this.props.func_handle(this.state.map_n) //update map 


    /* const features = [];
    const getRandomNumber = function (min, ref) {
      return Math.random() * ref + min;
    }
    for (var i = 0; i < 1; i++) {
      var right_coords=transform(array_with_coords,'EPSG:3857','EPSG:4326')
      
      features.push(new Feature({
        
        geometry: new Point(fromLonLat([
          right_coords[0], right_coords[1]
        ]))
        }));
    } 
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

    //this.props.func_handle(this.state.map_n); */


}

  Destroy_Info(){
    //unlisten the event 
    unByKey(this.state.event_k)

    this.setState({event_key:''})
  }
  Destroy_Feature(){
    console.log("tsoutse")
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
    console.log("Just the Map render first ",this.state.map_n)
    console.log("Just the Map render  ",this.state.event_k)
    console.log("Just the Map render last ",this.state.point_added)

    return(
      <div>
      <div ref={this.map_element} className='Map'>
      </div>
      </div>
      )
    }
}
/*
class Render_Map extends React.Component{
    constructor(props){
        super(props);
        this.map_element=React.createRef();
        this.Polygon_Create=this.Polygon_Create.bind(this)
        this.Helper=this.Helper.bind(this)
        this.CloseButton=this.CloseButton.bind(this)
        this.GivemeInfo=this.GivemeInfo.bind(this)
        this.AddPointOfInterest=this.AddPointOfInterest.bind(this)
        this.HomeForRent=this.HomeForRent.bind(this)
        this.state={
            map_n:"",
            cords : [],
            bool_val : false,
            screen : false ,
            screen_input : '',
            form_for_poi : false,
            form_for_rent :false
        }
    }
    
    componentDidMount(){ 
        const raster = new TileLayer({
            source: new OSM(),
        });


        const map = new Map({
            controls: defaultControls(),
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

          
    }

    HomeForRent(){
      this.setState({form_for_rent:true})
    }


    AddPointOfInterest(){
      this.setState({form_for_poi:true})
    }

    CloseButton(){
      this.setState({screen:false})
    }
    
    Helper(array_cords,bool_change){
        this.setState((state) => ({
            cords: array_cords
          }))
        this.setState((state) => ({
            bool_val: bool_change
          }))

    }

    GivemeInfo(event){

      const fund_this=this;
      console.log("msg",fund_this.state.map_n)
          
      fund_this.state.map_n.on('click', function (evt) {
          console.log("That was an interaction.")
          const feature = fund_this.state.map_n.forEachFeatureAtPixel(evt.pixel, function (feature) {
            return feature;
      
      });

        /*console.log(feature)
        console.log(transform(feature.getGeometry().getCoordinates(), 'EPSG:3857','EPSG:4326'))
        console.log(fund_this.state.screen_input) */
      /*
        if (feature==null){
          var msg_string="This is not a legit point of interest to give you info about"
          fund_this.setState((state) => ({
            screen_input: msg_string
          }))

        }
        else {
          var msg_string="The coords of the feature are: " + transform(feature.getGeometry().getCoordinates(), 'EPSG:3857','EPSG:4326')
          fund_this.setState((state) => ({
            screen_input: msg_string
          }))
        }

        fund_this.setState({screen:true})
          //console.log("feature is ",feature,feature.getGeometry().getCoordinates(),transform(feature.getGeometry().getCoordinates(), 'EPSG:3857','EPSG:4326'))
          //console.log("The coordinate  is", evt.coordinate)
          //console.log("Shhh",transform(evt.coordinate, 'EPSG:3857','EPSG:4326'))
        })


    }


    Polygon_Create(event){
  
      function features_func(){
        console.log("tipota apolutws")
      }  
      
      
      let draw; 
      const source = new VectorSource({wrapX: false});
      const value = "Polygon";
      if (value !== 'None') {
            draw = new Draw({
            source: source,
            type: value,
          });
          this.state.map_n.addInteraction(draw);
      }
      const land_this=this
      var array_temp,bool;
      const getRandomNumber = function (min, ref) {
        return Math.random() * ref + min;
      }
      function myFunc(evt)
      {
        console.log(evt);
        console.log("cords",land_this.state.cords)
        array_temp=evt.feature.getGeometry().getCoordinates();
        bool=false;
        
        land_this.setState((state) => ({
            cords: array_temp
          }))
        land_this.setState((state) => ({
            bool_val: bool
          }))
      
        
        //send to api the coords 

        //receive the interesting points

        const features = [];
        
        for (var i = 0; i < 5; i++) {
          var x =-getRandomNumber(50, 50) 
          var y = getRandomNumber(10, 50)
          console.log("Coords",x,y)  
          features.push(new Feature({
            
            geometry: new Point(fromLonLat([
                x, y
            ]))
            }));
        }
      

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
          
          console.log(land_this.state.map_n)
          
          const modify = new Modify({source: source});

          land_this.state.map_n.addInteraction(modify);

          land_this.state.map_n.addLayer(vectorLayer);

          land_this.state.map_n.removeInteraction(draw);
    }
     
      draw.on('drawend',myFunc );

      
    }
    render(){
      var button_of_console,form_of_poi,form_of_rent;
      if (this.state.screen==true){
            button_of_console=<Console input={this.state.screen_input} bool_val={this.state.screen}/>
      }
      else{
            button_of_console=""
      }

      if (this.state.form_for_poi==true){
        form_of_poi=<Form input={this.state.map_n} arg="form_for_poi"/>
      }
      else{
        form_of_poi=""
      }

      if (this.state.form_for_rent==true){
        form_of_rent=<Form input={this.state.map_n} arg="form_for_rent"/>
      }
      else{
        form_of_rent=""
      }

      return(
        <div>
        <div ref={this.map_element} className='Map'>
        </div>
        <div>
            {console.log("button")}
            <button onClick={this.Polygon_Create} >Interest Points </button>
            <button onClick={this.GivemeInfo}>Give me Info</button>
            <button onClick={this.AddPointOfInterest}>Add Point of Interest</button>
            <button onClick={this.HomeForRent}>Add Home for Rent</button>
        </div>
        <div >
        {button_of_console}
        </div>
        <div>
          {form_of_poi}
          {form_of_rent}
        </div>
        </div>
        )
    }
}



class Console extends React.Component{

  constructor(props){
    super(props)
  }
  render(){
    
    const mystyle = {
      color: "white",
      height: "80%",
      marginTop : "1%", 
      marginLeft : "75%",
      backgroundColor: "DodgerBlue",
      padding: "10px",
      fontFamily: "Arial"
    };

    var button;
    console.log(this.props.input)
    if (this.props.input=="Is this the right spot?") {
      button=
      <div>
      <p>{this.props.input}</p>
      <button onClick={this.props.func_2}>Yes</button>
      <button onClick={this.props.func}>No</button>
      </div>
    }
    else{
      button=<div>
        <p>
          {this.props.input}
        </p>
      </div>
    }
    return(
      <div style={mystyle} >
        <h3> Console </h3>
        {button}

      </div>
    )
  }
}


class Form extends React.Component{
  constructor(props){
    super(props)

    this.drawInput=this.drawInput.bind(this)
    this.addressInput=this.addressInput.bind(this)
    this.ArcGIS=this.ArcGIS.bind(this)
    this.ChangeInput=this.ChangeInput.bind(this)
    this.remove_Coord=this.remove_Coord.bind(this)
    this.keep_Coord=this.keep_Coord.bind(this)
    
    this.state={
      button_of_input : "",
      changing_input:"",
      address: "",
      console_log: false
    }
  }

  ChangeInput(event){
    this.setState({changing_input:event.target.value})
  }
  ArcGIS(event){
    event.preventDefault();

    this.setState({address:this.changing_input})
    //console.log("Center is ")
    const apiKey='AAPK4f3d7610cd654ce19c5f022d71cfbbd46lSICiq2GPfHm7h6fRrKXG4GL5WBYc22ZwVIG38cKg5U_fUydC2y_s0DkhOsMbNI'
    const basemapId = "ArcGIS:Navigation";
    const basemapURL = "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/" + basemapId + "?type=style&token=" + apiKey;
    //console.log("Center is ")

    const authentication = new ApiKey({
      key: apiKey
    });

    //console.log("Center is ")
    const center = transform(this.props.input.getView().getCenter(), "EPSG:3857", "EPSG:4326");

    //console.log("Center is ",center)

    //geocode
    //console.log("It is ",this.state.address,event.target.value,this.state.changing_input)
    geocode({
      singleLine: this.state.changing_input,
      authentication,

      params: {
        outFields: "*",
        location: center.join(","),
        outSR: 3857 // Request coordinates in Web Mercator to simplify displaying
      }
    }).then((response) => {

    const result = response.candidates[0];
    //console.log(result)
    if (result == null) {
      alert("That query didn't match any geocoding results.");
      return;
     }

    const coords = [result.location.x, result.location.y];
    //console.log("Coords are",coords)

    this.props.input.getView().setCenter(coords);

    //console.log(this.props.input.getAllLayers())
    var specific=this.props.input.getAllLayers()[1]

    //console.log(specific.getSource())

    var new_features=[...specific.getSource().getFeatures()]


    //console.log("asta",new_features)
    //console.log(transform(coords, 'EPSG:3857','EPSG:4326'),coords)
    var right_ones=transform(coords, 'EPSG:3857','EPSG:4326');
    new_features.push(new Feature({
            
      geometry: new Point(fromLonLat([
        right_ones[0], right_ones[1]
      ]))
      }));

    //this layer

    var new_feature_to_make= new Feature({ 
      geometry: new Point(fromLonLat([
        right_ones[0], right_ones[1]
      ]))
      })

    specific.getSource().addFeature(new_feature_to_make); 

    specific.changed()

    console.log(specific.getSource().getFeatures())
    /*
    const vectorSource = new VectorSource({
        features:new_features
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
    const raster = new TileLayer({
        source: new OSM(),
    });
    //this.props.input.removeLayer(this.props.input.getAllLayers()[0])
    this.props.input.removeLayer(specific)
    // this.props.input.getAllLayers()[1].setSource(source_ex)
    //this.props.input.getAllLayers()[1].changed()
    //console.log("asta",new_features)
    //console.log("ws edw")
    //console.log(this.props.input.getAllLayers())
    //this.props.input.addLayer(raster)
    this.props.input.addLayer(vectorLayer)
    
    specific=this.props.input.getAllLayers()[1]
    
    //console.log("specific is ", specific,specific.getSource(),specific.getSource().getFeatures())
    //console.log("see it with my own wyes ",specific.getSource().getFeatures())
    //console.log("2 ",specific.getSource().getFeatures())
    //console.log(this.props.input.layers)
    //console.log(this.props.input.getAllLayers())

    */
    //this.setState({console_log:true})  
 // })
    //response.candidates[0].location;  });
    
  /*
}

  keep_Coord(event){
    event.preventDefault()
    this.setState({console_log:false}) 
  }
  remove_Coord(event){
    event.preventDefault()
    console.log("remove cord")


    var specific=this.props.input.getAllLayers()[1]

    var new_features=[...specific.getSource().getFeatures()]

    new_features.pop()

    const vectorSource = new VectorSource({
        features:new_features
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
    const raster = new TileLayer({
        source: new OSM(),
    });
    //this.props.input.removeLayer(this.props.input.getAllLayers()[0])
    this.props.input.removeLayer(specific)

    this.props.input.addLayer(vectorLayer)

    this.setState({console_log:false}) 

  }

  drawInput(){
    this.setState({button_of_input:"draw_input"})
  }
  
  addressInput(){

    this.setState({button_of_input:"address_input"})
  }
  
  render(){
    var button_render,button_console;
    if (this.props.arg=="form_for_poi"){
      var mid_button,button_console;
      
      if (this.state.console_log==true){
        console.log("sigoura edw 1")
        button_console=<Console input="Is this the right spot?" func={this.remove_Coord} func_2={this.keep_Coord}/>
      }
      // this.drawInput onClick={this.addressInput}
      if (this.state.button_of_input==''){
        mid_button= <div>
          <button onClick={this.drawInput}>Input with draw </button>
          <button onClick={this.addressInput}>Input with address </button>
          <br/>
        </div>

        button_render= <form>    
        {mid_button}
        <label>Choose the type of point of interest </label>
        <select >
          <option value="School">School</option>
          <option value="Hospital">Hospital</option>
          <option value="Market">Market</option>
        </select>
      </form>
      }
      else if (this.state.button_of_input=='address_input') {
        console.log("sigoura edw 2")
        mid_button= <div>
          <label>Give the address of the point of interest </label>
          <input type='text' onChange={this.ChangeInput} value={this.state.changing_input}></input>
          <button  onClick={this.ArcGIS}>Search</button>
          <br/>
          {button_console}
        </div>
        button_render=<form>    
        {mid_button}
        <label>Choose the type of point of interest </label>
        <select >
          <option value="School">School</option>
          <option value="Hospital">Hospital</option>
          <option value="Market">Market</option>
        </select>
      </form>
      }
      else{
        mid_button=''
      }
    }
    else {
      var html_form_for_rent= <div>
      Price  <input type="number"></input> <br/>
      Area in square  <input type="number"></input><br/>
      Floor  <input type="number"></input><br/>
      Maintenance Fees  <input type="number"></input><br/>
      Construction Year  <input type="number"></input><br/>
      Description  <input type="text"></input> <br/>
      <button>Submit</button>
      </div>
      console.log(this.props.arg)
      var mid_button,button_console;
      if (this.state.console_log==true){
        console.log("sigoura edw 1")
        button_console=<Console input="Is this the right spot?" func={this.remove_Coord} func_2={this.keep_Coord}/>
      }
      if (this.state.button_of_input==''){
        mid_button= <div>
          <button onClick={this.drawInput}>Input with draw </button>
          <button onClick={this.addressInput}>Input with address </button>
          <br/>
        </div>

        button_render= <form>    
        {mid_button}
        
      </form>
      }
      else if (this.state.button_of_input=='address_input') {
        console.log("sigoura edw 2")
        mid_button= <div>
          <label>Give the address of the house you want to rent </label>
          <input type='text' onChange={this.ChangeInput} value={this.state.changing_input}></input>
          <button  onClick={this.ArcGIS}>Search</button>
          <br/>
          {html_form_for_rent}
          {button_console}
        </div>
        button_render=<form>    
        {mid_button}
      </form>
      }
      else{
        mid_button=''
      }
    }
    

    return(
      <div >
        {button_render}
      </div>
    )
  }
}



/*function Render_Map(){
    const map_element = useRef()
    const [array_with_cords, set_cords] = useState([]);

    const [boolean_value,set_bool]=useState(5==6);
    const typical_array=new Array();
    
    useEffect(() => {
        
        const raster = new TileLayer({
            source: new OSM(),
        });


        const map = new Map({
            controls: defaultControls(),
            layers: [raster],
            target: map_element.current,
            view: new View({
            center: [-11000000, 4600000],
            zoom: 4,
            }),
        });
    
        let draw; 
        const source = new VectorSource({wrapX: false});
          
        function Polygon_Create() {
            const value = "Polygon";
            if (value !== 'None') {
                draw = new Draw({
                source: source,
                type: value,
              });
              map.addInteraction(draw);
          }
          draw.on('drawend', function(evt) { 
            
            var array_temp=evt.feature.getGeometry().getCoordinates();
            set_cords(array_temp);
            set_bool(5==5)
            console.log(array_with_cords,array_temp)
            //console.log(boolean_value);
          });
        }
    
    
    
    });
    
    
    
    

    return(
        <div>
        <div ref={map_element} className='Map'>
        </div>
        <div>
            <button onClick={Polygon_Create}>Interest Points </button>
        </div>
        </div>
    )
} */

export default Render_Map;