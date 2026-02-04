import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get('partnerId')
    const startupId = searchParams.get('startupId')

    let query = supabase.from('reviews').select('*')

    if (partnerId) {
      query = query.eq('partner_id', partnerId)
    }
    if (startupId) {
      query = query.eq('startup_id', startupId)
    }

    const { data: reviews, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rating, comment, partner_id, startup_id } = body

    if (!rating) {
      return NextResponse.json({ error: 'Rating is required' }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        rating,
        comment: comment || null,
        user_id: session.user.id,
        partner_id: partner_id || null,
        startup_id: startup_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Failed to create review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
