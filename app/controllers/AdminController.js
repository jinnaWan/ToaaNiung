import { mongooseConnect } from "@/lib/mongoose";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";

class AuthHandler {
  constructor(authOptions) {
    this.authOptions = authOptions;
    this.handler = NextAuth(authOptions);
  }

  async authorize(credentials) {
    const { email, password } = credentials;
    await mongooseConnect();
    try {
      const userModel = new User();
      const user = await userModel.getUserByEmail(email);

      if (!user) {
        return null;
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return null;
      }

      if (user.status === "Banned") {
        return null;
      }

      return user;
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }

  async jwt({ token, user, trigger, session }) {
    if (trigger === "update") {
      return { ...token, ...session.user };
    }
    if (user) {
      return {
        ...token,
        isAdmin: user.isAdmin,
        status: user.status,
      };
    }
    return token;
  }

  async session({ session, token }) {
    session.user = token;
    return {
      ...session,
      user: {
        ...session.user,
        isAdmin: token.isAdmin,
        status: token.status,
      },
    };
  }

  getHandler() {
    return this.handler;
  }
}

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: AuthHandler.authorize,
    }),
  ],
  callbacks: {
    jwt: AuthHandler.jwt,
    session: AuthHandler.session,
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const authHandler = new AuthHandler(authOptions);

export { authHandler as AuthHandler };
export default authHandler.getHandler();
