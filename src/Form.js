//react
import { preventDefault } from 'ol/events/Event';
import React, { useState, useEffect, useRef , Component} from 'react';

//json
import {return_json} from './Create_json.js'

//axios api 
import {handle_connection} from './axios_api.js'

//helper functions
import {return_id} from './Helper_functons.js'

class Form extends React.Component{
    constructor(props){
      super(props)

      this.state={
        button_of_input : "",
        changing_input:"",
        address: "",
        console_log: false,
        select_value:"",
        submit_button : false,
        floor : "",
        levels : "",
        year: "",
        squareMeters : "" ,
        buildingFees: "",
        description: "",
        boolean_of_address: false
      }

      this.ChangeInput=this.ChangeInput.bind(this)
      this.Handling=this.Handling.bind(this)
      this.Submit_Poi=this.Submit_Poi.bind(this)
      this.Handle_Change=this.Handle_Change.bind(this)
      this.Change_to_blank=this.Change_to_blank.bind(this)
      this.Submit_apartment=this.Submit_apartment.bind(this)
      this.Handle_Floor=this.Handle_Floor.bind(this)
      this.Handle_Level=this.Handle_Level.bind(this)
      this.Handle_Year=this.Handle_Year.bind(this)
      this.Handle_Meters=this.Handle_Meters.bind(this)
      this.Handle_Fees=this.Handle_Fees.bind(this)
      this.ChangeText=this.ChangeText.bind(this)

    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (prevProps.reset_button_1!=this.props.reset_button_1 && this.props.reset_button_1==true ){
            console.log("Reset state")
            this.setState({button_of_input:"",floor : "",boolean_of_address:false,squareMeters : "" ,buildingFees: "",description:'',year: "",levels : "",changing_input:"",address:"",console_log:false,select_value:"",submit_button:false })
          }
    }

    ChangeText(event){
        this.setState({description:event.target.value })
    }

    Handle_Fees(event){
        this.setState({buildingFees:event.target.value })
    }
    Handle_Meters(event){
        this.setState({squareMeters:event.target.value })
    }

    Handle_Year(event){
        //year
        this.setState({year:event.target.value })
    }
    Handle_Level(event){
        this.setState({levels:event.target.value })
    }
    Handle_Floor(event){
        this.setState({floor:event.target.value })
    }

    Submit_apartment(event){
        event.preventDefault()
        console.log("message 2")
        if (this.state.floor=='' || this.state.levels=='' || this.state.year=='' || this.state.squareMeters=='' || this.state.buildingFees=='' ){
            console.log("alliws edw ")
            this.props.input_handle("You have to fill all the fields to be able to submit.")
            this.setState({submit_button:true })
        }
        else {
            console.log("message ")
            var comb_of_data=[this.props.coords,this.state.floor,this.state.levels,this.state.year,this.state.squareMeters,this.state.buildingFees,this.state.description]
            var json=return_json("Home",comb_of_data)
            
            console.log("Home is  ",JSON.stringify(json, null, 2));

            //api stuff 
            var data;

            handle_connection("POST","Home",json).then(val => {
                // got value here
                data=val
            
                console.log("Print this",data)
        }
            )
            this.props.reset_func_1(true)
            console.log("Asynchronous")


            //change everything to default buttons 
            this.props.change_arr([false,false,false,false],false,'',[false,false])

            //this.props.change_arr([false,false,false,false],false,'') //buttons
            
            var message='';
            this.props.change_poi(message) //poi option
            
            var bool_to_regular=false;

            this.props.change_poi_bool(bool_to_regular) //poi bool value

            this.Change_to_blank()

            this.props.trigger_func_1();
            }
}
    Submit_Poi(event){
        event.preventDefault()
        console.log(this.props.coords,this.state.select_value)
        if (this.state.select_value==''){
            this.props.input_handle("You have to pick an option to be able to submit the point of interest.")
            this.setState({submit_button:true })
        }
        else {
            //we have both coord of the point and what type it is 
            
            //make them json so u can send them to back end 
            var comb_of_data=[this.props.coords,this.state.select_value]
            var json=return_json("Point of interest",comb_of_data)

            console.log("Point of interest ",JSON.stringify(json, null, 2));

            //api stuff 
            var data;

            handle_connection("POST","Point_of_Interest",json).then(val => {
                // got value here
                data=val
            
                console.log("Print this",data)

                //save id to local storage along side with the lang lat
                
                var id=return_id(data);

                localStorage.setItem("1", JSON.stringify(data));

                
                
                console.log("Message to see is: ",JSON.parse(localStorage.getItem("1")));

                //inside_this.props.input_handle(data)
            })

            
            
            
            this.props.reset_func_1(true)
            console.log("Asynchronous")


            //change everything to default buttons 

            this.props.change_arr([false,false,false,false],false,'',[false,false]) //buttons
            
            var message='';
            this.props.change_poi(message) //poi option
            
            var bool_to_regular=false;

            this.props.change_poi_bool(bool_to_regular) //poi bool value

            this.Change_to_blank()

            this.props.trigger_func_1();
        }

    }
    
