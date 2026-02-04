import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { collaborations, partners, startups, categories, reviews } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let filtered = [...collaborations]

    if (startDate) {
      filtered = filtered.filter(c =>
        new Date(c.requestDate) >= new Date(startDate)
      )
    }
    if (endDate) {
      filtered = filtered.filter(c =>
        new Date(c.requestDate) <= new Date(endDate)
      )
    }

    // Calculate statistics
    const totalCollaborations = filtered.length
    const completedCollaborations = filtered.filter(
      c => c.status === 'COMPLETED' || c.status === 'SELF_ACTIVATED'
    ).length

    // Category breakdown
    const categoryStats: Record<string, { count: number; name: string }> = {}
    filtered.forEach(c => {
      const partner = partners.find(p => p.id === c.partnerId)
      if (partner) {
        const category = categories.find(cat => cat.id === partner.categoryId)
        if (category) {
          if (!categoryStats[category.id]) {
            categoryStats[category.id] = { count: 0, name: category.name }
          }
          categoryStats[category.id].count++
        }
      }
    })

    // Startup breakdown
    const startupStats: Record<string, { count: number; name: string; saving: number }> = {}
    filtered.forEach(c => {
      const startup = startups.find(s => s.id === c.startupId)
      if (startup) {
        if (!startupStats[startup.id]) {
          startupStats[startup.id] = { count: 0, name: startup.name, saving: 0 }
        }
        startupStats[startup.id].count++
        if (c.actualSaving) {
          startupStats[startup.id].saving += c.actualSaving
        }
      }
    })

    // Total savings
    const totalEstimatedSaving = filtered.reduce((sum, c) => {
      const partner = partners.find(p => p.id === c.partnerId)
      return sum + (partner?.estimatedSaving || 0)
    }, 0)

    const totalActualSaving = filtered.reduce(
      (sum, c) => sum + (c.actualSaving || 0),
      0
    )

    // Average rating
    const collabReviews = reviews.filter(r =>
      filtered.some(c => c.id === r.collaborationId)
    )
    const avgRating = collabReviews.length > 0
      ? collabReviews.reduce((sum, r) => sum + r.rating, 0) / collabReviews.length
      : 0

    // Service type breakdown
    const selfServiceCount = filtered.filter(c => {
      const partner = partners.find(p => p.id === c.partnerId)
      return partner?.serviceType === 'SELF_SERVICE'
    }).length

    const approvalRequiredCount = filtered.filter(c => {
      const partner = partners.find(p => p.id === c.partnerId)
      return partner?.serviceType === 'APPROVAL_REQUIRED'
    }).length

    const collabsWithData = filtered.map(c => {
      const startup = startups.find(s => s.id === c.startupId)
      const partner = partners.find(p => p.id === c.partnerId)
      const category = partner ? categories.find(cat => cat.id === partner.categoryId) : null
      const review = reviews.find(r => r.collaborationId === c.id)

      return {
        id: c.id,
        startup: startup?.name || '',
        partner: partner?.name || '',
        category: category?.name || '',
        status: c.status,
        estimatedSaving: partner?.estimatedSaving || null,
        actualSaving: c.actualSaving,
        rating: review?.rating || null,
        createdAt: c.requestDate,
      }
    })

    return NextResponse.json({
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present',
      },
      summary: {
        totalCollaborations,
        completedCollaborations,
        totalEstimatedSaving,
        totalActualSaving,
        avgRating: parseFloat(avgRating.toFixed(2)),
        reviewCount: collabReviews.length,
      },
      serviceTypeBreakdown: {
        selfService: selfServiceCount,
        approvalRequired: approvalRequiredCount,
      },
      categoryBreakdown: Object.values(categoryStats).sort(
        (a, b) => b.count - a.count
      ),
      startupBreakdown: Object.values(startupStats).sort(
        (a, b) => b.count - a.count
      ),
      collaborations: collabsWithData,
    })
  } catch (error) {
    console.error('Failed to generate report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
