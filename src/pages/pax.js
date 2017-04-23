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

const LATITUDE_DELTA  = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var moment = require('moment');
var now = moment().format('H:mm:ss');
var today = moment().format('D:MM:YYYY');

var Pax = React.createClass ({
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
        console.log(place);
        this.setState({
          destination: {
            latitude: place.latitude,
            longitude: place.longitude,
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
      destname: "Select Destination"
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
 componentDidMount(){
    this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            console.log(position);
            this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              },
              coordinate: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }
            });
        });
    console.log(now);
  },
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  },
  onRegionChange(region,coordinate) {
    this.setState({ region,coordinate });
  },
    async onPress() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    
    if (token&&username) {
      //console.log(value);
      fetch("http://"+config.ipaddr+"/logged/newPaxTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "&startLatitude="+encodeURIComponent(this.state.coordinate.latitude)+
          "&startLongitude="+encodeURIComponent(this.state.coordinate.longitude)+
          "&currentLatitude="+encodeURIComponent(this.state.coordinate.latitude)+
          "&currentLongitude="+encodeURIComponent(this.state.coordinate.longitude)+
          "&endLatitude="+encodeURIComponent(this.state.destination.latitude)+
          "&endLongitude="+encodeURIComponent(this.state.destination.longitude)+
          "&user="+encodeURIComponent(username)+
          "&time="+encodeURIComponent(now)+
          "&routeId="+encodeURIComponent("aah")+
          "&status="+encodeURIComponent("readyfordriver")+
          "&date="+encodeURIComponent(today)
      })
      .then((response) => response.json())
      .then((responseData) => {
          alert(username +" requested trip success !");
          console.log("\nRESPONSE ID IS"+responseData._id +"RESPONSE\n ");
          console.log("buhahha");
          Actions.SelectDriver({ type:'replace',paxlatitude:this.state.coordinate.latitude,paxlongitude:this.state.coordinate.longitude, role: "pax" });
      })
      .done();
    }
  },
    render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <TouchableOpacity
        style={styles.button}
        onPress={() => this.openSearchModal()}>
        <Text style={styles.buttonText}>{this.state.destname}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.5} onPress={this.onPress}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Request Driver</Text>
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

export default Pax;

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
  }
});
