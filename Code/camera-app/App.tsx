import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Switch } from 'react-native'
import React, {useState, useEffect} from 'react';
import {get_record_status, start_recording, stop_recording} from './camera/requests'


export default function Camera() {
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    alert('useEffect')
    get_record_status()
    .then((response) => response.json())
    .then((status) => {
      if (status === 'recording') {
        setIsRecording(true)
      }
      else {
        setIsRecording(false)
      }
    })
    .catch((error) => {
      alert(error);
    });
  }, []);

  const handleSwitch = (value) =>{
    if (value === true) {
      alert('start recording')
      start_recording()
      .then((response) => response.json())
      .then((status) => {})
      .catch((error) => {
        alert(error);
        setIsRecording(!value)
      });
    }
    else {
      alert('stop recording')
      stop_recording()
      .then((response) => response.json())
      .then((status) => {})
      .catch((error) => {
        alert(error);
        setIsRecording(!value)
      });
    }
    setIsRecording(value)
  }

  return (
  <View style={styles.container}>
    <View style={{...styles.flex, ...styles.spaceBetween}}>
      <Text style={{...styles.text, ...styles.mr}}>
        Camera recording
      </Text>
      <Switch
        onValueChange = {handleSwitch}
        value = {isRecording}
      />
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 60,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#fff',
    height: '100%'
  },
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween:{
    justifyContent:'space-between'
  },
  text:{
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
  },
  pl:{
    paddingLeft: 16,
  },
  pr:{
    paddingRight:16
  },
  mr:{
    marginRight:16
  }
});