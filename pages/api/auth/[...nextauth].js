import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { findUserByEmail, insertUser } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { slugUsername } from '@/lib/user';

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const db = await getMongoDb();
      const { email, name } = user;
      const username = slugUsername(name);

      // Check if the user already exists
      const existingUser = await findUserByEmail(db, email);

      if (!existingUser) {
        // Create a new user if it doesn't exist
        await insertUser(db, {
          email,
          name,
          username,
          profilePicture: user.image || null,
        });
      }

      // Return true to complete the sign-in process
      return true;
    },
    async session({ session, token }) {
      // Attach the user ID to the session object
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      // On sign-in, add user details to the JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
});
