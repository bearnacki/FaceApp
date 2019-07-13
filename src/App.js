import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions = {
  
    "particles": {
      "number": {
        "value": 137,
        "density": {
          "enable": true,
          "value_area": 710
        }
      },
      "color": {
        "value": "#ffffff"
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "repulse": {
          "distance": 200,
          "duration": 0.4
        }
      }
    },
    "retina_detect": true
  }

const app = new Clarifai.App({apiKey: 'API_KEY'}); //add your own API key


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {

      },
      route: 'signin', //route is to know where we are on the page
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImage');
   const width = Number(image.width);
   const height = Number(image.height);
   return {
     leftCol: clarifaiFace.left_col * width,
     topRow: clarifaiFace.top_row * height,
     rightCol: width - (clarifaiFace.right_col * width),
     bottomRow: height - (clarifaiFace.bottom_row * height)
   }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", this.state.input)
    .then(response => {
      if(response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
          .then(count => this.setState(Object.assign(this.state.user, {entries: count})))
      }
      this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
              params={particlesOptions}
            />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home' ? 
          <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit}/>
          <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
            </div> :
        (this.state.route === "signin" ? <SignIn loadUser={this.loadUser} onRouteChange = {this.onRouteChange} /> : <Register onRouteChange = {this.onRouteChange} loadUser = {this.loadUser}/>)
          }
      </div>
    );
    }
  }
export default App;
