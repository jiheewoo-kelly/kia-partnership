import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startupIdParam = searchParams.get('startupId')

    let query = supabase
      .from('collaborations')
      .select(`
        *,
        startup:startups(*),
        partner:partners(*)
      `)

    // Startups can only see their own collaborations
    if (session.user.role === 'STARTUP' && session.user.startupId) {
      query = query.eq('startup_id', session.user.startupId)
    } else if (startupIdParam) {
      query = query.eq('startup_id', startupIdParam)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: collaborations, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 })
    }

    return NextResponse.json(collaborations)
  } catch (error) {
    console.error('Failed to fetch collaborations:', error)
    return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { partner_id, partnerId, title, description, notes } = body
    const partnerIdValue = partner_id || partnerId

    if (!partnerIdValue) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    const startup_id = session.user.role === 'STARTUP'
      ? session.user.startupId
      : body.startup_id

    if (!startup_id) {
      return NextResponse.json({ error: 'Startup ID is required' }, { status: 400 })
    }

    // Check partner exists
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .eq('id', partnerIdValue)
      .single()

    if (partnerError || !partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    // Check for existing active collaboration
    const { data: existing } = await supabase
      .from('collaborations')
      .select('id')
      .eq('startup_id', startup_id)
      .eq('partner_id', partnerIdValue)
      .in('status', ['PENDING', 'IN_PROGRESS', 'SELF_ACTIVATED', 'REQUESTED', 'REVIEWING'])
      .single()

    if (existing) {
      return NextResponse.json({ error: '이미 진행 중인 협업이 있습니다' }, { status: 400 })
    }

    // Set status based on partner service type
    const collaborationStatus = partner.service_type === 'SELF_SERVICE'
      ? 'SELF_ACTIVATED'
      : 'REQUESTED'

    const { data: collaboration, error } = await supabase
      .from('collaborations')
      .insert({
        startup_id,
        partner_id: partnerIdValue,
        title: title || `${partner.name} 협업`,
        description: description || null,
        notes: notes || null,
        status: collaborationStatus,
        start_date: partner.service_type === 'SELF_SERVICE' ? new Date().toISOString() : null,
      })
      .select(`
        *,
        startup:startups(*),
        partner:partners(*)
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create collaboration' }, { status: 500 })
    }

    return NextResponse.json(collaboration, { status: 201 })
  } catch (error) {
    console.error('Failed to create collaboration:', error)
    return NextResponse.json({ error: 'Failed to create collaboration' }, { status: 500 })
  }
}
