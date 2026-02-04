import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: startups, error } = await supabase
      .from('startups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
    }

    return NextResponse.json(startups)
  } catch (error) {
    console.error('Failed to fetch startups:', error)
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, contact_name, contact_email, website, user_email, user_password, user_name } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Create user first if credentials provided
    let userId = null
    if (user_email && user_password) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: user_email,
          password: user_password,
          name: user_name || name,
          role: 'STARTUP',
        })
        .select()
        .single()

      if (userError) {
        console.error('User creation error:', userError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      userId = user.id
    }

    const { data: startup, error } = await supabase
      .from('startups')
      .insert({
        name,
        description: description || null,
        category: category || null,
        contact_name: contact_name || null,
        contact_email: contact_email || null,
        website: website || null,
        user_id: userId,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create startup' }, { status: 500 })
    }

    return NextResponse.json(startup, { status: 201 })
  } catch (error) {
    console.error('Failed to create startup:', error)
    return NextResponse.json({ error: 'Failed to create startup' }, { status: 500 })
  }
}
