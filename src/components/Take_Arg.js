// react
import React, { useState, useEffect, useRef,Component  } from 'react'
import axios from 'axios';


class Take_Arg extends Component{
	

	state = {
    posts: [],
    isLoading: true,
    error: null,
  };

  getArtistsInfo() {
    axios('https://run.mocky.io/v3/b2a2cbd3-d446-405a-9e25-f7f4c2a37e71')
      .then(response => {
      	const one=this.props.scope;
      	
        const buttons = response.data;
        this.props.func(buttons);
    })
  }

  
  componentDidMount() {
    this.getArtistsInfo();
  }

  render() {
    

  return (
    <div>
      <h2>Artist Web Service</h2>
     
    </div>
    );
  }
}


export default Take_Arg;