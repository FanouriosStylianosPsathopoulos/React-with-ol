import React from 'react';

class Console extends React.Component{

    constructor(props){
      super(props)

      this.state={
        input: ''
      }
      this.yes_func=this.yes_func.bind(this)
      this.no_func=this.no_func.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        
    }

    yes_func(){
        //accept the point
        this.props.change_poi_bool(true)
        this.props.input_handle('')
    }

    no_func(){
        //reject the point 
        var button_array=["Reject",false]
        this.props.func_handle(button_array) 
        this.props.input_handle('')
        //this.Back_to_State()

        this.props.reset_func(true)

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
      
      if (this.props.input!=""){
        
        if (this.props.feature[0]=="AddPointOfInterest" ) {
            button=
            <div style={mystyle} >
            <h3> Console </h3>
            <p>{this.props.input}</p>
            <button onClick={this.props.func_2}>Yes</button>
            <button onClick={this.props.func}>No</button>
            </div>
        
        }
        else if (this.props.input=="This is not a legit validated point to give you info about"){
            button=<div style={mystyle} >
            <h3> Console </h3>
            <p>{this.props.input}</p>
            
            </div>
        }
        else if (this.props.feature[0]=="GivemeInfo") {
            var info_button,attributes=[];
            
            if (this.props.input.type=="apartment"){
                for (const key in this.props.input){
                    attributes.push(key)
                }
                
                var answer = attributes.map((attribute, index) => {
                    return <li key={ index }>{attribute} : {this.props.input[attribute]} </li>; 
               });
                info_button=<ul>{answer}</ul>
           
            }
            else if (this.props.input=="Hospital" || this.props.input=="Market" || this.props.input=="School"){
                info_button="This is a " + this.props.input
            }
            

            button=
            <div style={mystyle} >
            <h3> Console </h3>
            <div>
            {info_button}
            </div>
                
            
            </div>
        }
        else if (this.props.feature[0]=="Address" || this.props.feature[0]=="Draw Point" ) {
            if (this.props.input=="You have to pick an option to be able to submit the point of interest." || this.props.input=="You have to fill all the fields to be able to submit."){
                button=<div style={mystyle} >
                <h3> Console </h3>
                    
                <p>{this.props.input}</p>
            
                </div>
            }
            else {
            button=
            <div style={mystyle} >
            <h3> Console </h3>
                
            <p>Is this the right spot?</p>
            <button onClick={this.yes_func}>Yes</button>
            <button onClick={this.no_func}>No</button>
        
            </div>
            }
        }
    }
    else {
        button=""
    }
        return(
            <div>
                {button}
            </div>
        )
     }
    }

  export default Console;