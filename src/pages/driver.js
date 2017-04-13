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
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

const { width, height } = Dimensions.get("window");
const background        = require("./background.jpg");
const config            = require('../configurations/config');
const t                 = require('tcomb-form-native');
const ASPECT_RATIO      = width / height;

var Form = t.form.Form;
var Person = t.struct({
  NoOfPax: t.String
});
var options = {
  fields: {
    NoOfPax: {
      placeholderTextColor: '#cccccc'
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
      destname: "Choose a location"
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
  async onPress() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
      fetch("http://"+config.ipaddr+"/logged/newTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "vId="+encodeURIComponent(KL01BV1540)+
          "&startLatitude="+encodeURIComponent(coordinate.latitude)+
          "&startLongitude="+encodeURIComponent(coordinate.longitude)+
          "&endLatitude="+encodeURIComponent(destination.latitude)+
          "&endLongitude="+encodeURIComponent(destination.latitude)+
          "&user="+encodeURIComponent(username)+
          "&user="+encodeURIComponent(value.NoOfPax)+
          "&time="+encodeURIComponent(now)+
          "&routeId="+encodeURIComponent("aah")+
          "&latitude="+encodeURIComponent(coordinate.latitude)+
          "&longitude="+encodeURIComponent(coordinate.longitude)+
          "&date="+encodeURIComponent(today)
      })
      .then((response) => response.json())
      .then((responseData) => {

      })
      .done();
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
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <View style={styles.container}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => this.openSearchModal()}>
        <Text >{this.state.destname}</Text>
        </TouchableOpacity>
        <Form
        ref="form"
        type={Person}
        options={options}
        />
        <Button
        onPress={this.onPress}
        title="create trip" />
          <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          >
            <MapView.Marker
            coordinate={this.state.coordinate}
            />
            <MapView.Marker
            coordinate={this.state.destination}
            />
          </MapView>
        </View>
        </Image>
      </View>
    );
  }
});

export default Driver;

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    height:height*0.60,
    width:width,
    top: 205,
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
    backgroundColor: "#FF3366",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#FFF",
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
