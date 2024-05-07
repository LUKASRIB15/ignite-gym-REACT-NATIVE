import { OneSignal } from "react-native-onesignal";

export function tagUserEmailCreate(email:string, name:string){
  OneSignal.User.addTags({
    email,
    name
  })
}

export function tagUserEmailRemove(){
  OneSignal.User.removeTags(["email", "name"])
}