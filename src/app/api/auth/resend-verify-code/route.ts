import { sendVerificationEmail } from "@/helper/Resend";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../helper/prisma"


export async function POST(req:NextRequest){
    try {
        const {userId} = await req.json()
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const findUserByUserId = await prisma.masterUser.findFirst({
            where:{
                id:userId
            }
        })

        if(!findUserByUserId){
            return NextResponse.json({
                success:false,
                message:"User Not Found"
            },{status:404})
        }

        const sendEmail = await sendVerificationEmail(findUserByUserId.email,findUserByUserId.username,verifyCode)

        await prisma.masterUser.update({
            where:{
                id:userId
            },
            data:{
                verifyCode:verifyCode,
                isVerifyCodeExpiry:new Date(Date.now() + 3600000)
            }
        })

        return NextResponse.json({
            status:true,
            message:"OTP resend Successfully"
        },{status:200})

    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"Internal Server Error",
        },{status:500})
    }
}