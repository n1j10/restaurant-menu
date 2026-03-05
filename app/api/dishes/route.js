import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const categorySlug = searchParams.get('category')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const where = categorySlug && categorySlug !== 'all'
            ? { category: { slug: categorySlug }, available: true }
            : { available: true }

        const [dishes, total] = await Promise.all([
            prisma.dish.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.dish.count({ where }),
        ])

        return NextResponse.json({ dishes, total, page, limit })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, description, price, imageUrl, categoryId, available, featured } = body

        if (!name || !description || !price || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const dish = await prisma.dish.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl: imageUrl || null,
                categoryId: parseInt(categoryId),
                available: available ?? true,
                featured: featured ?? false,
            },
            include: { category: true },
        })

        return NextResponse.json(dish, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
