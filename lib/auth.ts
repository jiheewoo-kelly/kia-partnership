import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요')
        }

        // Supabase에서 사용자 조회
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) {
          throw new Error('등록되지 않은 이메일입니다')
        }

        // 비밀번호 확인 (실제 프로덕션에서는 bcrypt 사용 권장)
        if (user.password !== credentials.password) {
          throw new Error('비밀번호가 일치하지 않습니다')
        }

        // 스타트업 정보 조회
        let startup = null
        if (user.role === 'STARTUP') {
          const { data: startupData } = await supabase
            .from('startups')
            .select('*')
            .eq('user_id', user.id)
            .single()
          startup = startupData
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          startupId: startup?.id || null,
          startupName: startup?.name || undefined
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.startupId = user.startupId
        token.startupName = user.startupName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.startupId = token.startupId as string | null
        session.user.startupName = token.startupName as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
}
