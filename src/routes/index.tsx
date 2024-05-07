import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { Box, useTheme } from "native-base";
import {  useEffect, useState } from "react";
import { useAuthContext } from "@hooks/Auth";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";
import { NotificationWillDisplayEvent, OSNotification, OneSignal } from "react-native-onesignal";
import { Notification } from "@components/Notification";

const linking = {
  prefixes: [
    "com.rocketseat.ignitegym://",
    "ignitegym://",
    "exp+ignite-gym://"
  ],
  config: {
    screens: {
      exercise: {
        path: "exercise/:exerciseId",
        parse: {
          exerciseId: (exerciseId: string) => exerciseId
        }
      }
    }
  }
}

export function Routes(){
  const [notification, setNotification] = useState<OSNotification>()
  const {user, isLoadingStorageData} = useAuthContext()
  const {colors} = useTheme()

  const userExists = Boolean(user.id) 
  
  
  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  if(isLoadingStorageData){
    return <Loading/>
  }

  useEffect(()=>{
    const handleNotificationReceived = (event: NotificationWillDisplayEvent):void=>{
      event.preventDefault()
      const response = event.getNotification()
      setNotification(response)
    }

    OneSignal.Notifications.addEventListener("foregroundWillDisplay", handleNotificationReceived)

    return ()=>{
      OneSignal.Notifications.removeEventListener("foregroundWillDisplay", handleNotificationReceived)
    }
  },[])

  return (
    <Box flex={1} color={"gray.700"}>
      <NavigationContainer theme={theme} linking={linking}>
      {userExists? <AppRoutes/>:<AuthRoutes/>}
      {
        notification &&
        <Notification 
          data={notification}
          onClose={() => setNotification(undefined)}
        />
      }
      </NavigationContainer>
    </Box>
  )
}