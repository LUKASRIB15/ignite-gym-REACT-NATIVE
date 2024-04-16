import { Box, Center, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base";
import {Feather} from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { exerciseDTO } from "@dtos/exerciseDTO";
import { Loading } from "@components/Loading";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

type RouteParams ={
  exerciseId: string
}

export function Exercise(){
  const [exercise, setExercise] = useState({} as exerciseDTO)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitingRegister, setIsSubmitingRegister] = useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const toast = useToast()

  const {exerciseId} = route.params as RouteParams

  function handleGoBack(){
    navigation.goBack()
  }

  async function handleExerciseHistoryRegister(){
    try {
      setIsSubmitingRegister(true)
      await api.post('/history', {exercise_id: exerciseId})

      toast.show({
        title: "Parabéns! Exercício registrado com sucesso",
        placement: "top",
        bgColor: "green.700"
      })

      navigation.navigate("history")

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível registrar o exercício como realizado. Tente novamente mais tarde"
      
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      })
    } finally{
      setIsSubmitingRegister(false)
    }
  }

  async function fetchExerciseDetails(){
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar detalhes do exercício. Tente novamente mais tarde"
      
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      })
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchExerciseDetails()
  },[exerciseId])

  return (
    <VStack flex={1}>
      <VStack
        px={8}
        bg={"gray.600"}
        pt={12}
      >
        <TouchableOpacity onPress={handleGoBack}>
          <Icon 
            as={Feather}
            name="arrow-left"
            color={"green.500"}
            size={6}
          />
        </TouchableOpacity>
        <HStack
          justifyContent={"space-between"}
          mt={4}
          mb={8}
          alignItems={"center"}
        >
          <Heading
            color={"gray.100"}
            fontSize={"lg"}
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack
            alignItems={"center"}
          >
            <BodySvg />
            <Text
              color={"gray.200"}
              ml={1}
              textTransform={"capitalize"}
            >
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
        {
          isLoading ?
            <Loading />
          :
            <VStack 
              p={8}
            >
              <Box
                rounded={"lg"}
                mb={6}
                overflow={"hidden"}
              >
                <Image 
                  source={{uri:`${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                  alt="Imagem de um exercício"
                  w={"full"}
                  h={80}
                  
                  resizeMode="cover"
                  
                />
              </Box>

              <Box
                bg={"gray.600"}
                rounded={"md"}
                pb={4}
                px={4}
              >
              <HStack
                alignItems={"center"}
                justifyContent={"space-around"}
                mb={6}
                mt={5}
              >
                <HStack>
                  <SeriesSvg />
                  <Text color={"gray.200"} ml={2}>3 séries</Text>
                </HStack>
                <HStack>
                  <RepetitionsSvg />
                  <Text color={"gray.200"} ml={2}>12 repetições</Text>
                </HStack>
              </HStack>
              <Button 
                title="Marcar como realizado"
                onPress={handleExerciseHistoryRegister}
                isLoading={isSubmitingRegister}
              />

              
            </Box>
          </VStack>
        }
      </ScrollView>
    </VStack>
  )
}