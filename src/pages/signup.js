import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get("window");
const background        = require("./background.jpg");
const config            = require('../configurations/config');

var t = require('tcomb-form-native');
var Form = t.form.Form;
var Person = t.struct({
  Username:       t.String,
  Name:           t.String,
  Email:          t.String,
  Password:       t.String,
  Confirmpassword:t.String,
  Phone:          t.String
});

var options = {
  fields: {
    Name: {
      placeholderTextColor: '#ffffff'
    },
    Email: {
      placeholderTextColor: '#ffffff'
    },
    Username: {
      placeholderTextColor: '#ffffff'
    },
    Password: {
      password: true,
      secureTextEntry: true,
      placeholderTextColor: '#ffffff'
    },
    Confirmpassword: {
      password: true,
      secureTextEntry: true,
      placeholderTextColor: '#ffffff'
    },
    Phone: {
      placeholderTextColor: '#ffffff'
    },
  },
  auto: 'placeholders'
};

var Signup = React.createClass ({
   onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      if(value.Password == value.Confirmpassword){
        Actions.Signupcont({Name : value.Name,Email : value.Email, Username: value.Username,
          Password : value.Password, Phone : value.Phone });
      }
      else
        console.log("Unmatching passwords");
    }
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <View style={styles.markWrap}>
        <Text style={styles.HText}> Create your account</Text>
        </View>
          <Form
          ref="form"
          type={Person}
          options={options}
          />
          <TouchableOpacity activeOpacity={.5} onPress={this.onPress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.container}>
            <View style={styles.signupWrap}>
              <Text style={styles.accountText}>Remember Login Details?</Text>
              <TouchableOpacity activeOpacity={.5} onPress={_ => Actions.Login({type: 'reset'})}>
                <View>
                  <Text style={styles.signupLinkText} >Sign In</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Image>
      </View>
    )
  }
});

export default Signup;

let styles = StyleSheet.create({
  markWrap: {
    paddingVertical: 23,
  },
  mark: {
    width: null,
    height: null,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  bg: {
    paddingTop: 30,
    width: null,
    height: null
  },
  headerContainer: {
    flex: 1,
  },
  inputsContainer: {
    flex: 3,
    marginTop: 50,
  },
  footerContainer: {
    flex: 1
  },
  headerIconView: {
    marginLeft: 10,
    backgroundColor: 'transparent'
  },
  headerBackButtonView: {
    width: 25,
    height: 25,
  },
  backButtonIcon: {
    width: 25,
    height: 25
  },
  headerTitleView: {
    backgroundColor: 'transparent',
    marginTop: 25,
    marginLeft: 25,
  },
  titleViewText: {
    fontSize: 40,
    color: '#fff',
  },
  inputs: {
    paddingVertical: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderBottomColor: '#CCC',
    borderColor: 'transparent',
    flexDirection: 'row',
    height: 75,
  },
  iconContainer: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    fontSize: 20,
  },
  signup: {
    backgroundColor: '#FF3366',
    paddingVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  signin: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  greyFont: {
    color: '#D8D8D8'
  },
  whiteFont: {
    color: '#FFF'
  },
  background: {
    width,
    height,
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
  signupWrap: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    color: "#41739f"
  },
  signupLinkText: {
    color: "#416788",
    marginLeft: 5,
  },
  HText: {
    color: "#416788",
    fontSize: 18,
  },
});
