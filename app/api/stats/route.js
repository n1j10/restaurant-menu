import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const [totalDishes, totalCategories, topDish, menuVisits] = await Promise.all([
            prisma.dish.count(),
            prisma.category.count(),
            prisma.dish.findFirst({
                orderBy: { orderCount: 'desc' },
                select: { name: true, orderCount: true },
            }),
            // Simulate menu visits (in production you'd track this)
            Promise.resolve(1240),
        ])

        return NextResponse.json({
            totalDishes,
            totalCategories,
            topDish: topDish?.name || 'بيتزا مارغريتا',
            menuVisits,
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
