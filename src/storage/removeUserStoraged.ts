import AsyncStorage from "@react-native-async-storage/async-storage"
import { USER_STORAGE } from "./storageConfig"

export async function removeUserStoraged(){
  try{
    await AsyncStorage.removeItem(USER_STORAGE)
  }catch(error){
    throw error
  }
}