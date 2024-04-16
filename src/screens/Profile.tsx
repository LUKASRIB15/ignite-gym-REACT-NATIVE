import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { VStack, Text, Center, Skeleton, ScrollView, Heading, useToast } from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthContext } from "@hooks/Auth";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import ImageProfileWhenAvatarIsEmpty from "@assets/userPhotoDefault.png"

type FormDataProps = {
  name: string
  email: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

const formSchema = yup.object({
  name: yup.string().required("Informe seu nome"),
  newPassword: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").nullable().transform((value)=>Boolean(value) ? value : null),
  confirmNewPassword: yup
  .string()
  .nullable()
  .transform((value)=>Boolean(value) ? value : null)
  .oneOf([yup.ref("newPassword")], "As senhas precisam ser iguais")
  .when('newPassword', {
    is: (newPassword: any) => newPassword,
    then: ()=>yup.string().nullable().required("Confirme sua nova senha").transform((value)=>Boolean(value) ? value : null),
  })
  
})

export function Profile(){
  const toast = useToast()
  const {user, userUpdate} = useAuthContext()

  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [userPhoto, setUserPhoto] = useState("https://github.com/LUKASRIB15.png")
  const [isUpdating, setIsUpdating] = useState(false)

  const {control, handleSubmit, formState:{errors}} = useForm<FormDataProps>({
    defaultValues:{
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(formSchema)
  })

  async function handleUserPhotoSelect(){
    setIsLoadingImage(true)
    try{
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4,4],
        allowsEditing: true,
      })
  
      if(photoSelected.canceled){
        return
      }
  
      if(photoSelected.assets[0].uri){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        
        if(photoInfo.exists && photoInfo.size / 1024 / 1024 > 1){
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma imagem com menos de 1 MB",
            textAlign: "center",
            backgroundColor: "red.500",
            placement: "top",
            duration: 1000
          })
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop()
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLocaleLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const userResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = userResponse.data.avatar

        userUpdate(userUpdated)

        toast.show({
          title: "Foto atualizada!",
          placement: 'top',
          bgColor: 'green.700'
        })
      }

    }catch(error){
      console.log(error)
    } finally{
      setIsLoadingImage(false)
    }

  }

  async function handleUpdateProfile({name, oldPassword, newPassword}: FormDataProps){
    try{
      setIsUpdating(true)
      const userUpdated = user
      userUpdated.name = name

      await api.put('/users', {name, password: newPassword, oldPassword})

      await userUpdate(userUpdated)

      toast.show({
        title: "Perfil atualizado com sucesso!",
        placement: "top",
        bgColor: "green.700"
      })
    }catch(error){
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar os exercícios. Tente novamente mais tarde"
      
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil"/>
      <ScrollView>
        <Center
          mt={6}
          px={10}
        >
          {
            isLoadingImage ?
            <Skeleton 
            w={33}
            h={33}
            rounded={"full"}
            startColor={"gray.500"}
            endColor={"gray.400"}
          />
          :
          <UserPhoto 
            source={
              user.avatar ?
                {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
              :
                ImageProfileWhenAvatarIsEmpty
            }
            size={33}
            alt="Imagem de perfil do usuário"
          />
          }
          <TouchableOpacity
            onPress={handleUserPhotoSelect}
          >
            <Text
              color={"green.500"}
              fontWeight={"bold"}
              fontSize={"md"}
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            control={control} 
            name="name"
            render={({field})=>{
              return (
                <Input 
                  placeholder="Nome"
                  bg={"gray.600"}
                  value={field.value}
                  onChangeText={field.onChange}
                  errorMessage={errors.name?.message}
                />
              )

            }}
          />
          <Controller
            control={control} 
            name="email"
            render={({field})=>{
              return (
                <Input 
                  placeholder="E-mail"
                  bg={"gray.600"}
                  isDisabled
                  value={field.value}
                />
              )

            }}
          />
        </Center>
        <VStack
          px={10}
          mt={12}
          mb={9}
        >
          <Heading
            color={"gray.200"}
            fontSize={"md"}
            mb={2}
          >
            Alterar senha
          </Heading>
          <Controller
            control={control} 
            name="oldPassword"
            render={({field})=>{
              return (
                <Input 
                  bg={"gray.600"}
                  placeholder="Senha antiga"
                  secureTextEntry
                  onChangeText={field.onChange}
                />
              )

            }}
          />
          <Controller
            control={control} 
            name="newPassword"
            render={({field})=>{
              return (
                <Input 
                  bg={"gray.600"}
                  placeholder="Nova senha"
                  secureTextEntry
                  onChangeText={field.onChange}
                  errorMessage={errors.newPassword?.message}
                />
              )

            }}
          />
          
          <Controller
            control={control} 
            name="confirmNewPassword"
            render={({field})=>{
              return (
                <Input 
                  bg={"gray.600"}
                  placeholder="Confirmar nova senha"
                  secureTextEntry
                  onChangeText={field.onChange}
                  errorMessage={errors.confirmNewPassword?.message}
                />
              )

            }}
          />
          
          <Button 
            title="Atualizar"
            onPress={handleSubmit(handleUpdateProfile)}
            mt={4}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}