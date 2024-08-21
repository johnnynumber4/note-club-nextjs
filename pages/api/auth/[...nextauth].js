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
      const existingUser = await findUserByEmail(db, email);

      if (!existingUser) {
        await insertUser(db, {
          email,
          name,
          username,
          profilePicture: user.image || null,
        });
      }

      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.name;
      }
      return token;
    },
  },
});
