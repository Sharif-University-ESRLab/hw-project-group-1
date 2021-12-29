import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Modal, Image, Button, TouchableOpacity, View, FlatList, Switch, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState, useEffect } from 'react';
import { get_record_status, start_recording, stop_recording, get_pictures, get_video } from './camera/requests'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import {serverUrl} from './camera/requests'

const { width, height } = Dimensions.get('window');
const SPACING = 10;
const THUMB_SIZE = 80;

const IMAGES = [
  { 
    name:'pic1',
    image: 'iVBORw0KGgoAAAANSUhEUgAAAoEAAADnCAYAAABhYYzWAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAACgaADAAQAAAABAAAA5wAAAADh7g/qAAAFTHRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMmFwcC5kaWFncmFtcy5uZXQlMjIlMjBtb2RpZmllZCUzRCUyMjIwMjEtMTItMjRUMTUlM0EwMiUzQTMyLjE1M1olMjIlMjBhZ2VudCUzRCUyMjUuMCUyMChNYWNpbnRvc2glM0IlMjBJbnRlbCUyME1hYyUyME9TJTIwWCUyMDEwXzE1XzQpJTIwQXBwbGVXZWJLaXQlMkY2MDUuMS4xNSUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBWZXJzaW9uJTJGMTMuMSUyMFNhZmFyaSUyRjYwNS4xLjE1JTIyJTIwZXRhZyUzRCUyMm1XRldMVUVxaUJTUXVPZ1B6VlZaJTIyJTIwdmVyc2lvbiUzRCUyMjE1LjguMyUyMiUyMHR5cGUlM0QlMjJkZXZpY2UlMjIlM0UlM0NkaWFncmFtJTIwaWQlM0QlMjJ1elhBZHJkT2xra2twRC1MMFhkVSUyMiUyMG5hbWUlM0QlMjJQYWdlLTElMjIlM0U1WmhkYjVzd0ZJWiUyRkRaZVRBRU1DbDAzU3RWcTNhVkl1cGwwNmNBSldEWTZNODlWZlB6c1lDSmdLVWlWYnQxNEZ2N1lQJTJCSGw5JTJGQkVMemJQREE4ZWI5QnVMZ1ZxdUhSOHN0TEJjMTNGdFclMkY0bzVWZ3FnZU9XUXNKSnJCczF3cEs4Z0JaMXYyUkxZaWhhRFFWalZKQk5XNHhZbmtNa1docm1uTzNiemRhTXR0JTJCNndRa1l3akxDMUZSJTJGa2xpa1duV3FjYW1LUnlCSldyMTZXdFZrdUdxdGhTTEZNZHVmU2VqZVFuUE9tQ2lmc3NNY3FLSlhnU243Zlg2bHR2NHlEcmtZMDZFSW5oZSUyRlJEWVBucjQ4c29mdlR4Rmo2U2NkWllmcFZvOVlmNnc0VmdnNDIlMkJZeHFDQzJoV2I3bEFoWWJuQ2thdmZTZEttbElxT3k1TWhISFE2NGdNT3IzJTJCblVvNWZ6QmxnR2doOWxrMmJTbEYyT25mSyUyQk1hQ2VWJTJCa1olMkIxckUydlNranQxZ2tRJTJCYXpBV1UzUGRIeWJPSEtUbVRIa3ExZUhWSzZQMVJtbmdqS0xsOWxOeGJVZktHS1VFZTM2bTFTNVlpaW91Q1JHMHdiWXBsZDRpTmhXd1EwaGtFdjRkQnBYR2dXSkJkTzN3ZkYlMkYyR0g0eklGOWNlb0s0SGZ0Z09VYkF0ajBEM09sJTJGQXVvSENnVUFDOHdTRUVlaGtVejNzdHp2bkc4N0pYV2RudUNkbnEyajdoU2xKY21XbU5BUzRGTlNjSm5LVHVkTVZHWWxqMVgzR29TQXZlSFVLcGJ6ZHFMR2NSdWZQTEglMkJoWW0wRks4cHRVb1V1QkdmUE1HZVV5YmlMbk9VcXlwcFEycEd1a0V1R2p5ZzBjc25yWFpadmxFbVRqNVpKZnRCeG9MdVVqODJrQ1JvSWRPTk1tbjdzVERKODlNeGQ2WTltVW1ENDhWVVdUMCUyQjJtVlQlMkZxeTNkZzJmNGwxMEpoOWUzaTg1VDU5UXNGNjNYTUlraUE3R3NpYWZoeXJhdkEzWE1DYXp2bUhxelUycDFzJTJGeTNzWTQ1JTJGb2M5V01PYlliMzJUYktMTllpZ0glMkJzcThEMyUyRlNsakgzRDJkdmtYQVFaZURsY1htOWw5dXJjMmZLT2olMkJOdyUzRCUzRCUzQyUyRmRpYWdyYW0lM0UlM0MlMkZteGZpbGUlM0UR6TlJAAATKElEQVR4Ae3da6ilVRkH8HN0KrUSJQ1DCbEcHSj60BB+CulDBEpXCxIqiyYjKEJIqKYYy4zMQqILZUV90KDsQjAlSWVEheWHbqCBtzQsLTGki9nl9KzxbNnOOuPMeWft9zzv2r8XHvc+a/a79lq/Z7b+373POa6sOAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQ6EPgjNjGWtTpDbdzVsx1ddQNURdFnRTlIECAAAECBAgQGFHgiEN8rtVDfNzBHnZKPOAHUcdHfSHq3KjvRDkIECBAgAABAgQSCczeCdzeaE2vjXlun5trZ9wv7zTumBtzlwABAgQIECBAYMEC2xrN/4KY55gN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'
  },
]


