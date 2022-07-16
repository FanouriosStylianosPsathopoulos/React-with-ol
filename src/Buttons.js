import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers.js';
import { toStringHDMS } from 'ol/coordinate';
import React, { useState, useEffect, useRef , Component} from 'react';
import Form from './Form.js';

class Buttons extends React.Component{
    constructor(props){
        super(props);
        this.Polygon_Create=this.Polygon_Create.bind(this)
        //this.Helper=this.Helper.bind(this)
        //this.CloseButton=this.CloseButton.bind(this)
        this.GivemeInfo=this.GivemeInfo.bind(this)
        this.AddPointOfInterest=this.AddPointOfInterest.bind(this)
        this.HomeForRent=this.HomeForRent.bind(this)
        this.Cancel=this.Cancel.bind(this)
        this.DrawInput=this.DrawInput.bind(this)
        this.AddressInput=this.AddressInput.bind(this)
        this.Change_Array_=this.Change_Array_.bind(this)
        this.Change_Input_Poi=this.Change_Input_Poi.bind(this)
        this.Back_to_State=this.Back_to_State.bind(this)
        this.Change_Array_2=this.Change_Array_2.bind(this)

        this.state={
            disabled_2:[false,false],
            disabled: [false,false,false,false],
            cancel : false,
            enabled_button: "",
            poi_option:''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (prevProps.reject!=this.props.reject && ""!=this.props.reject && this.state.enabled_button=="AddPointOfInterest"){
            this.props.rejection_handle("")
            
            this.props.what_reject_func("")
            this.Change_Array_2([false,false])
            
            this.setState({poi_option:""})
            this.AddPointOfInterest()
        }
        else if (prevProps.reject!=this.props.reject && ""!=this.props.reject && this.state.enabled_button==="HomeForRent"){
            //this.props.what_reject_func("")
            this.props.rejection_handle("")
            
            this.Change_Array_2([false,false])
            this.setState({poi_option:""})
            this.HomeForRent()
        }
    }
    Change_Array_2(val){
        this.setState({disabled_2:val})
    }

    Change_Array_(array_of_bool,cancel_val,enabled_button_val,array_of_bool_2){
        this.setState({disabled:array_of_bool , cancel:cancel_val , enabled_button: enabled_button_val,disabled_2:array_of_bool_2} )
    }
    Polygon_Create(){
        this.props.reset_func(false)
        //this.props.reset_func(true)
        //disable first of all the rest of the buttons
        var array_of_bool= [false,true,true,true]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "Polygon_Create"} )

        //enable the feature 
        var button_array=["Polygon_Create",true]
        this.props.func_handle(button_array)
    }

    Back_to_State(){
        //put everything back to normal 

        //trigger app component to do the same thing
        this.props.trigger_func()
    }

    DrawInput(){

        this.props.change_sub("")

        var array_as_arg=[true,true]

        this.Change_Array_2(array_as_arg)
        
        this.setState({poi_option:"draw"})
        //enable the feature 
        var button_array=["Draw Point",true]
        this.props.func_handle(button_array)
        
    }

    AddressInput(){
        this.props.change_sub("Address")
        var array_as_arg=[true,true]

        this.Change_Array_2(array_as_arg)
        this.setState({poi_option:"address"})
    }

    Change_Input_Poi(poi_option_val){
        this.setState({poi_option:poi_option_val})
    }
    GivemeInfo(){
        this.props.reset_func(false)
        
        //disable first of all the rest of the buttons
        var array_of_bool= [true,false,true,true]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "GivemeInfo"} )

        //enable the feature 
        var button_array=["GivemeInfo",true]
        this.props.func_handle(button_array)
    }

    AddPointOfInterest(){
        
        if (this.state.poi_option!=""){
            this.setState({poi_option:""})
            var array_as_arg=[false,false]
            //var button_array=["",false]
            //this.props.func_handle(button_array) 

            //this.Back_to_State()

            
            this.props.reset_func(true)
            this.Change_Array_2(array_as_arg)
        }
        else
        {
            this.props.reset_func(false)
        }
        
        this.props.what_reject_func("POI")
        //disable first of all the rest of the buttons
        var array_of_bool= [true,true,false,true]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "AddPointOfInterest"} )

    
    }

    HomeForRent(){

        if (this.state.poi_option!=""){
            this.setState({poi_option:""})
            var array_as_arg=[false,false]
            
            this.props.reset_func(true)
            this.Change_Array_2(array_as_arg)
        }
        else
        {
            this.props.reset_func(false)
        }
        //home
        this.props.what_reject_func("Home")
        //disable first of all the rest of the buttons
        var array_of_bool= [true,true,true,false]

        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "HomeForRent" } )
       

    }

    Cancel(){
        
        //enable all the rest of the buttons
        var array_of_bool= [false,false,false,false]
        var array_of_bool_2=[false,false]
        //disable cancel
        this.setState({disabled:array_of_bool , disabled_2:array_of_bool_2 , cancel:false , enabled_button: "",poi_option:'' } )

        var button_array=["",false]
        this.props.func_handle(button_array) 

        //this.Back_to_State()

        this.props.reset_func(true)
    }


    render(){

    var cancel_button;

    if (this.state.cancel==true){
        cancel_button=<button onClick={this.Cancel} >Cancel Procedure </button>
    }
    else(
        cancel_button=""
    )

    var buttons_for_poi;
    const new_this=this
    function Compute_array(){
        var bool_val,counter=0;
        for (var i = 0; i < new_this.state.disabled.length; i++) {
            if ( new_this.state.disabled[i]==true){
                counter=counter+1;
            }
        }

        if (counter==3 && new_this.state.disabled[2]==false || counter==3 && new_this.state.disabled[3]==false){
            bool_val=false;
            
        }
        else {
            bool_val=true;
        }
        return bool_val
    }
    buttons_for_poi=Compute_array()

    var render_sub_buttons;

    if (buttons_for_poi==true)
    {
        render_sub_buttons=''
    }
    else{
        render_sub_buttons=<div>
        <button onClick={this.DrawInput} disabled={this.state.disabled_2[0]}>Input with draw </button>
        <button onClick={this.AddressInput} disabled={this.state.disabled_2[1]}>Input with address </button>
        </div>
    }
    
    return(
    <div>
    <button onClick={this.Polygon_Create} disabled={this.state.disabled[0]} >Interest Points </button>
    <button onClick={this.GivemeInfo} disabled={this.state.disabled[1]} >Give me Info</button>
    <button onClick={this.AddPointOfInterest} disabled={this.state.disabled[2]}>Add Point of Interest</button>
    <button onClick={this.HomeForRent} disabled={this.state.disabled[3]}>Add Home for Rent</button>
    {cancel_button}
    
    <div>
        {render_sub_buttons}
        <Form reset_button_1={this.props.reset_button} reset_func_1={this.props.reset_func} trigger_func_1={this.Back_to_State} change_poi={this.Change_Input_Poi} change_poi_bool={this.props.change_poi_bool} change_arr={this.Change_Array_} button_={this.state.enabled_button} input={this.state.poi_option} coords={this.props.coords} input_handle={this.props.input_handle}  change_map_func={this.props.func_handle} address_change={this.props.change_address} poi_value={this.props.poi_val}/>
    </div>
    </div> 
    
    )
    }
}

export default Buttons;
