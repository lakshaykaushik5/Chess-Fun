'use client'

import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Page() {

    const [verifyCode, setVerifyCode] = useState<string | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [linkDisable,setLinkDisable] = useState<boolean>(false)
    const params = useParams<{ userId: string }>()
    const router = useRouter()

    useEffect(() => {
        if (verifyCode?.length === 6) {
            setIsLoading(true)
            submitOtp()
        }
    }, [verifyCode])

    const resendOtp = async () => {
        setLinkDisable(true)
        try {
            const payload = {
                userId : params.userId
            }

            const response = await axios.post('/api/auth/resend-verify-code',payload)
            toast("Resending OTP")
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast(`Error :: ${error.response.data.message || error.message}`)
            } else {
                toast(`Error :: ${error}`)
            }
            throw new Error(`Error in Verify Code`)
        }finally{
            setLinkDisable(false)
        }
    }

    const submitOtp = async () => {
        try {
            const payload = {
                verifyCode: verifyCode,
                userId: params.userId
            }
            const response = await axios.post('/api/auth/verify-code', payload)
            toast("OTP Verified Successfully")
            router.push("/sign-in")

        } catch (error) {
            setVerifyCode("")
            if (axios.isAxiosError(error) && error.response) {
                toast(`Error :: ${error.response.data.message || error.message}`)
            } else {
                toast(`Error :: ${error}`)
            }
            throw new Error(`Error in Verify Code`)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            <div className={cn("flex flex-col gap-6 h-screen justify-center items-center")}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a href="#" className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">Acme Inc.</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to Fun Chess.</h1>
                        <div className="text-center text-xl font-semibold">
                            Verify OTP
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <InputOTP maxLength={6} onChange={(value: string) => { setVerifyCode(value) }}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <div className="text-center text-sm">
                        {!linkDisable ?(<a href="" className="underline underline-offset-4 text-slate-400">
                            Resend OTP
                        </a>):
                       ( <div className="underline underline-offset-4 text-slate-400">
                            Resend OTP
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    )
}