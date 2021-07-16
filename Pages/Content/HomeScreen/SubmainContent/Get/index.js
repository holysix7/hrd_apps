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
import check from '../../../../Assets/check.png'
import moment from 'moment'
import HeaderContent from '../../../../Header/index'
import base_url from '../../../../System/base_url'
import app_version from '../../../../System/app_version'
import Geolocation from '@react-native-community/geolocation';
import GetContent from './GetContent'

const HomeScreen = ({navigation, route}) => {
  const {tbl, f_name, create_access, edit_access} = route.params 
  // console.log(create_access)
  useEffect(() => {
    cekLogin()
    getLocation()
    // if(tbl == 'employee'){
    getAllDepartment()
    // }
  }, [])
  /**
   * Auth
   */
  const [token, setToken]                   = useState(null)
  const [sysPlantId, setSysPlantId]         = useState(0)
  const [get_depts, setDept]                = useState([])
  const [sys_department_id, setDeptId]      = useState(0)
  const [user_id, setId]                    = useState(null)
  const [name, setName]                     = useState(null)
  const [user, setUser]                     = useState(null)
  const [code, setCode]                     = useState(null)
  const [duty, setDuty]                     = useState([])
  const [feature, setFeature]               = useState([])
	
  
  var timeNow 	                            = moment()
  const [refreshing, setRefreshing]         = useState(false);
  const [data, setData]                     = useState([])
	const [loading, setLoading]               = useState(true);
	const [mode, setMode]		                  = useState(null)
	const [prop_button, setPropButton]        = useState(null)
	const [props, setProps]		                = useState(null)
	const [show, setShow]		                  = useState(false)
	const [latitude, setLatitude]		          = useState(false)
	const [longitude, setLongitude]		        = useState(false)
  const [start_date, setStart]              = useState(new Date(timeNow))
  const [end_date, setEnd]                  = useState(new Date(timeNow))
	var startDateText 	                      = moment(start_date).format("YYYY-MM-DD") 
	var endDateText 	                        = moment(end_date).format("YYYY-MM-DD")

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
    const sys_department_id = await AsyncStorage.getItem('sys_department_id')
    const duty_plant_option_select = await AsyncStorage.getItem('duty_plant_option_select')
    const feature = await AsyncStorage.getItem('feature')
    const sys_plant_id = await AsyncStorage.getItem('sys_plant_id')
    setDeptId(sys_department_id)
		setSysPlantId(sys_plant_id)
		setToken(isLogin)
    setName(name)
    setUser(user)
    setId(id)
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
  
  const searchData = () => {
    setLoading(false)
    const data = {
      'sys_plant_id': sysPlantId,
      'start_date': moment(start_date).format("YYYY-MM-DD"),
      'end_date': moment(end_date).format("YYYY-MM-DD"),
      'app_version': app_version,
      'tbl': tbl,
      'latitude': latitude,
      'longitude': longitude,
      'user_id': user_id,
      'sys_department_id': sys_department_id
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
      console.log(response.data.data)
			setProps(response.data.data)
			setLoading(true)
      const newProps = {
        code: response.data.code,
        data_count: parseInt(response.data.data_count),
        data: JSON.stringify(response.data.data),
        tbl_name: response.data.tbl_name,
        column_name: response.data.column_name,
        start_date: startDateText,
        end_date: endDateText,
        form_name: f_name
      }
      setProps(newProps)
      console.log('mantap berhasil load')
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

  const getAllDepartment = () => {
    setLoading(false)
    const data = {
      // tbl: tbl,
      tbl: 'violation',
      app_version: app_version,
      sys_plant_id: sysPlantId,
      user_id: user_id
    }
    // console.log(data)
    const headers = {
      'Authorization': `${token}`, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '__profilin=p%3Dt'
    }
    var config = {
      method: 'get',
      url: `${base_url}/api/v2/hrds/new?`,
      headers: headers,
      params : data
    };

		Axios(config)
		.then(response => {
			setDept(response.data.data != null ? response.data.data.department_list : [])
			setLoading(true)
      const newProps = {
        code: response.data.code,
        data_count: parseInt(response.data.data_count),
        data: JSON.stringify(response.data.data),
        tbl_name: response.data.tbl_name,
        column_name: response.data.column_name,
        start_date: startDateText,
        end_date: endDateText,
        form_name: f_name
      }
      setProps(newProps)
      console.log('mantap berhasil load')
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
  
  const triggeredAPIListKaryawan = (val) => {
    setDeptId(val)
    searchData()
  }

  const dateFunction = () => {
    if(tbl != 'employee'){
      if(sysPlantId > 0){
        return(
          <View style={{flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 0.7, borderColor: 'grey', paddingBottom: 5}}>
            <View style={{flexDirection: 'row', borderWidth: 0.8, borderBottomWidth: 1, borderColor:'grey', height: 40, width: 150, paddingRight: 5, margin: 5, justifyContent: 'space-around', alignItems: 'center'}}>
              <View style={{flexDirection: 'column', paddingLeft: 5, flex: 1}}>
                <Text onPress={() => functionUpdateMode(1)}>{startDateText != null ? startDateText : 'Pilih'}</Text>
              </View>
              <View style={{flexDirection: 'column', alignItems: 'flex-end', width: 35, paddingTop: 2}}>
                <TouchableOpacity onPress={() => functionUpdateMode(1)}>
                  <Image source={CalendarBlack} style={{width: 25, height: 25, marginLeft: 4}}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row', borderWidth: 0.8, borderBottomWidth: 1, borderColor:'grey', height: 40, width: 150, paddingLeft: 5, margin: 5, justifyContent: 'space-around', alignItems: 'center'}}>
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
    }else{
      var loopDept = []
      if(get_depts.length > 0){
        get_depts.map((val, key) => {
          loopDept.push(
            <Picker.Item label={val.name} value={val.id} key={key} />
          )
        })
      }else{
        loopDept.push(
          <Picker.Item label={'Gagal Memanggil List Department'} value={0} key={1} />
        )
      }
      return (
        <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
          <View style={{flexDirection: 'column', borderWidth: 0.8, borderColor:'grey', height: 40, flex: 1, margin: 5, justifyContent: 'center'}}>
            <Picker
              selectedValue={sys_department_id}
              style={{ height: 40, width: 400, color: 'black'}}
              itemStyle={{height: 20}}
              onValueChange={(val) => triggeredAPIListKaryawan(val)}
            >
              {loopDept}
            </Picker>
          </View>
        </View>
      )
    }
  }

  const onRefresh = () => {
    setRefreshing(false)
    searchData()
    getAllDepartment()
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
      id: user_id,
      name: name,
      nik: user,
      create_access: create_access
    })
  }
  
  const GetContent = () => {
    const arrData = []
    if(props != null){
      if(props.code != 403){
        if(props.data_count > 0){
          var data = JSON.parse(props.data)
          data.map((val, key) => {
            var column_name = props.column_name
            column_name.map((valKey, keyKey) => {
              var keduaCuk = valKey.key
            })
            console.log(val)
            arrData.push(
              <View key={key} style={{flexDirection: 'row', flexWrap: 'nowrap', paddingHorizontal: 22}}>
                <Button style={{marginTop: 10, alignItems: 'center', width: 350, borderRadius: 10, backgroundColor: '#F7A440', flexDirection: 'row'}} onPress={() => {
                  navigation.navigate('Show', {
                    val: val,
                    tbl_name: tbl
                  })
                }}>
                  <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start', width: '50%'}}>
                    <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_a}</Text>
                    <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_c}</Text>
                  </View>
                  {val.list_col_d != null ? 
                    <View style={{width: '50%', flexDirection: 'column', alignItems: 'flex-end'}}>
                      <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_b}</Text>
                      <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_d}</Text>
                    </View> : 
                    <View style={{width: '50%', flexDirection: 'column', alignItems: 'flex-end'}}>
                      <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_b}</Text>
                    </View>
                    }
                  { 
                    val.approve_3_by != null ?
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingRight: 5}}>
                      <Image source={check} style={{width: 25, height: 25}} />
                    </View> :
                    null
                  }
                </Button>
              </View>
            )
          })
        }else{
          arrData.push(
            <View key={'1'} style={{flexDirection: 'row', paddingTop: 10, paddingHorizontal: 22}}>
              <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d35400', height: 100, width: 350, padding: 20, borderWidth: 0.5, borderRadius: 10, borderColor: '#FEA82F'}}>
                <Text style={{color: 'white', fontSize: 13}}>Tidak Ada Data Pada Tanggal  </Text>
                <Text style={{color: 'white', fontSize: 13}}>{props.start_date} - {props.end_date} </Text>
              </View>
            </View>
          )
        }
      }else{
        arrData.push(
          <View key={'1'} style={{flexDirection: 'row', paddingTop: 10, paddingHorizontal: 22}}>
            <View style={{backgroundColor: '#d35400', height: 100, padding: 20, borderWidth: 0.5, borderRadius: 10, borderColor: '#FEA82F'}}>
              <Text style={{color: 'white', fontSize: 13}}>Maaf Anda Tidak Memiliki Hak Akses</Text>
            </View>
          </View>
        )
      }
    }else{
        arrData.push(
          <View key={'1'} style={{flexDirection: 'row', paddingTop: 10, paddingHorizontal: 22}}>
            <View style={{backgroundColor: '#d35400', height: 100, padding: 20, borderWidth: 0.5, borderRadius: 10, borderColor: '#FEA82F'}}>
              <Text style={{color: 'white', fontSize: 13}}>Silahkan Cari Data <Text style={{fontWeight: 'bold', color: 'white', fontSize: 13}}>{f_name != null ? f_name : null}</Text> Berdasarkan Tanggal</Text>
            </View>
          </View>
        )
    }
    return arrData
  }

  return (
    <Container>
      <View>
        <HeaderContent props={f_name} />
      </View>
      <View style={{flexDirection: 'row', flex: 1, backgroundColor: '#DDDDDD'}}>
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
            <View style={{flexDirection: 'column', borderWidth: 0.8, borderColor:'grey', height: 40, flex: 1, margin: 5, justifyContent: 'center'}}>
              <Picker
                selectedValue={sysPlantId}
                style={{ height: 40, width: 400, color: 'black'}}
                itemStyle={{height: 20}}
                onValueChange={(itemValue, itemIndex) => updatePicker(itemValue)}
              >
                {pickerItemFunc()}
              </Picker>
            </View>
          </View>
          {dateFunction()}
          {/* <View style={{flexDirection: 'row', marginRight: 15, paddingBottom: 100}}> */}
          <View style={{flexDirection: 'row', flex: 1}}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
              {
              loading == false ? <View style={{backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#0000ff"/></View> :
              <View style={{backgroundColor: 'white', paddingBottom: 15, alignItems: 'center'}}>
                {GetContent()}
              </View>
              }
            </ScrollView>
          </View>
        </View>
      </View>
      {create_access == true ? 
        <View key={1} style={{height: 70, backgroundColor: '#DDDDDD', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap'}}>
          <Button style={{marginTop: 15, flexDirection: 'column', backgroundColor: '#d35400', height: "60%", width: '80%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}} onPress={() => navigation.navigate('Add', {
            row: prop_button,
            tbl_name: tbl
            })} >
            <Text>Add Violation</Text>
          </Button>
        </View> :
        null
      }
    </Container>
  ) 
}

export default HomeScreen