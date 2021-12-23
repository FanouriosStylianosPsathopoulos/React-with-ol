import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {Control, defaults as defaultControls} from 'ol/control';

//
// Define rotate to north control.
//

class GoHome extends Control {
 
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'H';

    const element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.GoHome.bind(this), false);
  }
  
  GoHome() {
    this.getMap().getView().setCenter([2634988.7369055296, 4585178.285664959]);
    this.getMap().getView().setZoom(17);
  }
}

//
// Create map, giving it a rotate to north control.
//

const map = new Map({
  controls: defaultControls().extend([new GoHome()]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: new View({
    center: [0,0],
    zoom: 17,
    rotation: 0,
  }),
});

