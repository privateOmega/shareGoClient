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
const t                 = require('tcomb-form-native');
const ASPECT_RATIO      = width / height;

var Form = t.form.Form;
var Person = t.struct({
  Destination: t.String,
  NoOfPax: t.String
});
var options = {
  fields: {
    Destination: {
      placeholderTextColor: '#cccccc'
    },
    NoOfPax: {
      placeholderTextColor: '#cccccc'
    }
  },
  auto: 'placeholders'
};
const LATITUDE_DELTA  = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


var Driver = React.createClass ({
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
    };
  },
  _setWebSocket(){
    const ws = new WebSocket('wss://' + config.ipaddr+":8080/logged/location?token="+token)
    console.log('Setting socket: ' + 'wss://' + config.ipaddr+":8080/logged/location?token="+token)
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
  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
      fetch("http://"+config.ipaddr+":8080/logged/newTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "destination="+encodeURIComponent(value.Destination)+"&NoOfPax="+encodeURIComponent(value.NoOfPax)
      })
      .then((response) => response.json())
      .then((responseData) => {

      })
      .done();
    }
  },
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
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
      },
      (error) => alert(error.message),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        const newRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      this.onRegionChange(newRegion,newCoordinate);
    });
    this._setWebSocket();
  },
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  },
  onRegionChange(region) {
    this.setState({ region,coordinate });
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <View style={styles.markWrap}>
          <Image source={mark} style={styles.mark} resizeMode="contain" />
        </View>
        <Form
        ref="form"
        type={Person}
        options={options}
        />
        <Button
        onPress={this.onPress}
        title="->" />
        <View style={styles.container}>
          <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          >
            <MapView.Marker
            coordinate={this.state.coordinate}
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
    height: height*0.6,
    width: width
  },
  container: {
    flex: 1,
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
