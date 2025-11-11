import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import dbConnection from '@/lib/dbconnection';
import { User } from '@/db/models';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const handler = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.error('authorize() ejecutado con:', credentials); 

        try {
          await dbConnection();
          console.error(' Conectado a MongoDB');

          const parsed = z
            .object({
              email: z.string().email(),
              password: z.string().min(6),
            })
            .safeParse(credentials);

          if (!parsed.success) {
            console.error(' Formato inválido de credenciales:', credentials);
            return null;
          }

          const { email, password } = parsed.data;
          console.error(' Buscando usuario:', email);
          const user = await User.findOne({ email });

          if (!user) {
            console.error('Usuario no encontrado');
            return null;
          }

          console.error(' Usuario encontrado:', user.email);
          console.error(' Hash en DB:', user.password);

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            console.error('Contraseña incorrecta');
            return null;
          }

          console.error('Autenticación exitosa');
          return { id: user._id.toString(), email: user.email, name: user.name };
        } catch (err) {
          console.error(' Error en authorize():', err);
          return null;
        }
      },
    }),
  ],
});

export { handler as GET, handler as POST };
