import React, { useState, useEffect, useRef , Component} from 'react';

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
        this.props.input_handle('')
        var reject=["Reject",true]
        this.props.func_handle(reject)
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
      if (this.props.input!=""){
        console.log(this.props.feature)
        if (this.props.feature[0]=="AddPointOfInterest") {
            button=
            <div style={mystyle} >
            <h3> Console </h3>
            <p>{this.props.input}</p>
            <button onClick={this.props.func_2}>Yes</button>
            <button onClick={this.props.func}>No</button>
            </div>
        
        }
        else if (this.props.feature[0]=="GivemeInfo") {
            button=
            <div style={mystyle} >
            <h3> Console </h3>
            <p>
                {this.props.input}
            </p>
            </div>
        }
        else if (this.props.feature[0]=="Address") {
            button=
            <div style={mystyle} >
            <h3> Console </h3>
                
            <p>Is this the right spot?</p>
            <button onClick={this.yes_func}>Yes</button>
            <button onClick={this.no_func}>No</button>
        
            </div>
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