import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import EmailProvider from "next-auth/providers/email"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Limit to 100 users
      const userCount = await prisma.user.count();
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string }
      });
      
      if (!existingUser && userCount >= 100) {
        return false; // Deny sign in for new users if limit reached
      }
      return true;
    },
    session: async ({ session, user }: { session: any, user: any }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.username = user.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
}
