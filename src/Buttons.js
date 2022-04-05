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

        this.state={
            disabled: [false,false,false,false],
            cancel : false,
            enabled_button: "",
            poi_option:''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (prevProps.reject!=this.props.reject){
            console.log("show me sth ")
            this.setState({poi_option:""})
            this.AddPointOfInterest()
        }
    }
    Polygon_Create(){
        //disable first of all the rest of the buttons
        var array_of_bool= [false,true,true,true]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "Polygon_Create"} )

        //enable the feature 
        var button_array=["Polygon_Create",true]
        this.props.func_handle(button_array)
    }

    DrawInput(){
        this.setState({poi_option:"draw"})
    }

    AddressInput(){
        this.setState({poi_option:"address"})
    }
    GivemeInfo(){
        //disable first of all the rest of the buttons
        var array_of_bool= [true,false,true,true]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "GivemeInfo"} )

        //enable the feature 
        var button_array=["GivemeInfo",true]
        this.props.func_handle(button_array)
    }

    AddPointOfInterest(){
        console.log("sth")
        //disable first of all the rest of the buttons
        var array_of_bool= [true,true,false,true]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "AddPointOfInterest"} )

        /*
        //enable the feature 
        var button_array=["AddPointOfInterest",true]
        this.props.func_handle(button_array)*/
    }

    HomeForRent(){
        //disable first of all the rest of the buttons
        var array_of_bool= [true,true,true,false]
        //enable cancel
        this.setState({disabled:array_of_bool , cancel:true , enabled_button: "HomeForRent" } )
    }

    Cancel(){
        //enable all the rest of the buttons
        var array_of_bool= [false,false,false,false]
        //disable cancel
        this.setState({disabled:array_of_bool , cancel:false , enabled_button: "" } )

        var button_array=["",false]
        this.props.func_handle(button_array)
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

        if (counter==3 && new_this.state.disabled[2]==false){
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
        <button onClick={this.DrawInput}>Input with draw </button>
        <button onClick={this.AddressInput}>Input with address </button>
        </div>
    }
    console.log("button is ",buttons_for_poi)
    return(
    <div>
    <button onClick={this.Polygon_Create} disabled={this.state.disabled[0]} >Interest Points </button>
    <button onClick={this.GivemeInfo} disabled={this.state.disabled[1]} >Give me Info</button>
    <button onClick={this.AddPointOfInterest} disabled={this.state.disabled[2]}>Add Point of Interest</button>
    <button onClick={this.HomeForRent} disabled={this.state.disabled[3]}>Add Home for Rent</button>
    {cancel_button}
    
    <div>
        {render_sub_buttons}
        <Form input={this.state.poi_option} coords={this.props.coords} input_handle={this.props.input_handle}  change_map_func={this.props.func_handle} address_change={this.props.change_address} poi_value={this.props.poi_val}/>
    </div>
    </div> 
    
    )
    }
}

export default Buttons;
/*
function Renter(){
    console.log("peta sta kalwdia ta airforce 3")
    useEffect(() => {
        console.log("peta sta kalwdia ta airforce 3")
    });
    return(
        <div>
        <button>Random</button>
        <p>Renter</p>
        </div>
    )
}

function Landlord(){
    useEffect(() => {
        console.log("peta sta kalwdia ta airforce 2")
    });
    return(
        <p>Landlord</p>
    )
}


export {Renter,Landlord};
*/