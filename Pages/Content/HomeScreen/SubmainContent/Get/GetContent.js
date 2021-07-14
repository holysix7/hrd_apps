import {View, ScrollView, ActivityIndicator, Image, Alert, RefreshControl} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Text, Button} from 'native-base'
import check from '../../../../Assets/check.png'

const GetContent = (element) => {
  const arrData = []
  if(element.props != null){
    if(element.props.code != null){
      if(element.props.data_count > 0){
        var data = JSON.parse(element.props.data)
        data.map((val, key) => {
          var column_name = element.props.column_name
          column_name.map((valKey, keyKey) => {
            var keduaCuk = valKey.key
            // console.log(keduaCuk)
            // console.log(keduaCuk, ': ', val[`${keduaCuk}`])
          })
          console.log(val)
          arrData.push(
            <View key={key} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Button style={{marginTop: 10, alignItems: 'center', width: 350, borderRadius: 10, backgroundColor: '#F7A440', flexDirection: 'row'}} onPress={() => {
                navigation.navigate('Show', val)
              }}>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
                  <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_a}</Text>
                  <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_c}</Text>
                </View>
                {val.list_col_d != null ? 
                  <View style={{backgroundColor: 'red', width: '50%', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_b}</Text>
                    <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_d}</Text>
                  </View> : 
                  <View style={{width: '50%', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 11, color: 'black'}}>{val.list_col_b}</Text>
                  </View>
                  }
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
              <Text style={{color: 'white', fontSize: 13}}>{element.props.start_date} - {element.props.end_date} </Text>
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

export default GetContent