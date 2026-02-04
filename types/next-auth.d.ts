import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    startupId: string | null
    startupName?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      startupId: string | null
      startupName?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    startupId: string | null
    startupName?: string
  }
}
