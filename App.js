import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { LogBox } from 'react-native';

// local imports
import DefaultScreen from "./components/OverviewScreen";
import StationInformation from "./components/StationInformation";
const Stack = createNativeStackNavigator()

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);


export default function App() {
    return (
        <>
            <StatusBar barStyle='light-content'/>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="DefaultScreen"
                        component={DefaultScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen
                        name="StationInformation"
                        component={StationInformation}
                        options={{headerShown: false}}
                    />
                    {/*<Stack.Screen*/}
                    {/*    name="HostScreen"*/}
                    {/*    component={HostScreen}*/}
                    {/*    options={{headerShown: false}}*/}
                    {/*/>*/}
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}