    Change_to_blank(){
        var blank="";
        this.setState({changing_input:blank})
    }

    ChangeInput(event){
        this.setState({changing_input:event.target.value})
        
    }

    Handle_Change(event){
        this.setState({select_value: event.target.value});
        this.props.input_handle("")
        this.setState({submit_button:false })
    }
    Handling(event){
        this.setState({boolean_of_address:true})
        this.props.address_change(this.state.changing_input);
        //enable the feature 
        var button_array=["Address",true]
        this.props.change_map_func(button_array)
    }


    render(){

        console.log("FOorm first",this.state.address)
        console.log("FOorm",this.state.button_of_input)
        console.log("FOorm",this.state.changing_input)
        console.log("FOorm",this.state.console_log)
        console.log("FOorm",this.state.select_value)
        console.log("FOorm last",this.state.submit_button)
        var button_to_render,submit_alert='';
        console.log(this.props.input)
        console.log(this.props.button_)
        if (this.props.input=="draw"){
            if (this.props.poi_value == true && this.props.button_ == "AddPointOfInterest"){
                if (this.state.submit_button){
                    submit_alert=<span style={{color: 'red'}}> Pick a type of point of interest </span>
                }
                button_to_render=<div>
                <form>
                <label>Choose the type of point of interest </label>
                    <select defaultValue='' onChange={this.Handle_Change} >
                    <option disabled value=''> -- select an option -- </option>
                    <option value="School">School</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Market">Market</option>
                    </select>
                    <button onClick={this.Submit_Poi} >Submit</button>
                    {submit_alert}
                </form>
                </div>
            }
            else if (this.props.poi_value == true && this.props.button_ == "HomeForRent"){
                //form for this 
                 //form
                 console.log("Form with address ")

                 //prerequisites
                 var select = '',items=[],squares=[],fees=[];
                 for (var i=1980;i<1980+42;i++){
                     items.push(<option key={i} value={i}>{i}</option>); 
                 }
 
                 for (var i=10;i<=150;i++){
                     squares.push(<option key={i} value={i}>{i}</option>); 
                 }
 
                 for (var i=0;i<30;i++){
                     fees.push(<option key={i} value={i}>{i}</option>); 
                 }
                 if (this.state.submit_button){
                     submit_alert=<span style={{color: 'red'}}> Fill in all the fields </span>
                 }
                 //form
                 button_to_render=<div>
                 <form>
                     <p> Fill all the fields to proceed with submition </p>
                 <label>Pick the floor of the house </label>
                     <select defaultValue='' onChange={this.Handle_Floor} >
                     <option disabled value=''> -- select an option -- </option>
                     <option value="0">0</option>
                     <option value="1">1</option>
                     <option value="2">2</option>
                     <option value="3">3</option>
                     <option value="4">4</option>
                     <option value="5">5</option>
                     </select>
                     <br></br>
                     <label>Pick the levels of the house </label>
                     
                     <select defaultValue=''  onChange={this.Handle_Level}>
                     <option disabled value=''> -- select an option -- </option>
                     <option value="0">0</option>
                     <option value="1">1</option>
                     <option value="2">2</option>
                     <option value="3">3</option>
                     </select>
                     <br></br>
                     <label>Pick the year the house was built </label>
                     <select defaultValue='' onChange={this.Handle_Year} >
                     <option disabled value=''> -- select an option -- </option>
                     {console.log("select",items)}
                     {items}
                     
                     </select>
                     <br></br>
                     <label>Pick the square meters of the house </label>
                     <select defaultValue='' onChange={this.Handle_Meters} >
                     <option disabled value=''> -- select an option -- </option>
                     {console.log("select",items)}
                     {squares}
                     
                     </select>
                     <br></br>
                     <label>Building Fees</label>
                     <select defaultValue='' onChange={this.Handle_Fees} >
                     <option disabled value=''> -- select an option -- </option>
                     {console.log("select",items)}
                     {fees}
                     
                     </select>
                     <br></br>
                     <label>Give the rest of info you want to  </label>
                     <input type='text' onChange={this.ChangeText} value={this.state.description}></input>
 
                     <button onClick={this.Submit_apartment} >Submit the form</button>
                     {submit_alert}
                 </form>
                 </div>
 
            }
        }
        else if (this.props.input=="address"){    
            if (this.props.poi_value == false){ 
            button_to_render=<div>
            <label>Give the address of the point of interest </label>
            <input type='text' onChange={this.ChangeInput} value={this.state.changing_input} disabled={this.state.boolean_of_address}></input>
            <button onClick={this.Handling} disabled={this.state.boolean_of_address}>Search</button>
            </div>
            }
            else if (this.props.poi_value == true &&  this.props.button_ == "AddPointOfInterest" ) {
                if (this.state.submit_button){
                    submit_alert=<span style={{color: 'red'}}> Pick a type of point of interest </span>
                }
                button_to_render=<div>
                <form>
                <label>Choose the type of point of interest </label>
                    <select defaultValue='' onChange={this.Handle_Change} >
                    <option disabled value=''> -- select an option -- </option>
                    <option value="School">School</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Market">Market</option>
                    </select>
                    <button onClick={this.Submit_Poi} >Submit</button>
                    {submit_alert}
                </form>
                </div>
            }
            else if (this.props.poi_value == true && this.props.button_ == "HomeForRent"){
                
                //form
                console.log("Form with address ")

                //prerequisites
                var select = '',items=[],squares=[],fees=[];
                for (var i=1980;i<1980+42;i++){
                    items.push(<option key={i} value={i}>{i}</option>); 
                }

                for (var i=10;i<=150;i++){
                    squares.push(<option key={i} value={i}>{i}</option>); 
                }

                for (var i=0;i<30;i++){
                    fees.push(<option key={i} value={i}>{i}</option>); 
                }
                if (this.state.submit_button){
                    submit_alert=<span style={{color: 'red'}}> Fill in all the fields </span>
                }
                //form
                button_to_render=<div>
                <form>
                    <p> Fill all the fields to proceed with submition </p>
                <label>Pick the floor of the house </label>
                    <select defaultValue='' onChange={this.Handle_Floor} >
                    <option disabled value=''> -- select an option -- </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    </select>
                    <br></br>
                    <label>Pick the levels of the house </label>
                    
                    <select defaultValue=''  onChange={this.Handle_Level}>
                    <option disabled value=''> -- select an option -- </option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    </select>
                    <br></br>
                    <label>Pick the year the house was built </label>
                    <select defaultValue='' onChange={this.Handle_Year} >
                    <option disabled value=''> -- select an option -- </option>
                    {console.log("select",items)}
                    {items}
                    
                    </select>
                    <br></br>
                    <label>Pick the square meters of the house </label>
                    <select defaultValue='' onChange={this.Handle_Meters} >
                    <option disabled value=''> -- select an option -- </option>
                    {console.log("select",items)}
                    {squares}
                    
                    </select>
                    <br></br>
                    <label>Building Fees</label>
                    <select defaultValue='' onChange={this.Handle_Fees} >
                    <option disabled value=''> -- select an option -- </option>
                    {console.log("select",items)}
                    {fees}
                    
                    </select>
                    <br></br>
                    <label>Give the rest of info you want to  </label>
                    <input type='text' onChange={this.ChangeText} value={this.state.description}></input>

                    <button onClick={this.Submit_apartment} >Submit the form</button>
                    {submit_alert}
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