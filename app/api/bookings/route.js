import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { name, phone, date, time, partySize, notes } = await request.json()
        if (!name || !phone || !date || !time || !partySize) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }
        const booking = await prisma.booking.create({
            data: {
                name,
                phone,
                date,
                time,
                partySize: parseInt(partySize),
                notes: notes || null,
            },
        })
        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(bookings)
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
