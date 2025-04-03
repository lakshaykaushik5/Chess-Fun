import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextRequest } from "next/server"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials.password || !credentials.email) {
          throw new Error("Missing email and password")
        }
        try {
          const checkUserExists = await prisma.masterUser.findFirst({
            where: {
              email: credentials.email
            }
          })

          if (!checkUserExists) {
            throw new Error("User not exists Sign Up to continue")
          }

          const isValid = await bcrypt.compare(credentials.password, checkUserExists.password)
          if (!isValid) {
            throw new Error("Invalid Password")
          }
          return {
            id: checkUserExists.id,
            email: checkUserExists.email
          }
        } catch (error) {
          console.log(`Auth Error ::::::: ${error}`)
          throw error
        }

      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter:PrismaAdapter(prisma),

}