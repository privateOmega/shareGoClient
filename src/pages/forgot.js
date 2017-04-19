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
  TouchableHighlight,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get("window");
const background        = require("./background.jpg");
const config            = require('../configurations/config');
const t                 = require('tcomb-form-native');

var Form = t.form.Form;
var Person = t.struct({
  Email: t.String
});
var options = {
  fields: {
    Email: {
      placeholderTextColor: '#cccccc'
    }
  },
  auto: 'placeholders'
};

var ForgotPassword = React.createClass({
  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
      fetch("http://"+config.ipaddr+"/forgot", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:"email="+encodeURIComponent(value.Email)
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
    }
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        <View style={styles.markWrap}>
        <Text style={styles.HText}> Reset your account</Text>
        </View>
        <View style={styles.textCon}>
          <Text>Follow these simple steps to reset your Account </Text>
          <Text>1.Enter your email address associated with account.</Text>
          <Text>2.Wait for your recovery details to be sent.</Text>
          <Text>3.Follow instructions and be re-united with your sharego account.</Text>
        </View>  
          <Form
          ref="form"
          type={Person}
          options={options}
          />
          <TouchableOpacity activeOpacity={.5} onPress={this.onPress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Forgot Password</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.buttonText} onPress={_ => Actions.Login({type: 'reset'})}>Remember details</Text>
        </Image>
      </View>
    );
  }
});

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markWrap: {
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
  HText: {
    color: "#416788",
    fontSize: 18,
  },
  textCon: {
    paddingVertical: 20
  }
});
