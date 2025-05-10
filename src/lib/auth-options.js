import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

const mongoAdapter = MongoDBAdapter(clientPromise, {
  databaseName: 'eventify'
});

export const authOptions = {
  adapter: mongoAdapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection('users').findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return { 
            id: user._id.toString(), 
            email: user.email, 
            name: user.name,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile'
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user'
        };
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          try {
            const client = await clientPromise;
            const db = client.db();
            let existingUser = await db.collection('users').findOne({ email: user.email });
            
            if (!existingUser) {
              const newUser = {
                email: user.email,
                name: user.name,
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              const result = await db.collection('users').insertOne(newUser);
              existingUser = { ...newUser, _id: result.insertedId };
            }
            
            token.role = existingUser.role;
            token.id = existingUser._id.toString();
          } catch (error) {
            console.error('Error in Google OAuth callback:', error);
          }
        } else {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'default-secret-key',
  debug: process.env.NODE_ENV === 'development'
};
