'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Star, Clock, MapPin, Phone, Mail, Globe, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import BookingDialog from './BookingDialog'

const BRAND = '#1b322c'
const GOLD = '#d4a843'

export default function MenuPage() {
    const [dishes, setDishes] = useState([])
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState('all')
    const [cart, setCart] = useState([])
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [bookingOpen, setBookingOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        try {
            const [dishesRes, catsRes] = await Promise.all([
                fetch('/api/dishes?limit=50'),
                fetch('/api/categories'),
            ])
            const dishData = await dishesRes.json()
            const catData = await catsRes.json()
            setDishes(dishData.dishes || [])
            // Old code: setCategories(catData || [])
            setCategories(Array.isArray(catData) ? catData : [])
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    const filteredDishes = activeCategory === 'all'
        ? dishes
        : dishes.filter(d => d.category?.slug === activeCategory)

    const addToCart = (dish) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === dish.id)
            if (existing) return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i)
            return [...prev, { ...dish, qty: 1 }]
        })
    }

    const cartCount = cart.reduce((s, i) => s + i.qty, 0)

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            {/* ===================== NAVBAR ===================== */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: BRAND }}>
                            🍽
                        </div>
                        <span className="text-xl font-bold" style={{ color: BRAND }}>سفرة</span>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { label: 'الرئيسية', href: '/' },
                            { label: 'القائمة', href: '/menu' },
                            { label: 'الحجوزات', href: '#booking' },
                            { label: 'قصتنا', href: '#footer' },
                        ].map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-[#1b322c] transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right side: cart + book */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => alert(`السلة (${cartCount} عناصر)`)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <ShoppingCart size={20} color={BRAND} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center font-bold" style={{ background: BRAND }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        
                        <Button
                            onClick={() => setBookingOpen(true)}
                            className="hidden md:flex text-white text-sm font-semibold px-5 py-2 rounded-lg"
                            style={{ background: BRAND }}
                        >
                            احجز طاولة
                        </Button>
                        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
                        {['الرئيسية', 'القائمة', 'الحجوزات', 'قصتنا'].map(item => (
                            <a key={item} href="#" className="text-sm font-medium text-gray-700">{item}</a>
                        ))}
                        <Button onClick={() => setBookingOpen(true)} className="text-white w-full" style={{ background: BRAND }}>
                            احجز طاولة
                        </Button>
                    </div>
                )}
            </nav>

            {/* ===================== HERO ===================== */}
            <section className="relative overflow-hidden py-20 px-6" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #2a4a42 60%, #1b322c 100%)` }}>
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: GOLD, transform: 'translate(30%, -40%)' }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: GOLD, transform: 'translate(-30%, 40%)' }} />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Badge className="mb-6 text-xs font-medium px-4 py-1 rounded-full" style={{ background: 'rgba(212,168,67,0.2)', color: GOLD, border: `1px solid ${GOLD}` }}>
                        ✦ قائمة الطعام الموسمية ✦
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        قائمة الطعام الموسمية
                    </h1>
                    <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        اكتشف مزيجاً فريداً من النكهات العالمية المحضرة بأجود المكونات المحلية الطازجة
                    </p>

                    {/* Stats */}
                    <div className="mt-10 flex justify-center gap-12 text-white">
                        <div className="text-center">
                            <div className="text-3xl font-bold" style={{ color: GOLD }}>+٨٠</div>
                            <div className="text-sm text-white/60 mt-1">طبق متنوع</div>
                        </div>
                        <div className="w-px bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold" style={{ color: GOLD }}>+١٠</div>
                            <div className="text-sm text-white/60 mt-1">سنوات خبرة</div>
                        </div>
                        <div className="w-px bg-white/20" />
                        <div className="text-center">
                            <div className="text-3xl font-bold" style={{ color: GOLD }}>٤.٩</div>
                            <div className="text-sm text-white/60 mt-1">تقييم العملاء</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== CATEGORY PILLS ===================== */}
            <div className="sticky top-16 z-40 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto scrollbar-none">
                    {/* "All" pill */}
                    <button
                        onClick={() => setActiveCategory('all')}
                        className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all"
                        style={activeCategory === 'all'
                            ? { background: BRAND, color: 'white' }
                            : { background: '#f3f4f6', color: '#4b5563' }}
                    >
                        الكل
                    </button>
                    {categories.filter(c => c.slug !== 'all').map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.slug)}
                            className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all"
                            style={activeCategory === cat.slug
                                ? { background: BRAND, color: 'white' }
                                : { background: '#f3f4f6', color: '#4b5563' }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* ===================== MENU SECTION ===================== */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-16" style={{ background: GOLD }} />
                        <span className="text-sm font-semibold" style={{ color: GOLD }}>أطباقنا المميزة</span>
                        <div className="h-px w-16" style={{ background: GOLD }} />
                    </div>
                    <h2 className="text-3xl font-bold" style={{ color: BRAND }}>قائمة الطعام</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: BRAND }} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDishes.map(dish => (
                            <DishCard key={dish.id} dish={dish} onAdd={() => addToCart(dish)} />
                        ))}
                        {filteredDishes.length === 0 && (
                            <div className="col-span-3 text-center py-20 text-gray-400">
                                لا توجد أطباق في هذا التصنيف
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ===================== BOOKING CTA ===================== */}
            <section id="booking" className="py-20 px-6" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #2a4a42 100%)` }}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-px w-16" style={{ background: GOLD }} />
                        <span className="text-sm font-semibold" style={{ color: GOLD }}>احجز مكانك الآن</span>
                        <div className="h-px w-16" style={{ background: GOLD }} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">هل لديك مناسبة خاصة؟</h2>
                    <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
                        نحن هنا لنجعل لحظاتك لا تُنسى. احجز طاولتك الآن واستمتع بتجربة طعام استثنائية مع إطلالة خلابة وخدمة راقية.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => setBookingOpen(true)}
                            className="text-white font-bold px-8 py-3 rounded-lg text-base"
                            style={{ background: GOLD }}
                        >
                            احجز طاولة الآن
                        </Button>
                        <Button
                            variant="outline"
                            className="border-white text-white font-bold px-8 py-3 rounded-lg text-base hover:bg-white/10"
                        >
                            تواصل معنا
                        </Button>
                    </div>

                    {/* Info row */}
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/70 text-sm">
                        <div className="flex flex-col items-center gap-2">
                            <MapPin size={20} style={{ color: GOLD }} />
                            <span>شارع الملك فهد، الرياض</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Clock size={20} style={{ color: GOLD }} />
                            <span>الأحد - الخميس: ١٢م - ١٢ص</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Phone size={20} style={{ color: GOLD }} />
                            <span>+٩٦٦ ١١ ٢٣٤ ٥٦٧٨</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== FOOTER ===================== */}
            <footer id="footer" className="bg-gray-900 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold" style={{ background: BRAND }}>
                                🍽
                            </div>
                            <span className="text-xl font-bold">سفرة</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            نقدم لكم أجود أنواع الأطباق العالمية بلمسة محلية أصيلة منذ عام ٢٠١٠.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm" style={{ color: GOLD }}>روابط سريعة</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            {['القائمة الكاملة', 'سياسة الخصوصية', 'الأسئلة الشائعة', 'الوظائف'].map(item => (
                                <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm" style={{ color: GOLD }}>ساعات العمل</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>الأحد - الخميس: ١٢ م - ١٢ ص</li>
                            <li>الجمعة - السبت: ١ م - ٢ ص</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold mb-4 text-sm" style={{ color: GOLD }}>تابعنا</h4>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#1b322c] flex items-center justify-center transition">
                                <Globe size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#1b322c] flex items-center justify-center transition">
                                <Share2 size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#1b322c] flex items-center justify-center transition">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © ٢٠٢٤ مطعم سفرة. جميع الحقوق محفوظة.
                </div>
            </footer>

            {/* Booking dialog */}
            <BookingDialog open={bookingOpen} onClose={() => setBookingOpen(false)} />
        </div>
    )
}

// ─── Dish Card ───────────────────────────────────────────────────────
function DishCard({ dish, onAdd }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
                {dish.imageUrl ? (
                    <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽</div>
                )}
                {/* Category badge */}
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: BRAND }}>
                        {dish.category?.name}
                    </span>
                </div>
                {dish.featured && (
                    <div className="absolute top-3 left-3">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: GOLD, color: '#fff' }}>
                            ⭐ مميز
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold" style={{ color: BRAND }}>{dish.name}</h3>
                    <span className="font-bold text-sm whitespace-nowrap" style={{ color: GOLD }}>
                        {dish.price} ريال
                    </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {dish.description}
                </p>
                <button
                    onClick={onAdd}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ background: BRAND }}
                >
                    أضف للطلب
                </button>
            </div>
        </div>
    )
}
