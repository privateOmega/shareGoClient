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
import RNGooglePlaces from 'react-native-google-places';

const { width, height } = Dimensions.get("window");
const background        = require("./background.jpg");
const config            = require('../configurations/config');
const t                 = require('tcomb-form-native');
const ASPECT_RATIO      = width / height;
const mark              = require("./login2_mark.png");
import Icon from 'react-native-vector-icons/MaterialIcons';
const points = (<Icon name="star" size={40} color="#416788" />);
const driver = (<Icon name="person" size={30} color="#416788" />);
const pax = (<Icon name="person-add" size={30} color="#416788" />);

var Form = t.form.Form;
var Person = t.struct({
  Pax: t.String
});
var options = {
  fields: {
    Pax: {
      placeholderTextColor: '#ffffff'
    }
  },
  auto: 'placeholders'
};
const LATITUDE_DELTA  = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var moment = require('moment');
var now = moment().format('H:mm:ss');
var today = moment().format('D:MM:YYYY');
var Driver = React.createClass ({
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
        console.log(place);
        this.setState({
          destination: {
            latitude: parseFloat(place.latitude),
            longitude: parseFloat(place.longitude),
          },
          destname: place.name
        });
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  },
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
      destination: {
        latitude: 0.000,
        longitude: 0.000
      },
      destname: "V  Choose a location",
      driverRating: 0,
      paxRating: 0,
      points: 0
    };
  },
  async _userLogout() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('username');
      console.log("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  async getUserDetails() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    if(token && username){
      fetch("http://"+config.ipaddr+"/logged/profile?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:"username="+encodeURIComponent(username)
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          driverRating: responseData.driverRating,
          paxRating: responseData.paxRating,
          points: responseData.points
        })
      })
      .done();
    }
  },
  async onPress() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    var value = this.refs.form.getValue();
    console.log("yoyoy"+value);
    
    if (value) {
      fetch("http://"+config.ipaddr+"/logged/newTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "vId="+encodeURIComponent("KL01BV1540")+
          "&startLatitude="+encodeURIComponent(this.state.coordinate.latitude)+
          "&startLongitude="+encodeURIComponent(this.state.coordinate.longitude)+
          "&endLatitude="+encodeURIComponent(this.state.destination.latitude)+
          "&endLongitude="+encodeURIComponent(this.state.destination.latitude)+
          "&user="+encodeURIComponent(username)+
          "&seats="+encodeURIComponent(value.Pax)+
          "&time="+encodeURIComponent(now)+
          "&routeId="+encodeURIComponent("aah")+
          "&latitude="+encodeURIComponent(this.state.coordinate.latitude)+
          "&longitude="+encodeURIComponent(this.state.coordinate.longitude)+
          "&date="+encodeURIComponent(today)
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log("katta Success");
          console.log(responseData);
          Actions.Trip({type:'popAndReplace',_id: responseData._id, role: "driver",latitude:this.state.coordinate.latitude,longitude:this.state.coordinate.longitude });
          
          alert("Trip Created Sucessfully");
      })
      .done();
    }
  },
  componentDidMount(){
    this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            console.log("driver"+position);
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
    //console.log(now);
  },
  componentWillMount(){
    this.getUserDetails();
  },
  componentWillUnmount(){
    console.log('Driver unmounted');
    navigator.geolocation.clearWatch(this.watchID);
  },
  onRegionChange(region,coordinate) {
    this.setState({ region,coordinate });
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <View style={styles.markWrap}>
            <View style={{flexDirection:'column',borderWidth:3}}>
              <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center',borderBottomWidth:3,paddingHorizontal:5}}>{driver}<Text style={styles.points}>{this.state.driverRating}</Text></View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>{pax}<Text style={styles.points}>{this.state.paxRating}</Text></View>
            </View>
            <Image source={mark} style={styles.mark} resizeMode="contain" />
            <View style={{justifyContent:'center', alignItems:'center',borderWidth:3,paddingHorizontal:5}}>
              {points}
              <Text style={styles.points}>{this.state.points}</Text>
            </View>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View>
          <Form
          ref="form"
          type={Person}
          options={options}
          />
          </View>
          <View>
          <TouchableOpacity
          style={{backgroundColor: "#5187b6",paddingVertical: 20,marginTop: 0,alignItems:'center',width:200}}
          onPress={() => this.openSearchModal()}>
          <Text style={styles.buttonText}>{this.state.destname}</Text>
          </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity activeOpacity={.5} onPress={this.onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Create Trip</Text>
          </View>
        </TouchableOpacity>
        <MapView
          style={styles.map}
          region={this.state.region}
          >
            <MapView.Marker
            coordinate={this.state.coordinate}
            />
            <MapView.Marker
            coordinate={this.state.destination}
            />
        </MapView>
        </Image>
      </View>
    );
  }
});

export default Driver;

const styles = StyleSheet.create({
  map: {
    position: 'relative',
    height:height*0.37,
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
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20
  },
  mark: {
    width: 150,
    height: 150,
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
    marginTop: 10,
    alignItems:'center'
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
  }
});
