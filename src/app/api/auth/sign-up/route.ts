import { NextRequest,NextResponse } from "next/server";
import prisma from "../../../../helper/prisma"
import bcrypt from "bcryptjs";
import {z} from "zod"
import { userSchema } from "@/zod/AuthSchema";
import { sendVerificationEmail } from "@/helper/Resend";


export async function POST(req:NextRequest){
    const {name,email,password}:{name:string,email:string,password:string} = await req.json()
    try {
        const checkUserExists = await prisma.masterUser.findFirst({
            where:{
                username:name
            }
        })

        const hashedPassword = await bcrypt.hash(password,10)

        if(checkUserExists){
            return NextResponse.json({
                success:false,
                message:"User already exists"
            },{status:400})
        }

        const checkSchema = userSchema.safeParse({
            name:name,
            email:email,
            password:password
        })

        if(!checkSchema.success){
            return NextResponse.json({
                success:false,
                message:"User Schema not Validated"
            },{status:400})
        }

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        const sendEmail = await sendVerificationEmail(email,name,verifyCode)

        const createUser = await prisma.masterUser.create({
            data:{
                username:name,
                email:email,
                password:hashedPassword,
                verifyCode:verifyCode,
                isVerifyCodeExpiry:new Date(Date.now() + 3600000),
            }
        })

        return NextResponse.json({
            success:true,
            message:"User Created Successfully",
            value:createUser.id
        },{status:200})


        
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:`Internal Server Error  :::: ${error}`
        },{status:500})
    }
}