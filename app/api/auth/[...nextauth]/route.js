import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        await mongooseConnect();
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }
          console.log("User: ", user);
          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user, session}) {
      if (user) {
        return {
          ...token,
          isAdmin: user.isAdmin
        };
      }
      return token;
    },
    async session({session, token, user}) {
      // console.log({session, token, user})
      return {
        ...session,
        user: {
          ...session.user,
          isAdmin: token.isAdmin,
        }
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Set the sign-in page
    // You can define other pages here if needed, e.g., signOut, error, etc.
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };