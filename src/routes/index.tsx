import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AuthRoutes } from "./auth.routes";
import { Box, useTheme } from "native-base";
import {  useEffect } from "react";
import { useAuthContext } from "@hooks/Auth";
import { AppRoutes } from "./app.routes";
import { Loading } from "@components/Loading";

export function Routes(){
  const {user, isLoadingStorageData} = useAuthContext()
  const {colors} = useTheme()

  const userExists = Boolean(user.id) 
  
  
  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  if(isLoadingStorageData){
    return <Loading/>
  }

  return (
    <Box flex={1} color={"gray.700"}>
      <NavigationContainer theme={theme}>
      {userExists? <AppRoutes/>:<AuthRoutes/>}
      </NavigationContainer>
    </Box>
  )
}