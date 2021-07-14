import {View, ScrollView, ActivityIndicator, Image, Alert, RefreshControl} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Text, Button} from 'native-base'
import check from '../../../../Assets/check.png'

const ButtonAdd = ({navigation}, element) => {
  const arrData = []
  console.log('awokaowkoawk', element)
  if(element.props != null){
    if(element.props.create_access == true){
      arrData.push(
        <View key={1} style={{height: 70, backgroundColor: '#DDDDDD', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap'}}>
          <Button style={{flexDirection: 'column', backgroundColor: '#d35400', height: "75%", width: '80%', borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}} onPress={() => navigation.navigate('Add', {
            sys_plant_id: element.props.sys_plant_id,
            id: element.props.id,
            name: element.props.name,
            nik: element.props.user
          })} >
            <Text>Add Violation</Text>
          </Button>
        </View>
      )
    }
  }
  return arrData
}

export default ButtonAdd