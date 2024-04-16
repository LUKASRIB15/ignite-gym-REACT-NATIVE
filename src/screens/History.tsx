import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { historyByDayDTO } from "@dtos/historyByDayDTO";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Heading, SectionList, Text, VStack, useToast } from "native-base";
import { useCallback, useState } from "react";

export function History(){
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [historyOfExercises, setHistoryOfExercises] = useState<historyByDayDTO[]>([])

  async function fetchHistoryOfExercises(){
    try {
      setIsLoading(true)
      const response = await api.get('/history')
      setHistoryOfExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar o histórico de exercícios. Tente novamente mais tarde"
      
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(()=>{
    fetchHistoryOfExercises()
  }, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />
      {
        isLoading ? 
          <Loading />
        :
          <SectionList 
            sections={historyOfExercises}
            keyExtractor={item=>item.id}
            renderItem={({item})=>(
              <HistoryCard data={item}/>
            )}
            renderSectionHeader={({section})=>(
              <Heading 
                color={"gray.100"}
                fontSize={"md"}
                mt={10}
                mb={3}
              >
                {section.title}
              </Heading>
            )}
            ListEmptyComponent={()=>(
              <Text 
                color={"gray.100"}
                textAlign={"center"}
              >
                Não há exercícios registrados ainda. {'\n'}
                Vamos fazer exercício hoje?
              </Text>
            )}
            contentContainerStyle={historyOfExercises.length === 0 && {flex: 1, justifyContent: "center"}}
            px={8}
          />
      }
    </VStack>
  )
}