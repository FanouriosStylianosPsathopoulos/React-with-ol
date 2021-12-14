import logo from './logo.svg';
import field from './field.png';
import ReactDOM from "react-dom";
import React ,{ useRef, useEffect }  from 'react';
import CanvasDraw from "react-canvas-draw";

import './App.css';

function App() {

  const [team, setTeam] = React.useState('Greece');

  const data = [
    {
    team: 'aek',
    coach: 'Giannikis',
    formation: '4-3-3',
    keeper: ["Stankovic"],
    defenders: ["Vranjes","Laci","Mitoglou","Mpakakis"],
    midfielder:["Mantalos","Simoes","Simanski","Galanopoulos"],
    attackers: ["Garcia","Araujo","Amrabat","Albanis"]
    },
    {
      team:"Aris",
      coach: 'Papadopoulos',
      formation: '4-4-2',
      keeper: ["Questa"],
      defenders: ["Agbenyenu","Leisman","Sakic","Marmaridis"],
      midfielder:["Matijia","Gama","Bertoglio","Mancini"],
      attackers: ["Mitroglou","Kamara","Manos","Lopez"]
    },
    {
      team:"Greece",
      coach: 'Jimenez',
      formation: '4-3-3',
      keeper: ["Anestis"],
      defenders: ["Manolas","Sokratis","Holebas","Tsimikas"],
      midfielder:["Mantalos","Bakasetas","Bouchalakis","Galanopoulos"],
      attackers: ["Tzolis","Pavlidis","Mitroglou","Fountas"]
    }
    ];


  return (
    <div className="App">
      <h1>This is the SuperLeague's Football App </h1>
      
      <Select_Team parameter_team={team} parameter_func={setTeam} />
      
      <Show parameter_team={team} teams={data}  />
    </div>
  );

}

/*class Canvas extends React.Component {
  
  constructor(props) {
    super(props);

    this.team = props.filter_data;
    
  }
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    //alert(this.props.filter_data);
    const img = this.refs.image
    img.onload = () => {
      //alert(this.props.teams[0].coach);
      alert(this.props.filter_data);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      ctx.arc(250,20, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.stroke();
      
      //ctx.drawImage(img, 0, 0)
      //ctx.font = "40px Courier"
      //ctx.fillText(this.props.text, 210, 75)
    }
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" margin-top="35px" width="500" height="700" class="canvas_field" />
        <img ref="image" src="./field.png" class="football_field" id="field" />
      </div>
    )
  }*/

function Show(props){

  const team_to_show = props.parameter_team ;
  const all_teams=props.teams;

  const searched_team = all_teams.filter(checkTeam);

  function checkTeam(greek_team) {
      return greek_team.team.toLowerCase() == team_to_show.toLowerCase()

    
  }
  
  const list_keepers=searched_team[0].keeper.map((d) => <li >{d}</li>)
  const list_defenders = searched_team[0].defenders.map((d) => <li >{d}</li>)
  const list_mid=searched_team[0].midfielder.map((d) => <li >{d}</li>)
  const list_attack=searched_team[0].attackers.map((d) => <li >{d}</li>)

  return (

    <div >
      <br/>
      <b> Coach </b>: {searched_team[0].coach}
      <ul>
      <p> <b> Keeper </b> </p>
      {list_keepers}
      </ul>
      <ul>
        <p><b> Defenders </b> </p>
      {list_defenders}
      </ul>
      <ul>
        <p><b> Midfielders </b> </p>
      {list_mid}
      </ul>
      <ul>
        <p><b> Attackers </b> </p>
      {list_attack}
      </ul>
      

    </div>
  );


}

function Select_Team(props){

  const team=props.parameter_team;

  const func=props.parameter_func;


  const handleEvent = event => {
    
    func(event.target.value);
    
  };

  return (
      <div>
      <label for="teams">Choose your favorite team : </label>

      <select name="teams" id="teams" onChange={handleEvent} >
      <option value="greece">Greece</option>
        <option value="aek">Aek</option>
        <option value="aris">Aris</option>
      </select>

      </div>
  );

}


export default App;

/*const Canvas = props => {
  
  //const canvasRef = props.pass_par;
  
  useEffect(() => {
    const canvasRef = props.pass_par.current;
    
    const canvas = canvasRef.getContext('2d');
    canvas.drawImage(10, 10);
    //canvas.stroke();
    //const context = canvas.getContext('2d')
    //Our first draw
    //context.fillStyle = '#000000'
    //context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, [])
  
  return <canvas />
} */

/*function Filter(props){

  //alert("ok");
  
  //var ok=document.getElementById("field");
  //alert(ok);


  return (
    <div>
    <p>Canvas:</p>
    <canvas id="myCanvas" width="240" height="297" >
    
    </canvas>
    </div>
    

  );

}*/