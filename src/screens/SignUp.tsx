import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";


import LogoSvg from "@assets/logo.svg"
import BackgroundImg from "@assets/background.png"
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import {useForm, Controller} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuthContext } from "@hooks/Auth";

type FormDataProps = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const formDataSchema = yup.object({
  name: yup.string().required("Informe seu nome"),
  email: yup.string().required("Informe seu email").email("Email inválido"),
  password: yup.string().required("Informe sua senha").min(5, "O mínimo de caracteres é 5"),
  passwordConfirm: yup.string().required("Confirme sua senha").oneOf([yup.ref("password")], "As senhas precisam ser iguais")
})

export function SignUp(){
  const {control, handleSubmit, reset ,formState: {errors}} = useForm<FormDataProps>({
    resolver: yupResolver(formDataSchema)
  })
  const navigation = useNavigation()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {signIn} = useAuthContext()

  function handleGoSignInScreen(){
    navigation.goBack()
  }

  async function handleSignUp({name, email, password}:FormDataProps){
    try{
      setIsLoading(true)
      await api.post("/users", {email, name, password})
      signIn(email, password)
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível criar a conta. Tente novamente mais tarde"

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      })

    }finally{
      setIsLoading(false)
    }
    
    
    // const response = await fetch("http://192.168.18.8:3333/users", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Accept": "application/json"
    //   },
    //   body: JSON.stringify({name, email, password})
    // })

    // const data = await response.json()

    // console.log(data)

    reset()
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg/>
          <Text color={"gray.100"} fontSize={"sm"}>
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color={"gray.100"} fontSize={"xl"} mb={6} fontFamily={"heading"}>
            Crie sua conta
          </Heading>
          <Controller 
            control={control}
            name="name"
            // rules={{
            //   required: "Informe seu nome"
            // }}
            render={({field})=>(
              <Input 
                placeholder="Nome"
                value={field.value}
                onChangeText={field.onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller 
            control={control}
            name="email"
            // rules={{
            //   required: "Informe seu e-mail",
            //   pattern:{
            //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            //     message: "E-mail inválido"
            //   }
            // }}
            render={({field})=>(
              <Input 
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={field.value}
                onChangeText={field.onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller 
            control={control}
            name="password"
            render={({field})=>(
              <Input 
                placeholder="Senha"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller 
            control={control}
            name="passwordConfirm"
            render={({field})=>(
              <Input 
                placeholder="Confirmar a senha"
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                errorMessage={errors.passwordConfirm?.message}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
              />
            )}
          />
          <Button 
            title="Criar e acessar" 
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}  
          />
        </Center>

        <Center mt={16}>
          <Button 
            onPress={handleGoSignInScreen} 
            title="Voltar para o login" 
            variant={"outline"}
          />
        </Center>
        
        
      </VStack>
    </ScrollView>
  )
}