'use client'

import { LogIn } from "@/components/login-form"
import { ApiSchema } from "@/models/authSchema"
import axios from "axios"
export default function Page() {

  const onClick = async(payload:any)=>{
    alert("working Log In")
    const response = await axios.post<ApiSchema>("/api/sign-up",payload)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LogIn/>
      </div>
    </div>
  )
}
