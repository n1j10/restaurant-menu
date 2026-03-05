require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Delete existing data
    await prisma.dish.deleteMany()
    await prisma.category.deleteMany()
    await prisma.booking.deleteMany()

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({ data: { name: 'الكل', slug: 'all' } }),
        prisma.category.create({ data: { name: 'المقبلات', slug: 'appetizers' } }),
        prisma.category.create({ data: { name: 'الأطباق الرئيسية', slug: 'main' } }),
        prisma.category.create({ data: { name: 'الحلويات', slug: 'desserts' } }),
        prisma.category.create({ data: { name: 'المشروبات', slug: 'drinks' } }),
        prisma.category.create({ data: { name: 'السلطات', slug: 'salads' } }),
    ])

    const [all, appetizers, main, desserts, drinks, salads] = categories

    // Create dishes matching the Stitch screen exactly
    await prisma.dish.createMany({
        data: [
            {
                name: 'سلمون بالأفوكادو',
                description: 'قطعة سلمون مشوية تقدم مع شرائح الأفوكادو الطازجة، الكينوا، وصوص الليمون الخاص.',
                price: 85.00,
                imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
                available: true,
                featured: true,
                orderCount: 120,
                categoryId: main.id,
            },
            {
                name: 'بيتزا المارغريتا الملكية',
                description: 'عجينة محضرة يدوياً، طماطم سان مارزانو، وجبن الموزاريلا الفاخر مع ريحان طازج.',
                price: 65.00,
                imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
                available: true,
                featured: false,
                orderCount: 240,
                categoryId: main.id,
            },
            {
                name: 'ستيك تندرلوين فاخر',
                description: '٢٥٠ جرام من أجود أنواع اللحم البقري، مشوي حسب اختيارك مع زبدة الأعشاب.',
                price: 145.00,
                imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce18b88896?w=400&h=300&fit=crop',
                available: true,
                featured: true,
                orderCount: 98,
                categoryId: main.id,
            },
            {
                name: 'لافا كيك البلجيكية',
                description: 'كيك الشوكولاتة الدافئة بقلب ذائب، تقدم مع آيس كريم الفانيليا وتوت بري.',
                price: 45.00,
                imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
                available: true,
                featured: false,
                orderCount: 167,
                categoryId: desserts.id,
            },
            {
                name: 'حمص بالصنوبر',
                description: 'حمص كريمي محضر على الطريقة التقليدية مع زيت الزيتون البكر والصنوبر المحمص.',
                price: 30.00,
                imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=300&fit=crop',
                available: true,
                featured: false,
                orderCount: 89,
                categoryId: appetizers.id,
            },
            {
                name: 'موخيتو الانتعاش',
                description: 'مزيج منعش من الليمون الأخضر والنعناع الطازج مع لمسة من نكهة التوت.',
                price: 25.00,
                imageUrl: 'https://images.unsplash.com/photo-1506802913710-8df8e0345a84?w=400&h=300&fit=crop',
                available: true,
                featured: false,
                orderCount: 203,
                categoryId: drinks.id,
            },
            {
                name: 'سلطة قيصر بالدجاج',
                description: 'خس روماني طازج، دجاج مشوي، خبز محمص وجبن بارميزان مع صوص القيصر الأصلي.',
                price: 55.00,
                imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
                available: true,
                featured: false,
                orderCount: 145,
                categoryId: salads.id,
            },
            {
                name: 'قهوة عربية مختارة',
                description: 'دلة قهوة عربية بالهيل والزعفران، تقدم مع تشكيلة من أفخر أنواع التمور.',
                price: 20.00,
                imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
                available: true,
                featured: false,
                orderCount: 312,
                categoryId: drinks.id,
            },
        ],
    })

    console.log('✅ Database seeded successfully!')
    console.log('  - 6 categories created')
    console.log('  - 8 dishes created')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
