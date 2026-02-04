import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: partner, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Failed to fetch partner:', error)
    return NextResponse.json({ error: 'Failed to fetch partner' }, { status: 500 })
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

    const { data: partner, error } = await supabase
      .from('partners')
      .update({
        name: body.name,
        description: body.description || null,
        category: body.category || null,
        contact_name: body.contact_name || null,
        contact_email: body.contact_email || null,
        website: body.website || null,
        service_type: body.service_type || 'SELF_SERVICE',
        benefits: body.benefits || null,
        usage_guide: body.usage_guide || null,
        self_service_info: body.self_service_info || null,
        estimated_saving: body.estimated_saving ? parseInt(body.estimated_saving) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error('Failed to update partner:', error)
    return NextResponse.json({ error: 'Failed to update partner' }, { status: 500 })
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
      .from('partners')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete partner:', error)
    return NextResponse.json({ error: 'Failed to delete partner' }, { status: 500 })
  }
}
