import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

//Pages
import Login from './src/pages/login';
import Signup from './src/pages/signup';
import Signupcont from './src/pages/signupcont';
import ForgotPassword from './src/pages/forgot';
import Dashboard from './src/pages/dashboard';
import Driver from './src/pages/driver';
import Pax from './src/pages/pax';
import Trip from './src/pages/trip';


export default class shareGo extends Component {
  render() {
    return (
      <Router hideNavBar={true}>
        <Scene key="root">
          <Scene key="Login" component={Login} initial={true} hideNavBar={true} onBack = {() =>{return null;}}/>
          <Scene key="Signup" component={Signup} hideNavBar={true}/>
          <Scene key="ForgotPassword" component={ForgotPassword} hideNavBar={true} />
          <Scene key="Dashboard" component={Dashboard} hideNavBar={true} />
          <Scene key="Signupcont" component={Signupcont} hideNavBar={true} />
          <Scene key="Driver" component={Driver} hideNavBar={true} />
          <Scene key="Pax" component={Pax} hideNavBar={true} />
          <Scene key="Trip" component={Trip} hideNavBar={true} onBack = {() =>{return null;}}/>
        </Scene>
      </Router>
    )
  }
}

