import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  AsyncStorage,
  TouchableHighlight,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get("window");
const background        = require("./background.jpg");
const config            = require('../configurations/config');
const ASPECT_RATIO      = width / height;

const LATITUDE_DELTA  = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var moment = require('moment');
var now = moment().format('H:mm:ss');
var today = moment().format('D:MM:YYYY');   

var Trip = React.createClass ({
  getInitialState() {
    return {
      region: {
        latitude: 0.000,
        longitude: 0.000,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      coordinate: {
        latitude: 0.000,
        longitude: 0.000,
      },
      start: {
        latitude: 0.000,
        longitude: 0.000
      },
      end:{
        latitude: 0.000,
        longitude: 0.000
      },
      user: "none",
      coords:[]
    };
  },
  async _userLogout() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('number');
      await AsyncStorage.removeItem('points');
      console.log("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
   socketSend(user,latitude,longitude){
    var ws = new WebSocket('ws://'+config.ipaddr+'/logged/echo');
    console.log(String(user));
    //var a = toString(user+latitude+longitude);
    ws.onopen = (user,latitude,longitude) => {
      console.log('Send something');
      ws.send('something'); // send a message
      
    };
  },
  decode(t,e){
  for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){
    a=null,h=0,i=0;
    do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;
    while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;
    while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}

    return d=d.map(function(t){
      return{
        latitude:t[0],
        longitude:t[1]}
      })
  },
  onRegionChange(region) {
    this.setState({ region});
  },
  async getTripDetails(){
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    this.setState({
      user: username
    });
    console.log('enthelum vaa'+this.props._id+this.props.role);
    if (token && username) {
      fetch("http://"+config.ipaddr+"/logged/getTripDetails?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "_id="+encodeURIComponent(this.props._id)+
          "&role="+encodeURIComponent(this.props.role)
          
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log('hahshashash'+responseData.routeId);
          if(responseData){
            this.setState({
              coords:this.decode(responseData.routeId)
            })
          }
          this.setState({
            start:{
              latitude: parseFloat(responseData.startLatitude),
              longitude: parseFloat(responseData.startLongitude)
            },
            end:{
              latitude: parseFloat(responseData.endLatitude),
              longitude: parseFloat(responseData.endLongitude)
            }
          });
      })
      .done();
    }
  },
  async onPress(latitude,longitude){
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    console.log("ivide ethi"+username);
    if (token && username) {
      fetch("http://"+config.ipaddr+"/logged/SOS?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "user="+encodeURIComponent(username)+
          "&latitude="+encodeURIComponent(latitude)+
          "&longitude="+encodeURIComponent(longitude)
          
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log(responseData);
          alert('SOS has been requested');
      })
      .done();
    }
  },
  async cancelTrip(){
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    console.log("cancel ivide ethi"+username);
    if (token && username) {
      fetch("http://"+config.ipaddr+"/logged/cancelTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "username="+encodeURIComponent(username)+
          "&role="+encodeURIComponent(this.props.role)+
          "&_id="+encodeURIComponent(this.props._id)
          
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log(responseData);
          alert('Trip has been cancelled');
          Actions.Dashboard({type:'reset'});
      })
      .done();
    }
  },
  async endTrip(){
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    console.log("end ivide ethi with role "+username+this.props.role);
    if (token && username) {
      fetch("http://"+config.ipaddr+"/logged/endTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "username="+encodeURIComponent(username)+
          "&role="+encodeURIComponent(this.props.role)+
          "&_id="+encodeURIComponent(this.props._id)+
          "&currentLatitude="+encodeURIComponent(this.state.coordinate.latitude)+
          "&currentLongitude="+encodeURIComponent(this.state.coordinate.longitude)
          
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log('BLAAAAA');
          console.log("RD IS "+responseData.success);
          if(responseData.success==true)
          {  alert('Trip has been ended ! WHY'); }
          else alert('You still have passengers');
          Actions.Dashboard();
      })
      .done();
    }
  },
  componentWillMount(){
    this.getTripDetails();
  },
  componentWillUnmount(){
    console.log('Trip unmounted');
    navigator.geolocation.clearWatch(this.watchID);
  },
  componentDidMount(){
     this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            console.log('trip'+position);
            this.setState({
              region: {
                latitude: parseFloat(position.coords.latitude),
                longitude: parseFloat(position.coords.longitude),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              },
              coordinate: {
                latitude: parseFloat(position.coords.latitude),
                longitude: parseFloat(position.coords.longitude),
              }
            });
        });
    console.log(now);
  },
  rendering(){
    //console.log(this.state.success+this.state.role+this.state._id);
    if(this.props.role=="driver"){
      return(
          <TouchableOpacity activeOpacity={.5} onPress={this.cancelTrip}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Cancel Trip</Text>
                </View>
            </TouchableOpacity>
      );
    }
    else{
      return(
        <View style={{alignItems:'center',marginLeft:10,marginRight:10}}>
          <TouchableOpacity activeOpacity={.5} onPress={this.cancelTrip} style={{width:width*0.5}}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Cancel Trip</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.5} onPress={this.endTrip} style={{width:width*0.5}}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>End Trip</Text>
                </View>
            </TouchableOpacity>
        </View>
      );
    }
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
          <View style={{justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity activeOpacity={.5} onPress={_ => this.onPress(this.state.coordinate.latitude,this.state.coordinate.longitude)}>
                <View style={{borderRadius:6,backgroundColor:'red',paddingVertical:20,marginTop:30,justifyContent:'center',alignItems:'center',width:200}}>
                  <Text style={styles.buttonText}>SOS</Text>
                </View>
            </TouchableOpacity>
          </View>
          {this.rendering()}
            
          <MapView
          style={styles.map}
          region={this.state.region}
          followsUserLocation={true}>
          <MapView.Polyline
            coordinates={[
                {latitude: this.state.start.latitude, longitude: this.state.start.longitude}, // optional
                ...this.state.coords,
                {latitude: this.state.end.latitude, longitude: this.state.end.longitude}, // optional
            ]}
            strokeWidth={4}
        />
            <MapView.Marker
            coordinate={this.state.start}
            />
            <MapView.Marker
            coordinate={this.state.end}
            />
            <MapView.Marker
            coordinate={this.state.coordinate}
            />
            
          </MapView>
        </Image>
      </View>
    );
  }
});

export default Trip;

const styles = StyleSheet.create({
  map: {
    position: 'relative',
    height:height*0.65,
    width:width,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    position: 'absolute',
    top:0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  markWrap: {
  },
  mark: {
    width: 150,
    height: 150,
    flex: 1
  },
  background: {
    width,
    height,
  },
  wrapper: {
    paddingVertical: 30,
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 10,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },
  iconWrap: {
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 20,
    width: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#416788",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#E0E0E2",
    fontSize: 18,
  },
  forgotPasswordText: {
    color: "#D8D8D8",
    backgroundColor: "transparent",
    textAlign: "right",
    paddingRight: 15,
  },
  signupWrap: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    color: "#D8D8D8"
  },
  signupLinkText: {
    color: "#FFF",
    marginLeft: 5,
  },
  points:{
    fontSize:18,
  }
});
