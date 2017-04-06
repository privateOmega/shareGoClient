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

var t = require('tcomb-form-native');
var Form = t.form.Form;
var Person = t.struct({
  Phone:     t.Number,
  Gender:    t.String,
  Aadhar:    t.String,
  State:     t.String,
  City:      t.String,
  Pincode:   t.Number,
  Dob:       t.Date
});

var options = {
  fields: {
    Phone: {
      placeholderTextColor: '#cccccc'
    },
    Gender: {
      placeholderTextColor: '#cccccc'
    },
    Aadhar: {
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
    Dob: {
      placeholderTextColor: '#cccccc'
    }
},
  auto: 'placeholders'
};

var Signupcont = React.createClass ({
  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      fetch("http://"+config.ipaddr+":8080/signup", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "name="+encodeURIComponent(this.props.Name)+
          "&email="+encodeURIComponent(this.props.Email)+
          "&username="+encodeURIComponent(this.props.Username)+
          "&password="+encodeURIComponent(this.props.Password)+
          "&gender="+encodeURIComponent(value.Gender)+
          "&number="+encodeURIComponent(value.Phone)+
          "&aadharNo="+encodeURIComponent(value.Aadhar)+
          "&state="+encodeURIComponent(value.State)+
          "&city="+encodeURIComponent(value.City)+
          "&pincode="+encodeURIComponent(value.Pincode)+
          "&dob="+encodeURIComponent(value.Dob)
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
          <Form
          ref="form"
          type={Person}
          options={options}
          />
          <TouchableOpacity activeOpacity={.5} onPress={this.onPress.bind(this)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
            </View>
          </TouchableOpacity>
        </Image>
      </View>
    )
  }
});

export default Signupcont;
let styles = StyleSheet.create({
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
  }
});