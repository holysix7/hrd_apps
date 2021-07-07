import {View, ScrollView, ActivityIndicator, Image, Alert, ImageBackground} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button} from 'native-base'
import Axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage"
import sipLog from '../../../Assets/logo-sip370x50.png'
import HRHQ from '../../../Assets/orange.jpg'
import moment from 'moment'
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import app_version from '../../../System/app_version'

const Main = ({navigation}) => {
  useEffect(() => {
    getSession()
    getLocation()
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    });
    return unsubscribe;
  }, [])
  /**
   * Auth
   */
  const [token, setToken]           = useState(null)
  const [id, setId]                 = useState(null)
  const [name, setName]             = useState(null)
  const [userImage, setUserImage]   = useState(null)
  const [user, setUser]             = useState(null)
  const [DeptName, setDept]         = useState(null)
  
  var timeNow 	                    = moment()
  const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading]       = useState(true);
	const [latitude, setLatitude]		  = useState(false)
	const [longitude, setLongitude]		= useState(false)

  const getLocation = async() => {
    Geolocation.getCurrentPosition((value) => {
      setLatitude(value.coords.latitude)
      setLongitude(value.coords.longitude)
    })
  }
  
	const getSession = async() => {
    const isLogin = await AsyncStorage.getItem('key')
    const user = await AsyncStorage.getItem('user')
    const name = await AsyncStorage.getItem('name')
    const id = await AsyncStorage.getItem('id')
    const department_name = await AsyncStorage.getItem('department_name')
    const user_image = await AsyncStorage.getItem('employee_image_base64')
		setToken(isLogin)
    setName(name)
    setUser(user)
    setId(id)
    setDept(department_name)
    setUserImage(user_image)
	}

  const logout = async() => {
    AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => {
      navigation.replace('Login')
      alert("Successfully Logout!")
    })
  }

  const refreshFunc = () => {
    setInterval(() => {
      setLoading(true)
    }, 2000);
  }

  const onRefresh = () => {
    setRefreshing(false)
    setLoading(false)
    refreshFunc()
  }

  const content = () => {
    const arrData = []
    for(var i = 0; i < 10; i++){
      arrData.push(
        <Button key={i} style={{marginHorizontal: 5, height: 150, alignItems: 'center', borderRadius: 10, backgroundColor: '#e6b65e', flexDirection: 'column'}} onPress={() => navigation.navigate('Violation')}>
          <View style={{paddingTop: 25}}>
            <Image source={sipLog} style={{height: 50, width: 50}} />
          </View>
          <Text style={{fontWeight: 'bold'}}>HR Violation</Text>
        </Button>
      )
    }
    return arrData
  } 

  return (
    <Container>
      {/* <View>
        <HeaderContent />
      </View> */}
      {/* <View style={{flexDirection: 'row', backgroundColor: '#DDDDDD', flex: 1}}>
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Image source={HRHQ} style={{height: 450, width: 400}} />
        </View>
      </View> */}
      <ImageBackground source={HRHQ} style={{flex: 1, resizeMode: 'contain', justifyContent: 'flex-end'}}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}} />
          <View style={{paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.4)'}}>
            <ScrollView horizontal>
                <View style={{flexWrap: 'wrap',  flexDirection: 'row'}}>
                  {loading == false ? <View style={{backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#0000ff"/></View> : content() }
                </View>
            </ScrollView>
          </View>
      </ImageBackground>
      <View style={{height: 60, backgroundColor: '#d35400', borderTopWidth: 1, borderColor: '#FEA82F', flexDirection: 'row'}}>
        <Button style={{flexDirection: 'column', borderRightWidth: 0.5, borderColor: '#FEA82F', backgroundColor: '#d35400', width: '50%', height: "100%", justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Home</Text>
        </Button>
        <Button style={{flexDirection: 'column', borderColor: '#FEA82F', backgroundColor: '#d35400', width: '50%', height: "100%", justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.navigate('Profile', {
          id: id,
          name: name,
          user: user,
          dept_name: DeptName,
          user_image: userImage,
          app_version: app_version
        })}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Profile</Text>
        </Button>
      </View>
    </Container>
  ) 
}

export default Main