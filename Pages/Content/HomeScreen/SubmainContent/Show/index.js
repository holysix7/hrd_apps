import {View, ScrollView, ActivityIndicator, Image, RefreshControl, Alert} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button} from 'native-base'
import Axios from 'axios'
import AsyncStorage from "@react-native-community/async-storage"
import Xdua from '../../../../Assets/Xdua.png'
import approved_biru from '../../../../Assets/approved.png'
import moment from 'moment'
import base_url from '../../../../System/base_url'
import app_version from '../../../../System/app_version'

const Show = ({route, navigation}) => {
  // const {user_id, id, sys_plant_id, violator_id, violator_name, violator_nik, violation_time, violation_date, violation_status, violation_status_case, approve_1_by, approve_2_by, approve_3_by, enforcer_id, enforcer_name, enforcer_nik, whitness_id, whitness_name, whitness_nik, description, penalty_first_name, penalty_description, penalty_second_name, penalty_description_second, start_date, end_date} = route.params
  const {val, tbl_name} = route.params
  useEffect(() => {
    showViolation()
  }, [])
	var timeNow 	                    = moment()
  const [refreshing, setRefreshing] = useState(false)
	const [loading, setLoading]       = useState(true)
  const [user_id, setUserId]        = useState(null)
  const [token, setToken]           = useState(null)
  const [data, setData]             = useState(null)

  const submit = (value, type) => {
    console.log('ini val: ', value)
    console.log('ini type: ', type)
    const approve = parseInt(value)
    var data = {
      id: val.id,
      sys_plant_id: val.sys_plant_id,
      user_id: user_id,
      count_request: approve,
      type_request: type,
      tbl: tbl_name,
    }
    console.log(data)
		var config = {
			method: 'put',
      url: `${base_url}/api/v2/hrd_approve`,
			headers: { 
				'Authorization': `${token}`, 
				'Content-Type': 'application/json', 
				'Cookie': '_denapi_session=ubcfq3AHCuVeTlxtg%2F1nyEa3Ktylg8nY1lIEPD7pgS3YAWwlKOxwA0S9pw7JhvZ2mNkrYl0j62wAWJWJZd7AbfolGuHCwXgEMeJH6EoLiQ%3D%3D--M%2BjBb0uJeHmOf%2B3o--%2F2Fjw57x0Fyr90Ec9FVibQ%3D%3D'
			},
			data : data
		}
    Axios(config)
    .then(function(response){
      console.log("Success Approve ", response.data.code)
      setLoading(true)
      if(response.data.code == 403){
        Alert.alert(
          "Info",
          "Gagal Approve karena tidak memiliki hak akses",
          [
            { text: "OK", onPress: () => console.log('Gada Akses') }
          ],
          { cancelable: false }
        );
      }else{
        Alert.alert(
          "Info",
          "Success Update Data",
          [
            { text: "OK", onPress: () => showViolation() }
          ],
          { cancelable: false }
        );
      }
    })
    .catch(function(error){
      setLoading(true)
      // alert("Error Hubungi IT! (Submit " + type + " " + approve +"})")
      showViolation() 
      console.log(error)
    })
  }

  const imageContent = () => {
    const arrData = []
    if(data != null){
      if(data.image.length > 0){
        data.image.map((val, i) => {
          if(val.base64_full != null){
            arrData.push(
              <View key={i} style={{alignItems: 'center', justifyContent: 'center', height: 300, flex: 1, borderWidth: 0.5, marginTop: 25}}>
                <Image source={{uri: val.base64_full}} style={{width: 270, height: 270, resizeMode: 'contain'}} />
              </View>
            )
          }
        })
      }
    }
    return arrData
  }

  const showViolation = async() => {
    setLoading(false)
    const isLogin = await AsyncStorage.getItem('key')
    const user_id = await AsyncStorage.getItem('id')
		setToken(isLogin)
		setUserId(user_id)
    const headers = {
      'Authorization': `${isLogin}`, 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '__profilin=p%3Dt'
    }
    const params = {
      'id': val.id,
      'sys_plant_id': val.sys_plant_id,
      'tbl': tbl_name,
      'app_version': app_version,
      'user_id': user_id
    }
		Axios.get(`${base_url}/api/v2/hrd_show`, {params: params, headers: headers})
		.then(response => {
			setData(response.data.data)
			setLoading(true)
		})
		.catch(error => {
      console.log(error)
			setLoading(true)
		})
  }

  const onRefresh = () => {
    setRefreshing(false)
    showViolation()
  }

  const functionButton = () => {
    if(loading == true){
      if(data != null){
        if(data.approve_1_by == null && data.approve_2_by == null && data.approve_3_by == null){
          return (
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
            <Button style={{paddingHorizontal: 3, backgroundColor: '#d35400', borderRadius: 10}} onPress={() => submit('1', 'Approve')}>
              <Text>Approve 1</Text>
              <Image source={approved_biru} style={{width: 35, height: 35}} /> 
            </Button>
          </View>
          )
        }else if(data.approve_1_by != null && data.approve_2_by == null && data.approve_3_by == null){
          return (
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
            <Button style={{paddingHorizontal: 3, backgroundColor: '#d35400', borderRadius: 10}} onPress={() => submit('1', 'Cancel')}>
              <Text>Cancel 1</Text>
              <Image source={Xdua} style={{width: 30, height: 30}} />
            </Button>
            <Button style={{paddingHorizontal: 3, backgroundColor: '#d35400', borderRadius: 10}} onPress={() => submit('2', 'Approve')}>
              <Text>Approve 2</Text>
              <Image source={approved_biru} style={{width: 35, height: 35}} /> 
            </Button>
          </View>
          )
        }else if(data.approve_1_by != null && data.approve_2_by != null && data.approve_3_by == null){
          return (
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
            <Button style={{paddingHorizontal: 3, backgroundColor: '#d35400', borderRadius: 10}} onPress={() => submit('2', 'Cancel')}>
              <Text>Cancel 2</Text>
              <Image source={Xdua} style={{width: 30, height: 30}} />
            </Button>
            <Button style={{paddingHorizontal: 3, backgroundColor: '#d35400', borderRadius: 10}} onPress={() => submit('3', 'Approve')}>
              <Text>Approve 3</Text>
              <Image source={approved_biru} style={{width: 35, height: 35}} /> 
            </Button>
          </View>
          )
        }else{
          return (
            <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
              <Button style={{paddingHorizontal: 3, backgroundColor: '#d35400', borderRadius: 10}} onPress={() => submit('3', 'Cancel')}>
                <Text>Cancel 3</Text>
                <Image source={Xdua} style={{width: 35, height: 35}} /> 
              </Button>
            </View>
          )
        }
      }
    }
  }

  const approveFunc = () => {
    if(loading == true){
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start'}}>
          {
            data != null ?
            data.approve_1_by != null ? 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={approved_biru} style={{width: 30, height: 30}} /> 
            </View> : 
            null :
            null
          } 
          {
            data != null ?
            data.approve_2_by != null ? 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={approved_biru} style={{width: 30, height: 30}} /> 
            </View> : 
            null : 
            null
          } 
          {
            data != null ?
            data.approve_3_by != null ? 
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={approved_biru} style={{width: 30, height: 30}} /> 
            </View> : 
            null :
            null
          }     
        </View>
      )
    }
  }

  const content = () => {
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        <View style={{borderBottomWidth: 0.5}}>
          <View style={{height: 40, justifyContent: 'center', paddingLeft: 10}}>
            <Text>Pelapor :</Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingTop: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.enforcer_name != null ? data.enforcer_name : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.enforcer_nik != null ? data.enforcer_nik : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 5, justifyContent: 'flex-end'}}>
            <View style={{flexDirection: 'row', width: '70%', justifyContent: 'flex-end'}}>
              <View style={{paddingRight: 5, borderWidth: 0.5, borderRadius: 5, width: '68%', height: 40, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#b8b8b8'}}>
                <Text>{data != null ? data.violation_date != null ? data.violation_date : '-' : '-'}</Text>
              </View>
              <View style={{marginLeft: 5, paddingRight: 5, borderWidth: 0.5, borderRadius: 5, width: "25%", marginRight: 10, height: 40, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#b8b8b8'}}>
                <Text>{data != null ? data.violation_time != null ? data.violation_time : '-' : '-'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{borderBottomWidth: 0.5}}>
          <View style={{height: 40, justifyContent: 'center', paddingLeft: 10}}>
            <Text>Saksi :</Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingTop: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.whitness_name != null ? data.whitness_name : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.whitness_nik != null ? data.whitness_nik : '-' : '-'}</Text>
            </View>
          </View>
        </View>

        <View style={{borderBottomWidth: 0.5}}>
          <View style={{height: 40, justifyContent: 'center', paddingLeft: 10}}>
            <Text>Pelanggar :</Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingTop: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.violator_name != null ? data.violator_name : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.violator_nik != null ? data.violator_nik : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{height: 40, justifyContent: 'center', paddingLeft: 10}}>
            <Text>Deskripsi :</Text>
          </View>
      
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, borderWidth: 0.5, borderRadius: 5, width: '70%', height: 80, justifyContent: 'center', backgroundColor: '#b8b8b8'}}>
              <Text>{data != null ? data.description != null ? data.description : '-' : '-'}</Text>
            </View>
          </View>

        </View>
                
        <View style={{borderBottomWidth: 0.5}}>
          <View style={{height: 40, justifyContent: 'center', paddingLeft: 10}}>
            <Text>Hukuman 1 :</Text>
          </View>
      
          <View style={{paddingHorizontal: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.penalty_first_name ? data.penalty_first_name : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 80, justifyContent: 'center'}}>
              <Text>{data != null ? data.penalty_description ? data.penalty_description : '-' : '-'}</Text>
            </View>
          </View>
        </View>
                
        <View style={{borderBottomWidth: 0.5}}>
          <View style={{height: 40, justifyContent: 'center', paddingLeft: 10}}>
            <Text>Hukuman 2 :</Text>
          </View>
      
          <View style={{paddingHorizontal: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 40, justifyContent: 'center'}}>
              <Text>{data != null ? data.penalty_second_name ? data.penalty_second_name : '-' : '-'}</Text>
            </View>
          </View>
          <View style={{padding: 10, flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
            <View style={{marginLeft: 15, paddingLeft: 5, backgroundColor: '#b8b8b8', borderWidth: 0.5, borderRadius: 5, width: '70%', height: 80, justifyContent: 'center'}}>
              <Text>{data != null ? data.penalty_description_second ? data.penalty_description_second : '-' : '-'}</Text>
            </View>
          </View>
        </View>
        
        {imageContent()}
        {/* {functionButton()} */}
      </ScrollView>
    )
  }

  return (
    <Container>
      <View style={{height: 50, flexDirection: 'row', alignItems: 'center', backgroundColor: '#d35400'}}>
        <View style={{borderBottomWidth: 1, height: "100%", justifyContent: 'center', borderColor: '#FEA82F', alignItems: 'center', flex: 1, flexDirection: 'column'}}>
            <Text style={{color: 'white'}}>Approve Violation Form</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', flex: 1, backgroundColor: '#DDDDDD', justifyContent: 'center', alignItems: 'center'}}>
        {loading == false ? <View style={{backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#0000ff"/></View> : content() }
      </View>
      <View style={{flexDirection: 'column', height: 90, alignItems: 'center', backgroundColor: '#DDDDDD'}}>
        {approveFunc()}
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {functionButton()}
        </View>
      </View>
    </Container>
  ) 
}

export default Show