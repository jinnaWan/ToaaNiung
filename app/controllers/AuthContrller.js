import { mongooseConnect } from "@/lib/mongoose";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
//Factory Method Pattern with solid
class AuthHandler {
  constructor(authOptions) {
    this.authOptions = authOptions;
    this.handler = NextAuth(this.authOptions);
  }

  async authorizeUser(credentials) {
    const { email, password } = credentials;
    await mongooseConnect();

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch || user.status === "Banned") {
        return null;
      }

      return user;
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }

  async handleJWT({ token, user, trigger, session }) {
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

  async handleSession({ session, token }) {
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

class AuthHandlerFactory {
  static createAdminAuthHandler() {
    const authOptions = {
      providers: [
        CredentialsProvider({
          id: "credentials",
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            return this.authorizeUser(credentials);
          },
        }),
      ],
      callbacks: {
        jwt: this.handleJWT,
        session: this.handleSession,
      },
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: "/admin/login",
      },
    };

    return new AuthHandler(authOptions);
  }

  static createUserAuthHandler() {
    const authOptions = {
      providers: [
        CredentialsProvider({
          id: "credentials",
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            return this.authorizeUser(credentials);
          },
        }),
      ],
      callbacks: {
        jwt: this.handleJWT,
        session: this.handleSession,
      },
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: "/login",
      },
    };

    return new AuthHandler(authOptions);
  }
}

const adminAuthHandler = AuthHandlerFactory.createAdminAuthHandler();
const userAuthHandler = AuthHandlerFactory.createUserAuthHandler();

export { adminAuthHandler, userAuthHandler };

/*import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
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
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

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

//////////////////////////////////////////////////////////////////////////////////////////////
export default handler;*/
/* Factory Method Pattern

import { mongooseConnect } from "@/lib/mongoose";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";

class AuthHandler {
  constructor(authOptions) {
    this.authOptions = authOptions;
    this.handler = NextAuth(this.authOptions);
  }

  async authorizeUser(credentials) {
    const { email, password } = credentials;
    await mongooseConnect();

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch || user.status === "Banned") {
        return null;
      }

      return user;
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  }

  async handleJWT({ token, user, trigger, session }) {
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

  async handleSession({ session, token }) {
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

class AuthHandlerFactory {
  static createAdminAuthHandler() {
    const authOptions = {
      providers: [
        CredentialsProvider({
          id: "credentials",
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            return this.authorizeUser(credentials);
          },
        }),
      ],
      callbacks: {
        jwt: this.handleJWT,
        session: this.handleSession,
      },
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: "/admin/login",
      },
    };

    return new AuthHandler(authOptions);
  }

  static createUserAuthHandler() {
    const authOptions = {
      providers: [
        CredentialsProvider({
          id: "credentials",
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            return this.authorizeUser(credentials);
          },
        }),
      ],
      callbacks: {
        jwt: this.handleJWT,
        session: this.handleSession,
      },
      session: {
        strategy: "jwt",
      },
      secret: process.env.NEXTAUTH_SECRET,
      pages: {
        signIn: "/login",
      },
    };

    return new AuthHandler(authOptions);
  }
}

const adminAuthHandler = AuthHandlerFactory.createAdminAuthHandler();
const userAuthHandler = AuthHandlerFactory.createUserAuthHandler();

export { adminAuthHandler, userAuthHandler };
*/
/*In this refactored version, we have introduced the Factory Method pattern to create instances of the AuthHandler class with different configurations. Here's how it works:

The AuthHandler class remains mostly the same, except that it now takes an authOptions object in its constructor.
We have introduced a new class called AuthHandlerFactory which acts as the factory for creating instances of the AuthHandler class.
The AuthHandlerFactory class has two static methods: createAdminAuthHandler and createUserAuthHandler.
The createAdminAuthHandler method creates an instance of the AuthHandler class with a configuration specific to the admin authentication flow. It sets the sign-in page to /admin/login.
The createUserAuthHandler method creates an instance of the AuthHandler class with a configuration specific to the user authentication flow. It sets the sign-in page to /login.
At the end of the file, we create instances of the AuthHandler class using the factory methods: adminAuthHandler and userAuthHandler.
These instances can then be exported and used in different parts of the application, depending on whether admin or user authentication is required.

By using the Factory Method pattern, we have decoupled the process of creating instances of the AuthHandler class from the class itself. This makes it easier to create instances with different configurations without modifying the AuthHandler class. Additionally, it follows the Open/Closed principle by allowing the introduction of new configurations (e.g., for different user roles or authentication flows) without modifying the existing code.
You can extend this approach further by introducing other creational design patterns like the Abstract Factory pattern or the Builder pattern, depending on your specific requirements and the complexity of the authentication configurations.
*/