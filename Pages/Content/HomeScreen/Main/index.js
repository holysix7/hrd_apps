import {View, ScrollView, ActivityIndicator, Image, TouchableOpacity, ImageBackground, Alert} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button} from 'native-base'
import Axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage"
import sipLog from '../../../Assets/logo-sip370x50.png'
import HRHQ from '../../../Assets/orange.jpg'
import nopict from '../../../Assets/nopict.jpg'
import moment from 'moment'
import base_url from '../../../System/base_url'
import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import app_version from '../../../System/app_version'
import ContentToDo from './ContentToDo'

const Main = ({navigation}) => {
  useEffect(() => {
    getSession()
    // getLocation()
    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    });
    return unsubscribe;
  }, [])
  /**
   * Auth
   */
  const [id, setId]                 = useState(null)
  const [name, setName]             = useState(null)
  const [userImage, setUserImage]   = useState(null)
  const [user, setUser]             = useState(null)
  const [DeptName, setDept]         = useState(null)
  const [code, setCode]             = useState(null)
  const [todo, setTodo]             = useState([])
  const [feature, setFeature]       = useState([])
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
    setLoading(false)
    const token         = await AsyncStorage.getItem('key')
    const user            = await AsyncStorage.getItem('user')
    const name            = await AsyncStorage.getItem('name')
    const id              = await AsyncStorage.getItem('id')
    const sys_plant_id    = await AsyncStorage.getItem('sys_plant_id')
    const department_name = await AsyncStorage.getItem('department_name')
    const user_image      = await AsyncStorage.getItem('employee_image_base64')
    setName(name)
    setUser(user)
    setId(id)
    setDept(department_name)
    setUserImage(user_image)
    const data = {
      'sys_plant_id': sys_plant_id,
      'app_version': app_version,
      'user_id': id
    }
    const headers = {
      'Authorization': `${token}`, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '__profilin=p%3Dt'
    }
    var config = {
      method: 'get',
      url: `${base_url}/api/v2/hrds`,
      headers: headers,
      params : data
    };

		Axios(config)
		.then(response => {
      setCode(response.data.code)
			setTodo(response.data.data.todolist)
			setFeature(response.data.data.feature)
			setLoading(true)
      console.log('mantap api sukses')
		})
		.catch(error => {
      console.log(error)
      Alert.alert(
        "Info",
        "Silahkan Login Kembali",
        [
          { text: "OK", onPress: () => logout() }
          // { text: "OK", onPress: () => console.log() }
        ],
        { cancelable: false }
      );
			setLoading(true)
		})
	}

  const logout = async() => {
    AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => {
      navigation.replace('Login')
      alert("Successfully Logout!")
    })
  }

  const content = () => {
    const arrData = []
    if(feature.length > 0){
      feature.map((el, key) => {
        // console.log(el.create_from_mobile_apps)
        arrData.push(
          <TouchableOpacity key={key} style={{marginHorizontal: 10, height: 150, alignItems: 'center', backgroundColor: '#FFFFFF', flexDirection: 'column'}} onPress={() => navigation.navigate('Get', {
            tbl: el.tbl_name,
            f_name: el.feature_name,
            create_access: el.create_from_mobile_apps,
            edit_access: el.edit_from_mobile_apps
          })}>
            <View style={{paddingTop: 25}}>
              <Image source={sipLog} style={{height: 50, width: 50}} />
            </View>
            <View style={{paddingTop: 20}}>
              <Text style={{fontSize: 13, color: 'black'}}>{el.feature_name}</Text>
            </View>
          </TouchableOpacity>
        )
      })
    }
    return arrData
  } 

  return (
    <Container>
      <ImageBackground source={HRHQ} style={{flex: 1, resizeMode: 'contain', justifyContent: 'flex-start'}}>
        <View style={{paddingVertical: 20, paddingHorizontal: 5, backgroundColor: 'rgba(0,0,0,0.4)'}}>
          <View style={{marginTop: 25, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
            
            <View style={{flexDirection: 'row', width: 350}}>
              <View style={{flexDirection: 'column'}}>
                <View style={{height: 100, width: 100, borderRadius: 50, borderWidth: 1, borderColor: '#ffecd9', alignItems: 'center', justifyContent: 'center'}}>
                  {
                    userImage != null ?
                    <TouchableOpacity><Image source={{uri: userImage}} style={{height: 85, width: 85, resizeMode: 'cover', borderWidth: 0.5, borderRadius: 50, backgroundColor: 'red'}} /></TouchableOpacity> :
                    <TouchableOpacity><Image source={nopict} style={{height: 85, width: 85, resizeMode: 'cover', borderWidth: 0.5, borderRadius: 50}} /></TouchableOpacity>

                  }
                </View>
              </View>
              <View style={{flexDirection: 'column', flex: 1}}>
                <View style={{flexDirection: 'row', paddingTop: 5}}>
                  <Text style={{color: '#ffecd9', fontSize: 10}}>Welcome, <Text style={{fontWeight: 'bold', fontSize: 10, color: '#ffecd9'}}>{name != null ? name.slice(5, 1000) : null}</Text> </Text> 
                </View>
                <View style={{flexDirection: 'row', paddingTop: 5}}>
                  <Text style={{color: '#ffecd9', fontSize: 20, fontWeight: 'bold', textAlign: 'justify'}}> {userImage != null ? 'What do you want to do today' : '...............................................................'} </Text> 
                </View>
              </View>
            </View>
            {/* <View style={{flexDirection: 'row', marginTop: 20, borderRadius: 10, backgroundColor: '#FFFFFF', height: 280}}> */}
            {loading == false ? <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#ffffff"/></View> : <View style={{justifyContent: 'flex-end', marginTop: 30, backgroundColor: '#FFFFFF', borderRadius: 10}}>
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row', paddingTop: 5, paddingLeft: 5}}>
                  <Text style={{color: 'black', fontSize: 10, textDecorationLine: 'underline'}}>To do list</Text> 
                </View>
                <View style={{flexDirection: 'row', paddingVertical: 5, height: 285, width: 315}}>
                  <ScrollView>
                    <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                      <ContentToDo props={todo} />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View> }
            

          </View>
        </View>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}} />
        <View style={{backgroundColor: 'rgba(0,0,0,0.4)'}}>
          <View style={{justifyContent: 'flex-end', paddingHorizontal: 10, margin: 10, backgroundColor: '#FFFFFF', borderRadius: 10}}>
            <ScrollView horizontal>
                <View style={{flexWrap: 'wrap',  flexDirection: 'row'}}>
                  {loading == false ? null : content()}
                </View>
            </ScrollView>
          </View>
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