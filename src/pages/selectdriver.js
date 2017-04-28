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
const ASPECT_RATIO      = width / height;

const LATITUDE_DELTA  = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var moment = require('moment');
var now = moment().format('H:mm:ss');
var today = moment().format('D:MM:YYYY');
var Trip = React.createClass ({
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
      start: {
        latitude: 0.000,
        longitude: 0.000
      },
      end:{
        latitude: 0.000,
        longitude: 0.000
      },
      markers:[{
            title: "anything",
            coordinates: {
            latitude : 0.000,
            longitude : 0.000,
        }
      }],
      paxUser: "Initial"
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
  componentDidMount(){
    this.watchID = navigator.geolocation.watchPosition((position) => {
            var lastPosition = JSON.stringify(position);
            console.log("POS = "+position);
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
   this.getDriverMarkers();
  
  },
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
  },
  onRegionChange(region,coordinate) {
    this.setState({ region,coordinate });
  },
  async getDriverMarkers(){
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    this.setState({paxUser:username});
    console.log("PAX LATITUDE ISSSS "+this.props.paxlatitude);
    if (token && username) {
      fetch("http://"+config.ipaddr+"/logged/matchPaxtoDriver?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "&_id="+encodeURIComponent(this.props._id)+
          "&paxLatitude="+encodeURIComponent(this.props.paxlatitude)+
          "&paxLongitude="+encodeURIComponent(this.props.paxlongitude)
          
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log("yo success");
         /* for(var username in responseData.driverList){
              console.log("\n" + username +": "+responseData.driverList[username]);
           }

         */
          console.log(responseData.jArr);
          var myArray =  responseData.jArr;
          for(var i=0 ; i<myArray.length;i++)
          {   console.log("\nUSER"+(i+1))
              console.log(myArray[i].title);
              console.log(myArray[i].coordinates.latitude);
              myArray[i].coordinates.latitude=parseFloat(myArray[i].coordinates.latitude);
              console.log(myArray[i].coordinates.longitude);
              myArray[i].coordinates.longitude=parseFloat(myArray[i].coordinates.longitude);
          }
         console.log("GOT DATA ");
          this.setState({
            start:{
              latitude: parseFloat(responseData.startLatitude),
              longitude: parseFloat(responseData.startLongitude)
            },
            end:{
              latitude: parseFloat(responseData.endLatitude),
              longitude: parseFloat(responseData.endLongitude)
            },
            markers: myArray
            
          });
      })
      .done();
    }
  },
  async connectPaxtoDriver(driverUser,paxUser){
    var token = await AsyncStorage.getItem('token');
    var username = await AsyncStorage.getItem('username');
    console.log("PAX LATITUDE ISSSS "+this.props.paxlatitude);
    if (token && username) {
      fetch("http://"+config.ipaddr+"/logged/connectPaxToDriver?token="+token, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
          "&driverUser="+encodeURIComponent(driverUser)+
          "&paxUser="+encodeURIComponent(username)
          
      })
      .then((response) => response.json())
      .then((responseData) => {
          console.log("SUCCESS AYO ?");
          if(responseData.success){
            alert("Your request to "+ driverUser+"has been forwarded");
            Actions.Trip({type:'reset',_id: responseData._id, role: "pax",latitude:this.state.coordinate.latitude,longitude:this.state.coordinate.longitude });   
          }
          else
            alert('Selecting driver failed');
         /* for(var username in responseData.driverList){
              console.log("\n" + username +": "+responseData.driverList[username]);
           }

         */
        })
      .done();
    }
  },

  componentWillMount(){
  console.log('\nMOUNTED'); 
  },
  render() {
    return (
      <View style={styles.container}>
        <Image source={background} style={styles.background} resizeMode="cover">
        
        <View style={styles.container}>
          <Text style={{marginLeft:width*0.15,marginTop:10,fontSize:18,fontWeight:'bold',color:'red'}}> Select from Available Drivers </Text>
           <MapView region={this.state.region} style={styles.map} >
              <MapView.Marker
            coordinate={this.state.coordinate}
            />
             {this.state.markers.map(marker => (
              <MapView.Marker  onCalloutPress={() => {this.connectPaxtoDriver(marker.title,this.state.paxUser)}}
                 coordinate={marker.coordinates}
                 title={marker.title}
                 key={marker.title}
                 pinColor={'blue'}
              />
            ))}
          </MapView>
        </View>
        </Image>
      </View>
    );
  }
});

export default Trip;

const styles = StyleSheet.create({
  map: {
    position: 'relative',
    height:height*0.87,
    width:width,
    top: 25,
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
