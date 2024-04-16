import AsyncStorage from "@react-native-async-storage/async-storage"
import { USER_STORAGE } from "./storageConfig"
import { userDTO } from "@dtos/userDTO"

export async function getUserStoraged(){
  try{
    const storage = await AsyncStorage.getItem(USER_STORAGE)
    const user: userDTO = storage ? JSON.parse(storage) : {} 

    return user
  }catch(error){
    throw error
  }
}