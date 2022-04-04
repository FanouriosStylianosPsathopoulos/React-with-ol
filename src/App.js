import logo from './logo.svg';
import './App.css';
import './Map.css';
import styles from  './mystyle.module.css';
import Render_Map from './Map.js';
import {Make_Form,Pass_Address} from './Form.js';
import Form from './Form.js';
import Buttons from './Buttons.js';
import Console from './Console.js';


import React, { useState, useEffect, useRef , Component} from 'react';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      map_n:"",
      input_message: "",
      map_functionality: ["",""],
      address : '',
      coords_of_poi : '',
      poi_form : false,
      point_rejected : ''
  }

    this.Change_Map=this.Change_Map.bind(this)
    this.Change_Features=this.Change_Features.bind(this)    
    this.Change_Input=this.Change_Input.bind(this)
    this.Change_Address=this.Change_Address.bind(this)
    this.Change_Poi_Form=this.Change_Poi_Form.bind(this)
    this.Rejection_Point=this.Rejection_Point.bind(this)
    this.Change_Poi_Cord=this.Change_Poi_Cord.bind(this)
  }


  Change_Poi_Cord(value){
    this.setState({coords_of_poi:value})
  }
  Rejection_Point(arg_val){
    this.setState({point_rejected:arg_val})
  }
  Change_Poi_Form(bool_val){
    this.setState({poi_form:bool_val})
  }

  Change_Map(map_arg){
    this.setState({map_n:map_arg})
  }

  Change_Address(address_arg){
    console.log("address is ",address_arg)
    this.setState({address:address_arg})
  }

  Change_Input(message){
    console.log("message is ",message)
    this.setState({input_message:message})
  }

  Change_Features(button_arg){
    // i will give the first argument only in the buttons except cancel
      console.log(button_arg)
      if (button_arg[1]==true){
        this.setState({map_functionality:button_arg})
      }
      else {
        //i need to take the argument of the name of the button 
        var string_to_use=this.state.map_functionality[0].concat("")

        var array_as_arg=[string_to_use,button_arg[1]]

        this.setState({map_functionality:array_as_arg})
        
        if (this.state.input_message!=''){
          this.setState({input_message:''})
        }
      }
  }



  render(){
    return(
      <div className="App">
      <Render_Map map={this.state.map_n} rejection_handle={this.Rejection_Point} coord_change={this.Change_Poi_Cord} feature_change={this.Change_Features} func_handle={this.Change_Map} map_features={this.state.map_functionality} input_handle={this.Change_Input} address={this.state.address} />
      <Buttons map={this.state.map_n} coords={this.state.coords_of_poi} rejection_handle={this.Rejection_Point} reject={this.state.point_rejected} func_handle={this.Change_Features} change_address={this.Change_Address} poi_val={this.state.poi_form} />
      <Console input={this.state.input_message} func_handle={this.Change_Features} feature={this.state.map_functionality} change_poi_bool={this.Change_Poi_Form} input_handle={this.Change_Input} />
     </div>
    )
  }

}


export default App;
