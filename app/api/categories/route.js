import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { dishes: true } } },
            orderBy: { id: 'asc' },
        })
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { name, slug } = await request.json()
        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
        }
        const category = await prisma.category.create({ data: { name, slug } })
        return NextResponse.json(category, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
