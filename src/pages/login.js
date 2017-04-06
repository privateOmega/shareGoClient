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
const mark              = require("./login1_mark.png");
const config            = require('../configurations/config');
const t                 = require('tcomb-form-native');

var Form = t.form.Form;
var Person = t.struct({
  Username: t.String,
  Password: t.String
});
var options = {
  fields: {
    Username: {
      placeholderTextColor: '#cccccc'
    },
    Password: {
      password: true,
      secureTextEntry: true,
      placeholderTextColor: '#cccccc'
    }
  },
  auto: 'placeholders'
};

var Login = React.createClass ({
  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    }
    catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
      fetch("http://"+config.ipaddr+":8080/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "username="+encodeURIComponent(value.Username)+"&password="+encodeURIComponent(value.Password)
      })
      .then((response) => response.json())
      .then((responseData) => {
        this._onValueChange('token', responseData.token);
        this._onValueChange('username', value.Username);
        Actions.Dashboard();
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
          />
          <TouchableOpacity activeOpacity={.5} onPress={Actions.ForgotPassword}>
            <View>
              <Text style={styles.forgotPasswordText} >Forgot Password?</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={.5} onPress={this.onPress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.container}>
            <View style={styles.signupWrap}>
              <Text style={styles.accountText}>Don't have an account?</Text>
              <TouchableOpacity activeOpacity={.5} onPress={Actions.Signup}>
                <View>
                  <Text style={styles.signupLinkText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Image>
      </View>
    )
  }
});

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markWrap: {
    flex: 1,
    paddingVertical: 30,
  },
  mark: {
    width: null,
    height: null,
    flex: 1,
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
