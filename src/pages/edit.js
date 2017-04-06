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

var t = require('tcomb-form-native');
var Form = t.form.Form;
var Person = t.struct({
  Username:  t.String,
  Email:     t.String,
  Gender:    t.String,
  Phone:     t.Number,
  Dob:       t.String,
  State:     t.String,
  City:      t.String,
  Pincode:   t.Number,
  Points:    t.String
});

var options = {
  fields: {
    Username: {
      placeholderTextColor: '#cccccc'
    },
    Email: {
      placeholderTextColor: '#cccccc'
    },
    Gender: {
      placeholderTextColor: '#cccccc'
    },
    Phone: {
      placeholderTextColor: '#cccccc'
    },
    Dob: {
      placeholderTextColor: '#cccccc'
    },
    State: {
      placeholderTextColor: '#cccccc'
    },
    City: {
      placeholderTextColor: '#cccccc'
    },
    Pincode: {
      placeholderTextColor: '#cccccc'
    },
    Points: {
      placeholderTextColor: '#cccccc'
    },
  },
  auto: 'placeholders'
};


var EditProfile = React.createClass ({
  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
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
  getInitialState() {
    return {
      value: {
        Username: '',
        Email: '',
        Gender: '',
        Phone: '',
        Dob: '',
        State: '',
        Pincode: '',
        Points: ''
      }
    };
  },
  onChange(value) {
    this.setState({value});
  },
  async getUserDetails() {
    var token     = await AsyncStorage.getItem('token');
    var username  = await AsyncStorage.getItem('username');
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

        this.onChange(value: {
          Username: responseData.username,
          Email: responseData.email,
          Gender: responseData.gender,
          Phone: responseData.number,
          Dob: responseData.dob,
          State: responseData.state,
          Pincode: responseData.pincode,
          Points: responseData.points
        });
      })
      .done();
      this._onValueChange('email', responseData.email);
      this._onValueChange('points', responseData.points);
      this._onValueChange('number', responseData.number);
    }
  },
  componentWillMount(){
    this.getUserDetails();
  },
  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      fetch("http://"+config.ipaddr+":8080/updateAccount", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "username="+encodeURIComponent(value.Username)+
          "&email="+encodeURIComponent(value.Email)+
          "&number="+encodeURIComponent(value.Phone)+
          "&gender="+encodeURIComponent(value.Gender)+
          "&state="+encodeURIComponent(value.State)+
          "&city="+encodeURIComponent(value.City)+
          "&pincode="+encodeURIComponent(value.Pincode)+
          "&points="+encodeURIComponent(value.Points)
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Response is"+responseData);
      })
      .done();
     }
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
          value={this.state.value}
          onChange={this.onChange}
        />
        </Image>
      </View>
    );
  }
});

export default EditProfile;

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
