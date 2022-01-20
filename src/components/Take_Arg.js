// react
import React, { useState, useEffect, useRef,Component  } from 'react'
import axios from 'axios';


class Take_Arg extends Component{
	

  get_lang_lat() {

    axios('https://run.mocky.io/v3/d2b101cf-c4db-4a34-af3f-60fea19d4726')
      .then(response => {
      	const one=this.props.scope;
      	
        const buttons = response.data;
        this.props.func(buttons);
        
    })
  }

  
  componentDidMount() {

    this.get_lang_lat();
  }

  render() {
    

  return (
    <div>
     
    </div>
    );
  }
}


export default Take_Arg;