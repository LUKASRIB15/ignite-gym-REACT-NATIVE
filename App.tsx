import { StatusBar, Text, View } from 'react-native';
import {useFonts, Roboto_400Regular, Roboto_700Bold} from "@expo-google-fonts/roboto"
import { NativeBaseProvider } from 'native-base';
import { Loading } from '@components/Loading';
import { THEME } from 'src/theme';
import { Routes } from '@routes/index';
import { Home } from '@screens/Home';
import { AuthContextProvider } from '@contexts/AuthContext';
import {NotificationClickEvent, NotificationWillDisplayEvent, OneSignal} from "react-native-onesignal"
import { useEffect } from 'react';

OneSignal.initialize("99d9d24a-f6eb-46b8-8e34-0ba6e7bbbd14")
OneSignal.Notifications.requestPermission(true)

export default function App() {
  const [fontsHasLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  useEffect(()=>{
    const handleNotificationReceived = (event: NotificationClickEvent):void =>{
      console.log("pelo click",event.result)
    }

    OneSignal.Notifications.addEventListener("click", handleNotificationReceived)

    return ()=>{
      OneSignal.Notifications.removeEventListener("click", handleNotificationReceived)
    }
  },[])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
        barStyle={"light-content"}
        backgroundColor={"transparent"}
        translucent
      />
      <AuthContextProvider>
        {fontsHasLoaded ? <Routes/> : <Loading/>}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}

