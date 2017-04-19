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
const mark              = require("./login2_mark.png");
import Icon from 'react-native-vector-icons/MaterialIcons';
const points = (<Icon name="star" size={40} color="#416788" />);
const driver = (<Icon name="person" size={30} color="#416788" />);
const pax = (<Icon name="person-add" size={30} color="#416788" />);
var Dashboard = React.createClass ({
  async _userLogout() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('username');
      console.log("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  },
  getInitialState() {
    return {
      driverRating: 0,
      paxRating: 0,
      points: 0
    };
  },
  async getUserDetails() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    if(token && username){
      fetch("http://"+config.ipaddr+"/logged/profile?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:"username="+encodeURIComponent(username)
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          driverRating: responseData.driverRating,
          paxRating: responseData.paxRating,
          points: responseData.points
        })
      })
      .done();
    }
  },
  async renderIf() {
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    console.log("rendering");
    if(token && username){
      fetch("http://"+config.ipaddr+"/logged/getTrip?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:"user="+encodeURIComponent(username)
      })
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(responseData);
        if(responseData.success == true) {
          this.setState({success: true,role: responseData.role,_id: responseData._id});
          //console.log("Success is true");
        }else {
          this.setState({success: false,role: "",_id: ""});
        }   
      })
      .done();
    }
  },
  rendering(){
    //console.log(this.state.success+this.state.role+this.state._id);
    if(this.state.success==null)
      return null;
    else if(this.state.success){
      var tripRole = this.state.role,
        tripId = this.state._id;
      return(
          <TouchableOpacity activeOpacity={.5} onPress={ _ => Actions.Trip({_id: this.state._id,role: this.state.role}) }>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Current Trip</Text>
              </View>
            </TouchableOpacity>
      );
    }
    else if(!this.state.success){
      return(
        <View style={{alignItems:'center',marginLeft:10,marginRight:10}}>
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
        </View>
      );
    }
  },
  componentWillMount(){
    this.setState({success: null});
    //this.setState({success: false,role: "",_id: ""});
    this.getUserDetails();
    this.renderIf();
    
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
          <View style={styles.markWrap}>
            <View style={{flexDirection:'column',borderWidth:3}}>
              <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center',borderBottomWidth:3,paddingHorizontal:5}}>{driver}<Text style={styles.points}>{this.state.driverRating}</Text></View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>{pax}<Text style={styles.points}>{this.state.paxRating}</Text></View>
            </View>
            <Image source={mark} style={styles.mark} resizeMode="contain" />
            <View style={{justifyContent:'center', alignItems:'center',borderWidth:3,paddingHorizontal:5}}>
              {points}
              <Text style={styles.points}>{this.state.points}</Text>
            </View>
          </View>
          {this.rendering()}
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
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20
  },
  mark: {
    width: 150,
    height: 150,
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
    marginTop: 30,
    width,
    alignItems:'center'
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
  points:{
    fontSize:18,
  }
});
