import { AuthTokenDTO } from "@dtos/authTokenDTO";
import { userDTO } from "@dtos/userDTO";
import { api } from "@services/api";
import { getAuthToken } from "@storage/getAuthToken";
import { getUserStoraged } from "@storage/getUserStoraged";
import { removeAuthToken } from "@storage/removeAuthToken";
import { removeUserStoraged } from "@storage/removeUserStoraged";
import { storageAuthToken } from "@storage/storageAuthToken";
import { storageUserSave } from "@storage/storageUserSave";
import { ReactNode, createContext, useEffect, useState } from "react";

type AuthContextDataProps = {
  user: userDTO
  signIn: (email:string, password:string) => Promise<void>
  signOut: ()=>Promise<void>
  userUpdate: (user:userDTO) => Promise<void>
  isLoadingStorageData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({children}:{children: ReactNode}){
  const [user, setUser] = useState<userDTO>({} as userDTO)
  const [isLoadingStorageData, setIsLoadingStorageData] = useState(false)

  async function storageUserAndToken(userData: userDTO, token:string){
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
  }

  async function signIn(email:string, password:string){
    try{
      const {data} = await api.post('/sessions', {email, password})

      if(data.user && data.token && data.refresh_token){
        const authTokens: AuthTokenDTO = {
          token: data.token,
          refreshToken: data.refresh_token 
        }

        await storageUserSave(data.user)
        await storageAuthToken(authTokens)
        storageUserAndToken(data.user, data.token)
      }
    }catch(error){
      throw error
    }
  }

  async function signOut(){
    try{
      setIsLoadingStorageData(true)
      setUser({} as userDTO)
      await removeUserStoraged()
      await removeAuthToken()
    }catch(error){
      throw error
    }finally{
      setIsLoadingStorageData(false)
    }
  }

  async function userUpdate(user: userDTO){
    try {
      setUser(user)
      await storageUserSave(user)     
    } catch (error) {
      throw error
    }
  }

  async function loadUserStoraged(){
    try{
      setIsLoadingStorageData(true)
      const userLogged = await getUserStoraged()
      const {token} = await getAuthToken()

      if(userLogged && token){
        storageUserAndToken(userLogged, token)
      }
    }catch(error){
      throw error
    }finally{
      setIsLoadingStorageData(false)
    }
  }

  useEffect(()=>{
    loadUserStoraged()
  },[])

  useEffect(()=>{
    const subscribe = api.registerInterceptTokenManager(signOut)

    return ()=>{
      subscribe()
    }
  },[])


  return (
    <AuthContext.Provider value={{user, signIn, signOut, userUpdate ,isLoadingStorageData}}>
      {children}
    </AuthContext.Provider>
  )
}