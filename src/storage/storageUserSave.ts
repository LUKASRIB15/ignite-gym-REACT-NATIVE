import { userDTO } from "@dtos/userDTO";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE } from "./storageConfig";

export async function storageUserSave(user:userDTO){
  try{
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
  }catch(error){
    throw error
  }
}