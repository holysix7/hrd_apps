import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {
	SplashScreen,
  BoardingScreen,
  Login,
  Get,
	// GetContent,
	Main,
	Show,
	Add,
	Profile
} from '../Pages'

const Stack = createStackNavigator();

const Routes = () => {  
  
  return(
		<Stack.Navigator initialRouteName="Home" screenOptions={({ route, navigation }) => ({
			gestureEnabled: true,
      headerShown: false,
			headerStatusBarHeight:
			navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 0 : undefined,
		})}>
			<Stack.Screen name="SplashScreen" component={SplashScreen} />
			<Stack.Screen name="BoardingScreen" component={BoardingScreen} />
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Get" component={Get} />
			<Stack.Screen name="Main" component={Main} />
			<Stack.Screen name="Show" component={Show} />
			<Stack.Screen name="Add" component={Add} />
			{/* <Stack.Screen name="GetContent" component={GetContent} /> */}
			<Stack.Screen name="Profile" component={Profile} />

    </Stack.Navigator>  
  )
}
export default Routes;