import {NativeStackNavigationProp, createNativeStackNavigator} from "@react-navigation/native-stack"
import { SignIn } from "@screens/SignIn"
import { SignUp } from "@screens/SignUp"

type AuthRoutesProps = {
  signIn: undefined
  signUp: undefined
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutesProps>

const Stack = createNativeStackNavigator<AuthRoutesProps>()

export function AuthRoutes(){
  return(
    <Stack.Navigator screenOptions={{headerShown: false, animation: "none"}}>
      <Stack.Screen name="signIn" component={SignIn}/>
      <Stack.Screen name="signUp" component={SignUp}/>
    </Stack.Navigator>
  )
}