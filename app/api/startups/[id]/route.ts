import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: startup, error } = await supabase
      .from('startups')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error('Failed to fetch startup:', error)
    return NextResponse.json({ error: 'Failed to fetch startup' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data: startup, error } = await supabase
      .from('startups')
      .update({
        name: body.name,
        description: body.description || null,
        category: body.category || null,
        contact_name: body.contact_name || null,
        contact_email: body.contact_email || null,
        website: body.website || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error('Failed to update startup:', error)
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('startups')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete startup:', error)
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 })
  }
}
