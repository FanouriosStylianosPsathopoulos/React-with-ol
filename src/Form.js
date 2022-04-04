//react
import { preventDefault } from 'ol/events/Event';
import React, { useState, useEffect, useRef , Component} from 'react';

class Form extends React.Component{
    constructor(props){
      super(props)

      this.state={
        button_of_input : "",
        changing_input:"",
        address: "",
        console_log: false,
        select_value:""
      }

      this.ChangeInput=this.ChangeInput.bind(this)
      this.Handling=this.Handling.bind(this)
      this.Submit_Poi=this.Submit_Poi.bind(this)
      this.Handle_Change=this.Handle_Change.bind(this)
    }

    Submit_Poi(event){
        event.preventDefault()
        console.log(this.props.coords,this.state.select_value)
        if (this.state.select_value==''){
            
        }

    }
    ChangeInput(event){
        this.setState({changing_input:event.target.value})
    }

    Handle_Change(event){
        this.setState({select_value: event.target.value});
    }
    Handling(event){
        
        this.props.address_change(this.state.changing_input);
        //enable the feature 
        var button_array=["Address",true]
        this.props.change_map_func(button_array)
    }


    render(){
        var button_to_render;
        console.log(this.props.input)
        if (this.props.input=="draw"){
            button_to_render=""
        }
        else if (this.props.input=="address"){    
            if (this.props.poi_value == false){ 
            button_to_render=<div>
            <label>Give the address of the point of interest </label>
            <input type='text' onChange={this.ChangeInput} value={this.state.changing_input}></input>
            <button onClick={this.Handling}>Search</button>
            </div>
            }
            else {
                button_to_render=<div>
                <form>
                <label>Choose the type of point of interest </label>
                    <select defaultValue='' onChange={this.Handle_Change} >
                    <option disabled value=''> -- select an option -- </option>
                    <option value="School">School</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Market">Market</option>
                    </select>
                    <button onClick={this.Submit_Poi}>Submit</button>
                </form>
                </div>
            }
        }

        return(
            <div>
                {button_to_render}
            </div>
        )
    }

}
export default Form;
/*
function Pass_Address(props){
    
    useEffect(() => {
        console.log("peta sta kalwdia ta airforce 1")
    });
    
    return(
        <div>
            {console.log("sout")}
            A message that is {props.address}
        </div>
    )
}
function Make_Form(){
    console.log("form")
    const [address, setAddress] = useState("");
    const [bool_var,setBool]=useState("False")
    const handleChange = (evt) => {
        setAddress(evt.target.value)
    }

    const button_func=(event)=>{
        //setBool("True");
        console.log("sthe")
        //return <Pass_Address address= {address} />
        preventDefault(event);
        console.log("okkk")
        return <Pass_Address address_prop= {address} />
    }




    return(
        <div>
            <form>Give Address that you want the map to center:  
            <input type="text" id="lname" name="lname" value={address} onChange={handleChange}  />
            <button onClick={button_func}>
            Submit 
            </button>
            </form>
        </div>
    )
}





export {Make_Form,Pass_Address}; */