
import {View, ScrollView, ActivityIndicator, Image, TouchableOpacity, ImageBackground, Alert} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button} from 'native-base'
import checked_image from '../../../Assets/check.png'

const contentToDo = (element) => {
  const arrData = []
  if(element != null){
    if(element.props.length > 0){
      element.props.map((el, key) => {
        arrData.push(
          <View key={key} style={{flexDirection: 'row', borderBottomWidth: 0.8, paddingVertical: 5}}>
            <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              { el.job_checked == true ? <Image source={checked_image} style={{width: 20, height: 20}} /> : <Text>*</Text>}
            </View>
            <View style={{paddingLeft: 10, flexDirection: 'column'}}>
              <Text style={{fontSize: 13, color: 'black', paddingTop: 8, textAlign: 'justify', paddingRight: 15}}>{el.job_name} : {el.job_description}</Text>
            </View>
          </View>
        )
      })
    }
  }
  return arrData
} 

export default contentToDo