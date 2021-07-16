import {View, ScrollView, ActivityIndicator, Image, Alert, RefreshControl} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Text, Button} from 'native-base'
import check from '../../../../Assets/check.png'

const GetContent = (element) => {
  const arrData = []
  if(element.props != null){
    if(element.props.code != 403){
      if(element.props.data_count > 0){
        var data = JSON.parse(element.props.data)
        data.map((val, key) => {
          var column_name = element.props.column_name
          column_name.map((valKey, keyKey) => {
            var keduaCuk = valKey.key
          })
          arrData.push(
            <View key={key} style={{flexDirection: 'row', flexWrap: 'nowrap', paddingHorizontal: 22}}>
              <Button style={{marginTop: 10, alignItems: 'center', width: 350, borderRadius: 10, backgroundColor: '#F7A440', flexDirection: 'row'}} onPress={() => {
                navigation.navigate('Show', val)
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
              <Text style={{color: 'white', fontSize: 13}}>{element.props.start_date} - {element.props.end_date} </Text>
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
            <Text style={{color: 'white', fontSize: 13}}>Silahkan Cari Data <Text style={{fontWeight: 'bold', color: 'white', fontSize: 13}}>{element != null ? element.form_name != null ? element.form_name : null : null}</Text> Berdasarkan Tanggal</Text>
          </View>
        </View>
      )
  }
  return arrData
}

export default GetContent