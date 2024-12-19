import { mongooseConnect } from "@/lib/mongoose";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Configuring the CredentialsProvider for email/password login
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Authorize function to validate user credentials
        const { email, password } = credentials;
        await mongooseConnect();
        try {
          const userModel = new User();
          const user = await userModel.getUserByEmail(email);

          if (!user) {
            return null;
          }
          // else {
          //   console.log("User: ", user);
          // }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          if (user.status === "Banned") {
            return null; // Return null to signify login failure if user is banned
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
    // Callbacks for JWT and session management
    async jwt({ token, user, trigger, session }) {
      // JWT callback to handle JWT token updates
      if (trigger === "update") {
        return { ...token, ...session.user }; // Update the JWT token based on session data
      }
      if (user) {
        return {
          ...token,
          isAdmin: user.isAdmin, // Adding isAdmin flag to the token
          status: user.status, // Adding status flag to the token
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Session callback to handle session data
      session.user = token;
      return {
        ...session,
        user: {
          ...session.user,
          isAdmin: token.isAdmin, // Adding isAdmin flag to the session user
          status: token.status, // Adding status flag to the session user
        },
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
