import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";


import LogoSvg from "@assets/logo.svg"
import BackgroundImg from "@assets/background.png"
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuthContext } from "@hooks/Auth";
import { useForm, Controller } from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormDataProps = {
  email: string
  password: string
}

const formDataSchema = yup.object({
  email: yup.string().required("Informe seu email").email("Email inválido"),
  password: yup.string().required("Informe sua senha").min(5,"O mínimo de caracteres é 5")
})

export function SignIn(){
  const {handleSubmit, control, formState:{errors}} = useForm<FormDataProps>({
    resolver: yupResolver(formDataSchema)
  })
  const [isLoading, setIsLoading] = useState(false)
  const {signIn} = useAuthContext()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const toast = useToast()

  function handleGoSignUpScreen(){
    navigation.navigate("signUp")
  }

  async function handleSignIn({email, password}: FormDataProps){
    try{
      setIsLoading(true)
      await signIn(email, password)
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível fazer o login. Tente novamente mais tarde"
      
      toast.show({
        title,
        placement: "top",
        backgroundColor: "red.500"
      })
    }finally{
      setIsLoading(false)
    }
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
            Acesse sua conta
          </Heading>
          <Controller 
            control={control}
            name="email"
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
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType="send"
                errorMessage={errors.password?.message}
              />
            )}
          />
          
          <Button 
            title="Acessar" 
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text
            color={"gray.100"}
            fontSize={"sm"}
            mb={3}
            fontFamily={"body"}
          >
            Ainda não tem acesso?
          </Text>
          <Button 
            onPress={handleGoSignUpScreen} 
            title="Criar conta" 
            variant={"outline"}
          />
        </Center>
        
        
      </VStack>
    </ScrollView>
  )
}