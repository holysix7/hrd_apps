import {View, ScrollView, ActivityIndicator, Image, Alert, RefreshControl} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button} from 'native-base'
import Axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import CalendarBlack from '../../../Assets/calendar.png'
import plusOne from '../../../Assets/plus.png'
import search from '../../../Assets/search.png'
import check from '../../../Assets/check.png'
import moment from 'moment'
import HeaderContent from '../../../Header/index'
import base_url from '../../../System/base_url'
import app_version from '../../../System/app_version'
import Geolocation from '@react-native-community/geolocation';

const HomeScreen = ({navigation}) => {
  useEffect(() => {
    cekLogin()
    getLocation()
    if(plant > 0){
      searchData()
    }
  }, [])
  /**
   * Auth
   */
  const [token, setToken]           = useState(null)
  const [id, setId]                 = useState(null)
  const [name, setName]             = useState(null)
  const [user, setUser]             = useState(null)
  const [DeptName, setDept]         = useState(null)
  const [code, setCode]             = useState(null)
  const [duty, setDuty]             = useState([])
  const [feature, setFeature]       = useState([])
	
  
  var timeNow 	                    = moment()
  const [refreshing, setRefreshing] = useState(false);
  const [plant, setPlant]           = useState(0)
  const [data, setData]             = useState([])
	const [loading, setLoading]       = useState(true);
	const [mode, setMode]		          = useState(null)
	const [show, setShow]		          = useState(false)
	const [latitude, setLatitude]		  = useState(false)
	const [longitude, setLongitude]		= useState(false)
  const [start_date, setStart]      = useState(new Date(timeNow))
  const [end_date, setEnd]          = useState(new Date(timeNow))
	var startDateText 	              = moment(start_date).format("YYYY-MM-DD") 
	var endDateText 	                = moment(end_date).format("YYYY-MM-DD")

  const getLocation = async() => {
    Geolocation.getCurrentPosition((value) => {
      setLatitude(value.coords.latitude)
      setLongitude(value.coords.longitude)
    })
  }

	const cekLogin = async() => {
    const isLogin = await AsyncStorage.getItem('key')
    const user = await AsyncStorage.getItem('user')
    const name = await AsyncStorage.getItem('name')
    const id = await AsyncStorage.getItem('id')
    const department_name = await AsyncStorage.getItem('department_name')
    const duty_plant_option_select = await AsyncStorage.getItem('duty_plant_option_select')
    const feature = await AsyncStorage.getItem('feature')
		setToken(isLogin)
    setName(name)
    setUser(user)
    setId(id)
    setDept(department_name)
    setDuty(JSON.parse(duty_plant_option_select))
    setFeature(JSON.parse(feature))
	}
  
  const logout = async() => {
    AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => {
      navigation.replace('Login')
      alert("Successfully Logout!")
    })
  }
  
  const searchData = async() => {
    setLoading(false)
    const data = {
      'sys_plant_id': plant,
      'start_date': moment(start_date).format("YYYY-MM-DD"),
      'end_date': moment(end_date).format("YYYY-MM-DD"),
      'app_version': app_version,
      'tbl': 'violation',
      'latitude': latitude,
      'longitude': longitude,
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
			setData(response.data.data != null ? response.data.data : [])
			setLoading(true)
		})
		.catch(error => {
      console.log(error)
      Alert.alert(
        "Info",
        "Silahkan Login Kembali",
        [
          { text: "OK", onPress: () => logout() }
        ],
        { cancelable: false }
      );
			setLoading(true)
		})
  }
  
  const onChange = (event, val) => {
    const currentDate = val || start_date;
    setShow(Platform.OS === 'ios');
    setStart(currentDate)
  };

  const onChangeEnd = (event, val) => {
    const currentDate = val || end_date;
    setShow(Platform.OS === 'ios');
    setEnd(currentDate)
  };
  
  const showDateModal = () => {
    if(show == true){
      if(mode == 'start-date'){
        return (
          <DateTimePicker
            testID="dateTimePicker"
            value={start_date}
            maximumDate={end_date}
            mode={mode}
            is24Hour={true}
            display="calendar"
            onChange={(evt, val) => onChange(evt, val)}
          />
        )
      }else{
        return (
          <DateTimePicker
            testID="dateTimePicker"
            maximumDate={new Date(timeNow)}
            minimumDate={start_date}
            value={end_date}
            mode={mode}
            is24Hour={true}
            display="calendar"
            onChange={(evt, val) => onChangeEnd(evt, val)}
          />
        )
      }
    }
  }

  const functionUpdateMode = (value) => {
    if(value == 1){
      showDate('start-date')
    }else{
      showDate('end-date')
    }
  }
  
  const showDate = (val) => {
    setShow(true)
    setMode(val)
  }
  
  const dateFunction = () => {
    if(plant > 0){
      return(
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', borderWidth: 0.5, borderColor:'#FEA82F', height: 40, width: 150, paddingRight: 5, margin: 5, justifyContent: 'space-around', alignItems: 'center'}}>
            <View style={{flexDirection: 'column', paddingLeft: 5, flex: 1}}>
              <Text onPress={() => functionUpdateMode(1)}>{startDateText != null ? startDateText : 'Pilih'}</Text>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-end', width: 35, paddingTop: 2}}>
              <TouchableOpacity onPress={() => functionUpdateMode(1)}>
                <Image source={CalendarBlack} style={{width: 25, height: 25, marginLeft: 4}}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', borderWidth: 0.5, borderColor:'#FEA82F', height: 40, width: 150, paddingLeft: 5, margin: 5, justifyContent: 'space-around', alignItems: 'center'}}>
            <View style={{flexDirection: 'column', paddingLeft: 5, flex: 1}}>
              <Text onPress={() => functionUpdateMode(2)}>{endDateText != null ? endDateText : 'Pilih'}</Text>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'flex-end', width: 35, paddingTop: 2}}>
              <TouchableOpacity onPress={() => functionUpdateMode(2)}>
                <Image source={CalendarBlack} style={{width: 25, height: 25, marginLeft: 4}}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', height: 40, width: 80, paddingLeft: 5, margin: 5, justifyContent: 'space-around', alignItems: 'center'}}>
            <Button style={{backgroundColor: '#F7A440', borderRadius: 15, height: 40, width: 45, justifyContent: 'center'}} onPress={() => searchData()}>
              <Image source={search} style={{width: 25, height: 25, marginLeft: 2}}/>
            </Button>
          </View>
          
          {showDateModal()}
          
        </View>
      )
    }else{
      return(
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{borderWidth: 0.5, borderColor:'#FEA82F', height: 40, width: 150, paddingLeft: 5, margin: 5, justifyContent: 'center', backgroundColor: '#b8b8b8', borderRadius: 5}} onPress={() => alert("Silahkan pilih plant terlebih dahulu")}>
            <Text>Pilih</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{borderWidth: 0.5, borderColor:'#FEA82F', height: 40, width: 150, paddingLeft: 5, margin: 5, justifyContent: 'center', backgroundColor: '#b8b8b8', borderRadius: 5}} onPress={() => alert("Silahkan pilih plant terlebih dahulu")}>
            <Text>Pilih</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', height: 40, width: 80, paddingLeft: 5, margin: 5, justifyContent: 'space-around', alignItems: 'center'}}>
            <Button style={{backgroundColor: '#F7A440', borderRadius: 15, height: 40, width: 45, justifyContent: 'center'}} onPress={() => alert("Silahkan pilih plant terlebih dahulu")}>
              <Image source={search} style={{width: 25, height: 25, marginLeft: 2}}/>
            </Button>
          </View>
        </View>
      )
    }
  }

  const onRefresh = () => {
    setRefreshing(false)
    searchData()
  }

  const content = () => {
    const arrData = []
    if(code != null){
      if(data.length > 0){
        data.map((val, key) => {
          arrData.push(
            <View key={key} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Button style={{marginTop: 10, alignItems: 'center', width: 350, borderRadius: 10, backgroundColor: '#F7A440', flexDirection: 'row'}} onPress={() => {
                navigation.navigate('ShowViolation', {
                  user_id: id,
                  id: val.id,
                  sys_plant_id: val.sys_plant_id,
                  violator_id: val.violator_id,
                  violator_name: val.violator_name,
                  violator_nik: val.violator_nik,
                  violation_time: val.violation_time,
                  violation_date: val.violation_date,
                  violation_status: val.violation_status,
                  violation_status_case: val.violation_status_case,
                  approve_1_by: val.approve_1_by,
                  approve_2_by: val.approve_2_by,
                  approve_3_by: val.approve_3_by,
                  enforcer_id: val.enforcer_id,
                  enforcer_name: val.enforcer_name,
                  enforcer_nik: val.enforcer_nik,
                  whitness_id: val.whitness_id,
                  whitness_name: val.whitness_name,
                  whitness_nik: val.whitness_nik,
                  description: val.description,
                  penalty_first_name: val.penalty_first_name,
                  penalty_description: val.penalty_description,
                  penalty_second_name: val.penalty_second_name,
                  penalty_description_second: val.penalty_description_second,
                  // childData: childData,
                  start_date: moment(start_date).format("YYYY-MM-DD"),
                  end_date: moment(end_date).format("YYYY-MM-DD")
                })
              }}>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 11, color: 'black'}}>{val.violator_name}</Text>
                  <Text style={{fontSize: 11, color: 'black'}}>{val.violator_nik}</Text>
                </View>
                <View style={{widht: '30%', flexDirection: 'column', alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 11, color: 'black'}}>{val.violation_time}</Text>
                  <Text style={{fontSize: 11, color: 'black'}}>{val.violation_date}</Text>
                </View>
                { 
                  val.approve_3_by != null ?
                  <View style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={check} style={{width: 35, height: 35}} />
                  </View> :
                  null
                }
              </Button>
            </View>
          )
        })
      }else{
        arrData.push(
          <View key={'1'} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 300}}>
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d35400', height: 100, width: 350, padding: 20, borderWidth: 0.5, borderRadius: 10, borderColor: '#FEA82F'}}>
              <Text style={{color: 'white', fontSize: 13}}>Tidak Ada Data Pada Tanggal  </Text>
              <Text style={{color: 'white', fontSize: 13}}>{startDateText} - {endDateText} </Text>
            </View>
          </View>
        )
      }
    }else{
      arrData.push(
        <View key={'1'} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 300}}>
          <View style={{backgroundColor: '#d35400', height: 100, padding: 20, borderWidth: 0.5, borderRadius: 10, borderColor: '#FEA82F'}}>
            <Text style={{color: 'white', fontSize: 13}}>Maaf Anda Tidak Memiliki Hak Akses</Text>
          </View>
        </View>
      )
    }
    return arrData
  } 

  const pickerItemFunc = () => {
    const data = []
    if(duty.length > 0){
      duty.map((val, key) => {
        data.push(
          <Picker.Item label={val.plant_name} value={val.plant_id} key={key} />
        )
      })
    }
    return data
  }

  return (
    <Container>
      <View>
        <HeaderContent />
      </View>
      <View style={{flexDirection: 'row', flex: 1, backgroundColor: '#DDDDDD'}}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', borderWidth: 0.5, borderColor:'#FEA82F', height: 40, flex: 1, margin: 5, justifyContent: 'center'}}>
              <Picker
                selectedValue={plant}
                style={{ height: 40, width: 400, color: 'black' }}
                itemStyle={{height: 20}}
                onValueChange={(itemValue, itemIndex) => setPlant(itemValue)}
              >
                {pickerItemFunc()}
              </Picker>
            </View>
          </View>
          {dateFunction()}
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {loading == false ? <View style={{backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#0000ff"/></View> : content() }
          </ScrollView>
        </View>
      </View>
      <View style={{height: 70, backgroundColor: '#DDDDDD', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap'}}>
        <TouchableOpacity style={{flexDirection: 'column', height: "75%", justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}} onPress={() => navigation.navigate('AddViolation', {
          sys_plant_id: plant,
          id: id,
          name: name,
          nik: user
        })} >
          <Image source={plusOne} style={{width: 50, height: 50}} />
        </TouchableOpacity>
      </View>
    </Container>
  ) 
}

export default HomeScreen