export default function Camera() {
  const [isRecording, setIsRecording] = useState(true);
  const [images, setImages] = useState(IMAGES);
  const [indexSelected, setIndexSelected] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://reactnative.dev/');

  const onSelect = indexSelected => {
    setIndexSelected(indexSelected);
  };

  useEffect(() => {
    alert('useEffect')
    initializeRecording()
    getImages()
  }, []);

  const initializeRecording = () => {
    get_record_status()
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
  }

  const handleSwitch = (value) => {
    if (value === true) {
      start_recording()
      .then((status) => {})
      .catch((error) => {
        alert(error);
        setIsRecording(!value)
      });
    }
    else {
      stop_recording()
      .then((status) => {})
      .catch((error) => {
        alert(error);
        setIsRecording(!value)
      });
    }
    setIsRecording(value)
  }

  const getImages = () =>{
    get_pictures()
    .then((response) => response.json())
    .then((pictures) => {
      setImages(pictures.arr)
    })
    .catch((error) => {
      alert(error);
    });
  }

  const getVideo = async () => {
    const name = images[indexSelected].name.replace('.jpg', '.mp4')
    get_video(name)
    .then((response) => response.text())
    .then((value) => {
      alert(value)
      setVideoUrl(value)
      setShowVideo(true)
    })
    .catch((error) => {
      alert(error);
    });
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
    <View style={{ flex: 1, alignItems:'center' }}>
      <Text style={{...styles.text, ...styles.mb, alignSelf:'flex-start'}}>
          Gallery
      </Text>
      <Carousel
            layout='default'
            data={images}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={index => onSelect(index)}
            renderItem={({ item, index }) => (
                <Image
                  key={index}styles
                  resizeMode='contain'
                  source={{
                    uri: `data:image/jpg;base64,${item.image}`
                  }}
                  style={{ width: '100%', height: '100%' }}
                />
            )}
      />
      <Pagination
            inactiveDotColor='gray'
            dotColor={'orange'}
            activeDotIndex={indexSelected}
            dotsLength={images.length}
            animatedDuration={150}
            inactiveDotScale={1}
      />
       <Button
              title={'Play Video'}
              style={{ color: '#000', backgroundColor:'black' }}
              onPress={ getVideo }
      ></Button>
      </View>
      <Modal
        transparent={true}
        visible={showVideo}>
        <View style={{ 
          backgroundColor: 'white',
          marginTop: 40,
          marginLeft: 40,
          }}>
           <WebView
              source={{
                uri: `${serverUrl}${videoUrl}`
              }}
              onMessage={event => event.nativeEvent.data === 'WINDOW_CLOSED' ? setShowVideo(false) : {}}
            />
            <TouchableOpacity onPress={() => setShowVideo(false)}>
              <Text style={{ fontWeight:'bold', fontSize: 30}}>X</Text>
            </TouchableOpacity>
        </View>
      </Modal>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 60,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#fff',
    height: '100%',
    flex:1,
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
  },
  mb:{
    marginBottom: 20
  }
});