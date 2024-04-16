import { AuthContext } from "@contexts/AuthContext";
import { useContext } from "react";

export function useAuthContext(){
  const context = useContext(AuthContext)

  return context
}