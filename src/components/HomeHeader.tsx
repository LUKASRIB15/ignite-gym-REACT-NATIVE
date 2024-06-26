import { HStack, Heading, Icon, Text, VStack } from "native-base";
import { UserPhoto } from "./UserPhoto";
import {MaterialIcons} from "@expo/vector-icons"
import { useAuthContext } from "@hooks/Auth";
import ImageProfileWhenAvatarIsEmpty from "@assets/userPhotoDefault.png"
import { TouchableOpacity } from "react-native";
import { api } from "@services/api";

export function HomeHeader(){
  const {user, signOut} = useAuthContext()

  return (
    <HStack
      bg={"gray.600"}
      pt={16}
      pb={5}
      px={8}
      alignItems={"center"}
    >
      <UserPhoto 
        source={
          user.avatar ?
            {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
          :
            ImageProfileWhenAvatarIsEmpty
        }
        size={16}
        alt="Imagem de perfil do usuário"
        mr={4}
      />

      <VStack flex={1}>
        <Text color={"gray.100"} fontSize={"md"}>Olá,</Text>
        <Heading color={"gray.100"} fontSize={"md"}>{user.name}</Heading>
      </VStack>
      
      <TouchableOpacity
        onPress={signOut}
      >
        <Icon 
          as={MaterialIcons}
          name="logout"
          color={"gray.200"}
          size={7}
        />
      </TouchableOpacity>
    </HStack>
  )
}