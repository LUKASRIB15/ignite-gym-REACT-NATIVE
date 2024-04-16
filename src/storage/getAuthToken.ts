import AsyncStorage from "@react-native-async-storage/async-storage"
import { AUTH_TOKEN_STORAGE } from "./storageConfig"
import { AuthTokenDTO } from "@dtos/authTokenDTO"

export async function getAuthToken(){
  const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)

  const {token, refreshToken}: AuthTokenDTO = response ? JSON.parse(response) : {}

  return {token, refreshToken}
}