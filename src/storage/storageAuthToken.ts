import { AuthTokenDTO } from "@dtos/authTokenDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE, } from "@storage/storageConfig";

export async function storageAuthToken({token, refreshToken}:AuthTokenDTO){
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({token, refreshToken}))
}