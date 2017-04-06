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

const { width, height } = Dimensions.get("window");
const background        = require("./background.jpg");
const config            = require('../configurations/config');

var Dashboard = React.createClass ({
  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    }
    catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
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
  async getUserDetails() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    if(token && username){
      fetch("http://"+config.ipaddr+":8080/logged/profile?token="+token, {
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
        this.setState({"points", responseData.points});
        this._onValueChange('email', responseData.email);
        this._onValueChange('points', responseData.points);
        this._onValueChange('number', responseData.number);
      })
      .done();
    }
  },
  componentWillMount(){
    this.getUserDetails();
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <Text style={styles.buttonText}>Points: {this.state.Points} </Text>
        <TouchableOpacity activeOpacity={.5} onPress={Actions.Driver}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Act as Driver</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={.5} onPress={Actions.Pax}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Act as Passenger</Text>
          </View>
        </TouchableOpacity>
        </Image>
      </View>
    );
  }
});

export default Dashboard;

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
