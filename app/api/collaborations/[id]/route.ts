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

    const { data: collab, error } = await supabase
      .from('collaborations')
      .select(`
        *,
        startup:startups(*),
        partner:partners(*)
      `)
      .eq('id', params.id)
      .single()

    if (error || !collab) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    if (session.user.role === 'STARTUP' && collab.startup_id !== session.user.startupId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(collab)
  } catch (error) {
    console.error('Failed to fetch collaboration:', error)
    return NextResponse.json({ error: 'Failed to fetch collaboration' }, { status: 500 })
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

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.status) {
      updateData.status = body.status
      if (body.status === 'IN_PROGRESS') {
        updateData.start_date = new Date().toISOString()
      }
      if (body.status === 'COMPLETED') {
        updateData.end_date = new Date().toISOString()
      }
    }

    if (body.notes !== undefined) {
      updateData.notes = body.notes
    }

    const { data: collab, error } = await supabase
      .from('collaborations')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        startup:startups(*),
        partner:partners(*)
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update collaboration' }, { status: 500 })
    }

    return NextResponse.json(collab)
  } catch (error) {
    console.error('Failed to update collaboration:', error)
    return NextResponse.json({ error: 'Failed to update collaboration' }, { status: 500 })
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
      .from('collaborations')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete collaboration' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete collaboration:', error)
    return NextResponse.json({ error: 'Failed to delete collaboration' }, { status: 500 })
  }
}
