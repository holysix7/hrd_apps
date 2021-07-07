import {View, ScrollView, ActivityIndicator, Image, ImageBackground} from 'react-native'
import React, {useState, useEffect, useCallback } from 'react'
import { Container, Text, Button, Content} from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from "@react-native-community/async-storage"
import moment from 'moment'
import HeaderContent from '../Header/index'
import nopict from '../Assets/nopict.jpg'
import HRHQ from '../Assets/orange.jpg'

const Profile = ({route, navigation}) => {
  const {name, user, dept_name, user_image, app_version} = route.params
	var timeNow 	                    = moment()
  const [refreshing, setRefreshing] = useState(false);
  const [plant, setPlant]           = useState(0)
	const [loading, setLoading]       = useState(true);

	const buttLogout = async () => {
    try {
			AsyncStorage.getAllKeys()
			.then(keys => AsyncStorage.multiRemove(keys))
			.then(() => {
				navigation.replace('Login')
				alert("Successfully Logout!")
			})
    } catch (error) {
      console.log('Gagal Logout: ', error);
    }
	}

	const content = () => {
    return (
				<View style={{flexDirection: 'column', flex: 1, margin: 15}}>
					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12, justifyContent: 'center'}}>
						<View style={{alignItems: 'center', justifyContent: 'center', height: 127, width: 127, borderWidth: 0.5, borderRadius: 22}}>
							{
								user_image != null ?
								<TouchableOpacity><Image source={{uri: user_image}} style={{width: 125, height: 125, resizeMode: 'cover', borderWidth: 0.5, borderRadius: 25}} /></TouchableOpacity> :
								<TouchableOpacity><Image source={nopict} style={{width: 125, height: 125, resizeMode: 'cover', borderWidth: 0.5, borderRadius: 25}} /></TouchableOpacity>

							}
						</View>
					</View>

					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "31%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>Name</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>:</Text>
						</View>
						<View style={{width: "60%"}}>
							<TouchableOpacity>
								<Text style={{fontSize: 15, color: 'white'}}>{name != null ? name.slice(5, 150) : '-'}</Text>
							</TouchableOpacity>
						</View>
					</View>
					
					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "31%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>User</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>:</Text>
						</View>
						<View>
							<TouchableOpacity>
								<Text style={{fontSize: 15, color: 'white'}}>{user != null ? user : '-'}</Text>
							</TouchableOpacity>
						</View>
					</View>
					
					<View style={{paddingTop: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "31%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>NIK</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>:</Text>
						</View>
						<View>
							<TouchableOpacity>
								<Text style={{fontSize: 15, color: 'white'}}>{user != null ? user.slice(1, 10) : '-'}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row', paddingLeft: 12}}>
						<View style={{width: "31%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>Department Name</Text>
						</View>
						<View style={{width: "6%"}}>
							<Text style={{fontSize: 15, color: 'white'}}>:</Text>
						</View>
						<View style={{width: "50%"}}>
							<TouchableOpacity>
								<Text style={{fontSize: 15, color: 'white'}}>{dept_name != null ? dept_name : '-'}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{height: 100, paddingTop: 10, flexDirection: 'row', paddingLeft: 12, width: "100%", borderTopWidth: 1, borderTopColor: 'gray', justifyContent: 'center'}}>
						<Button style={{backgroundColor: 'red', borderRadius: 10, width: 150, justifyContent: 'center'}} onPress={() => buttLogout()}>
							<Text style={{fontSize: 15}}>Logout</Text>
						</Button>
					</View>
				</View>
    )
  }

  return (
    <Container>
      <View>
        <HeaderContent />
      </View>
      <ImageBackground source={HRHQ} style={{flex: 1, resizeMode: 'contain', justifyContent: 'flex-end', tintColor: 'cyan'}}>
				<View style={{flexDirection: 'row', flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
					<View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1}}>
						<ScrollView style={{flex: 1}}>
							{loading == false ? <View style={{backgroundColor: '#DDDDDD', alignItems: 'center', justifyContent: 'center', paddingTop: 100}}><ActivityIndicator size="large" color="#0000ff"/></View> : content() }
						</ScrollView>
						<Text style={{color: '#64656e'}}>{app_version}</Text>
					</View>
				</View>
				{/* <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} /> */}
			</ImageBackground>
			{/* {BottomNavigation()} */}
    </Container>
  ) 
}

export default Profile