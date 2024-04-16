import { Center, Heading } from "native-base";

type ScreenHeaderProps = {
  title: string
}

export function ScreenHeader({title}:ScreenHeaderProps){
  return (
    <Center
      bg={"gray.600"}
      pt={16}
      pb={6}
    >
      <Heading
        color={"gray.100"}
        fontSize={"xl"}
      >
        {title}
      </Heading>
    </Center>
  )
}