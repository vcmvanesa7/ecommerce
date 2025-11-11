import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import dbConnection from '@/lib/dbconnection';
import { User } from '@/db/models';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);

        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          console.log("Zod validation failed");
          return null;
        }

        const { email, password } = parsed.data;

        await dbConnection();
        const user = await User.findOne({ email });

        if (!user) {
          console.log("User not found");
          return null;
        }

        console.log("User found:", user.email);

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          console.log("Incorrect password");
          return null;
        }

        console.log("Authentication successful");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
});
