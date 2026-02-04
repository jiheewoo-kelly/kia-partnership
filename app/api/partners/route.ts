import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    let query = supabase.from('partners').select('*')

    if (category) {
      query = query.eq('category', category)
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: partners, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 })
    }

    return NextResponse.json(partners)
  } catch (error) {
    console.error('Failed to fetch partners:', error)
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, contact_name, contact_email, website, logo_url } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: partner, error } = await supabase
      .from('partners')
      .insert({
        name,
        description: description || null,
        category: category || null,
        contact_name: contact_name || null,
        contact_email: contact_email || null,
        website: website || null,
        logo_url: logo_url || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 })
    }

    return NextResponse.json(partner, { status: 201 })
  } catch (error) {
    console.error('Failed to create partner:', error)
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 })
  }
}
