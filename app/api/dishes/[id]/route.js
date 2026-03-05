import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
    try {
        const dish = await prisma.dish.findUnique({
            where: { id: parseInt(params.id) },
            include: { category: true },
        })
        if (!dish) return NextResponse.json({ error: 'Dish not found' }, { status: 404 })
        return NextResponse.json(dish)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const body = await request.json()
        const { name, description, price, imageUrl, categoryId, available, featured } = body

        const dish = await prisma.dish.update({
            where: { id: parseInt(params.id) },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(categoryId && { categoryId: parseInt(categoryId) }),
                ...(available !== undefined && { available }),
                ...(featured !== undefined && { featured }),
            },
            include: { category: true },
        })

        return NextResponse.json(dish)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        await prisma.dish.delete({ where: { id: parseInt(params.id) } })
        return NextResponse.json({ message: 'Dish deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
