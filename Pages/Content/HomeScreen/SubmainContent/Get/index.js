import {View, ScrollView, ActivityIndicator, Image, Alert, RefreshControl} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button} from 'native-base'
import Axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Picker } from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import CalendarBlack from '../../../../Assets/calendar.png'
import search from '../../../../Assets/search.png'
import moment from 'moment'
import HeaderContent from '../../../../Header/index'
import base_url from '../../../../System/base_url'
import app_version from '../../../../System/app_version'
import Geolocation from '@react-native-community/geolocation';
import GetContent from './GetContent'
import ButtonAdd from './ButtonAdd'

const HomeScreen = ({navigation, route}) => {
  const {tbl, f_name, create_access, edit_access} = route.params 
  useEffect(() => {
    cekLogin()
    getLocation()
    if(sysPlantId > 0){
      searchData()
    }
  }, [])
  /**
   * Auth
   */
  const [token, setToken]           = useState(null)
  const [sysPlantId, setSysPlantId] = useState(0)
  const [id, setId]                 = useState(null)
  const [name, setName]             = useState(null)
  const [user, setUser]             = useState(null)
  const [DeptName, setDept]         = useState(null)
  const [code, setCode]             = useState(null)
  const [duty, setDuty]             = useState([])
  const [feature, setFeature]       = useState([])
	
  
  var timeNow 	                    = moment()
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData]             = useState([])
	const [loading, setLoading]       = useState(true);
	const [mode, setMode]		          = useState(null)
	const [prop_button, setPropButton]= useState(null)
	const [props, setProps]		        = useState(null)
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
    const sys_plant_id = await AsyncStorage.getItem('sys_plant_id')
		setSysPlantId(sys_plant_id)
		setToken(isLogin)
    setName(name)
    setUser(user)
    setId(id)
    setDept(department_name)
    setDuty(JSON.parse(duty_plant_option_select))
    setFeature(JSON.parse(feature))
    setPropButton({
      sys_plant_id: JSON.parse(sys_plant_id),
      id: id,
      name: name,
      nik: user,
      create_access: create_access
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
  
  const searchData = async() => {
    setLoading(false)
    const data = {
      'sys_plant_id': sysPlantId,
      'start_date': moment(start_date).format("YYYY-MM-DD"),
      'end_date': moment(end_date).format("YYYY-MM-DD"),
      'app_version': app_version,
      'tbl': tbl,
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
      // url: `${base_url}/api/v2/hrds`,
      url: `http://192.168.131.121:3000/api/v2/hrds`,
      headers: headers,
      params : data
    };

		Axios(config)
		.then(response => {
      setCode(response.data.code)
			setData(response.data.data)
			setLoading(true)
      const newProps = {
        code: response.data.code,
        data_count: parseInt(response.data.data_count),
        data: JSON.stringify(response.data.data),
        tbl_name: response.data.tbl_name,
        column_name: response.data.column_name,
        start_date: startDateText,
        end_date: endDateText,
      }
      setProps(newProps)
		})
		.catch(error => {
      console.log(error)
      Alert.alert(
        "Error",
        "Hubungi IT!",
        [
          { text: "OK", onPress: () => console.log('wk') }
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
    if(sysPlantId > 0){
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
            <Button style={{backgroundColor: '#F7A440', borderRadius: 10, height: 40, width: 45, justifyContent: 'center'}} onPress={() => searchData()}>
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

  const updatePicker = (value) => {
    setSysPlantId(value)
    setPropButton({
      sys_plant_id: value,
      id: id,
      name: name,
      nik: user,
      create_access: create_access
    })
  }

  console.log(prop_button)
  return (
    <Container>
      <View>
        <HeaderContent props={f_name} />
      </View>
      <View style={{flexDirection: 'row', flex: 1, backgroundColor: '#DDDDDD'}}>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', borderWidth: 0.5, borderColor:'#FEA82F', height: 40, flex: 1, margin: 5, justifyContent: 'center'}}>
              <Picker
                selectedValue={sysPlantId}
                style={{ height: 40, width: 400, color: 'black' }}
                itemStyle={{height: 20}}
                onValueChange={(itemValue, itemIndex) => updatePicker(itemValue)}
              >
                {pickerItemFunc()}
              </Picker>
            </View>
          </View>
          {dateFunction()}
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {loading == false ? <View style={{backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#0000ff"/></View> : <GetContent props={props} /> }
          </ScrollView>
        </View>
      </View>
      {/* <ButtonAdd props={prop_button}  /> */}
      {create_access != false ? 
        <View key={1} style={{height: 70, backgroundColor: '#DDDDDD', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap'}}>
          <Button style={{flexDirection: 'column', backgroundColor: '#d35400', height: "75%", width: '80%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}} onPress={() => navigation.navigate('Add', prop_button)} >
            <Text>Add Violation</Text>
          </Button>
        </View> :
        null
      }
    </Container>
  ) 
}

export default HomeScreen