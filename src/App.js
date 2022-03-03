import logo from './logo.svg';
import './App.css';
import './Map.css';
import styles from  './mystyle.module.css';
import Render_Map from './Map.js';
import {Make_Form,Pass_Address} from './Form.js';
import {Renter,Landlord} from './Buttons.js';
import First_Screen from './first_screen.js' ;

function App() {
  return (
    <div className="App">
    <First_Screen/>
    </div>
    
  );
}

export default App;
