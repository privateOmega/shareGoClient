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
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
        console.log(place);
      // place represents user's selection from the
      // suggestions and it is a simplified Google Place object.
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
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Uses GPS, Wi-Fi, and cell network for location<br/><br/>",
      ok: "YES",
      cancel: "NO"
      }).then(function(success) {

          /*navigator.geolocation.getCurrentPosition(
          (position) => {
            var initialPosition = JSON.stringify(position);
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
          },
          (error) => {
            console.log(error.message);
            alert("Turn on GPS first :P"+error.message);
          },
          {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
        );*/
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


      }.bind(this)
      ).catch((error) => {
        console.log(error.message);
    });

    /*navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
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
      },
      (error) => {
        console.log(error.message);
        alert("Turn on GPS first :P"+error.message);
      },
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000}
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
    });*/
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.openSearchModal()}
        >
          <Text>{this.state.destname}</Text>
        </TouchableOpacity>
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
    top: 100,
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
