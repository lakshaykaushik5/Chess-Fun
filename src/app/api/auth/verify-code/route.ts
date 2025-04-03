import { NextRequest,NextResponse } from "next/server";
import prisma from "../../../../helper/prisma"


export async function POST(req:NextRequest){
    const {verifyCode,username}:{verifyCode:string,username:string} = await req.json()
    
    try {
        
        const findUser = await prisma.masterUser.findFirst({
            where:{
                username:username
            }
        })

        if(!findUser){
            return NextResponse.json({
                success:false,
                message:"User Not found"
            },{status:404})
        }

        if(findUser.verifyCode !== verifyCode){
            return NextResponse.json({
                success:false,
                message:"Invalid OTP"
            },{status:403})
        }

        const isCodeExpired = new Date(findUser.isVerifyCodeExpiry) > new Date()
        if(isCodeExpired){
            return NextResponse.json({
                success:false,
                message:"OTP Expired"
            },{status:403})
        }

        await prisma.masterUser.update({
            data:{
                isVerified:true
            },
            where:{
                id:findUser.id
            }
        })

        return NextResponse.json({
            success:true,
            message:"OTP Verified Successfully"
        },{status:200})
        

        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Internal Server Error  :::: ${error}`
        },{status:500})
    }
}