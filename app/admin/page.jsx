'use client'

import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, BookOpen, Tag, Settings, Plus, Trash2, Edit2, Eye, EyeOff, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BRAND = '#1b322c'
const GOLD = '#d4a843'

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'لوحة التحكم', key: 'dashboard' },
    { icon: BookOpen, label: 'إدارة القائمة', key: 'menu' },
    { icon: Tag, label: 'التصنيفات', key: 'categories' },
    { icon: Settings, label: 'الإعدادات', key: 'settings' },
]

export default function AdminPage() {
    const [activeNav, setActiveNav] = useState('menu')
    const [dishes, setDishes] = useState([])
    const [categories, setCategories] = useState([])
    const [stats, setStats] = useState(null)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editDish, setEditDish] = useState(null)
    const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', available: true, featured: false, imageUrl: '' })
    const [formLoading, setFormLoading] = useState(false)
    const LIMIT = 3

    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const [dishRes, catRes, statsRes] = await Promise.all([
                fetch(`/api/dishes?page=${page}&limit=${LIMIT}`),
                fetch('/api/categories'),
                fetch('/api/stats'),
            ])
            const d = await dishRes.json()
            const c = await catRes.json()
            const s = await statsRes.json()
            setDishes(d.dishes || [])
            setTotal(d.total || 0)
            // Old code: setCategories(c || [])
            setCategories(Array.isArray(c) ? c : [])
            setStats(s)
        } catch (e) { console.error(e) }
        setLoading(false)
    }, [page])

    useEffect(() => { fetchAll() }, [fetchAll])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormLoading(true)
        try {
            const url = editDish ? `/api/dishes/${editDish.id}` : '/api/dishes'
            const method = editDish ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setShowAddForm(false)
                setEditDish(null)
                setForm({ name: '', description: '', price: '', categoryId: '', available: true, featured: false, imageUrl: '' })
                fetchAll()
            }
        } catch (e) { console.error(e) }
        setFormLoading(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا الطبق؟')) return
        await fetch(`/api/dishes/${id}`, { method: 'DELETE' })
        fetchAll()
    }

    const handleEdit = (dish) => {
        setEditDish(dish)
        setForm({
            name: dish.name,
            description: dish.description,
            price: String(dish.price),
            categoryId: String(dish.categoryId),
            available: dish.available,
            featured: dish.featured,
            imageUrl: dish.imageUrl || '',
        })
        setShowAddForm(true)
    }

    const totalPages = Math.ceil(total / LIMIT)

    return (
        <div className="flex min-h-screen bg-gray-50" dir="rtl">
            {/* ===================== SIDEBAR ===================== */}
            <aside className="w-64 flex flex-col min-h-screen fixed right-0 top-0 z-40" style={{ background: BRAND }}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xl">🍽</div>
                    <span className="text-white text-xl font-bold">فود برو</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {NAV_ITEMS.map(({ icon: Icon, label, key }) => (
                        <button
                            key={key}
                            onClick={() => setActiveNav(key)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                            style={activeNav === key
                                ? { background: 'rgba(255,255,255,0.15)', color: 'white' }
                                : { color: 'rgba(255,255,255,0.65)' }}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                {/* User */}
                <div className="px-6 py-5 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">أ</div>
                        <div>
                            <div className="text-sm font-medium text-white">أحمد محمد</div>
                            <div className="text-xs text-white/50">مدير النظام</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ===================== MAIN ===================== */}
            <main className="flex-1 mr-64 p-8">

                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: BRAND }}>إدارة الأطباق</h1>
                        <p className="text-gray-500 text-sm mt-1">قم بإدارة قائمة الطعام الخاصة بك، وتحديث الأسعار والتوافر.</p>
                    </div>
                    <Button
                        onClick={() => { setEditDish(null); setForm({ name: '', description: '', price: '', categoryId: '', available: true, featured: false, imageUrl: '' }); setShowAddForm(true) }}
                        className="flex items-center gap-2 text-white"
                        style={{ background: BRAND }}
                    >
                        <Plus size={16} />
                        إضافة طبق
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="إجمالي الأطباق" value={stats?.totalDishes ?? '—'} icon="🍽️" />
                    <StatCard label="التصنيفات" value={stats?.totalCategories ?? '—'} icon="🏷️" />
                    <StatCard label="الأكثر طلباً" value={stats?.topDish ?? '—'} icon="⭐" small />
                    <StatCard label="زيارات القائمة" value={stats?.menuVisits ? stats.menuVisits.toLocaleString('ar-SA') : '—'} icon="👁️" />
                </div>

                {/* Add / Edit Form */}
                {showAddForm && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <h3 className="text-base font-bold mb-5" style={{ color: BRAND }}>
                            {editDish ? 'تعديل الطبق' : 'إضافة طبق جديد'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image upload hint */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block" style={{ color: BRAND }}>رابط صورة الطبق</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={form.imageUrl}
                                        onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                                        placeholder="https://... (رابط الصورة)"
                                        className="text-right"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG حتى 10 ميجابايت (أدخل رابط الصورة)</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>اسم الطبق *</Label>
                                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم الطبق" required className="text-right" />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>التصنيف *</Label>
                                    <Select value={form.categoryId} onValueChange={v => setForm({ ...form, categoryId: v })} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر التصنيف" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.filter(c => c.slug !== 'all').map(cat => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>الوصف *</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="وصف الطبق بالتفصيل..."
                                    rows={2}
                                    required
                                    className="text-right resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>السعر (ريال) *</Label>
                                    <Input
                                        type="number"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        placeholder="0.00"
                                        required
                                        min={0}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium" style={{ color: BRAND }}>متاح</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch checked={form.available} onCheckedChange={v => setForm({ ...form, available: v })} />
                                        <span className="text-sm text-gray-500">{form.available ? 'نعم' : 'لا'}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Label className="text-sm font-medium" style={{ color: BRAND }}>مميز</Label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Switch checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} />
                                        <span className="text-sm text-gray-500">{form.featured ? 'نعم' : 'لا'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={formLoading} className="text-white" style={{ background: BRAND }}>
                                    {formLoading ? 'جارٍ الحفظ...' : editDish ? 'تحديث الطبق' : 'إضافة الطبق'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditDish(null) }}>
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Dish Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold" style={{ color: BRAND }}>الأطباق ({total})</h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: BRAND }} />
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-right">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">الطبق</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">التصنيف</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">السعر</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">الحالة</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {dishes.map(dish => (
                                        <tr key={dish.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {dish.imageUrl
                                                            ? <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                                                            : <div className="w-full h-full flex items-center justify-center text-lg">🍽</div>
                                                        }
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold" style={{ color: BRAND }}>{dish.name}</div>
                                                        <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{dish.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: '#e8f0ee', color: BRAND }}>
                                                    {dish.category?.name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold" style={{ color: GOLD }}>
                                                {dish.price} ريال
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dish.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                                    {dish.available ? 'متاح' : 'غير متاح'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(dish)}
                                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                                                        title="تعديل"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(dish.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition"
                                                        title="حذف"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {dishes.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-gray-400">لا توجد أطباق بعد</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        عرض {(page - 1) * LIMIT + 1} إلى {Math.min(page * LIMIT, total)} من أصل {total} طبق
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <ChevronRight size={14} />
                                        </Button>
                                        <span className="text-sm px-2">{page} / {totalPages}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <ChevronLeft size={14} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

// ─── Stat Card ───────────────────────────────────────────────────────
function StatCard({ label, value, icon, small }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">{label}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div className={`font-bold ${small ? 'text-base' : 'text-2xl'}`} style={{ color: BRAND }}>
                {value}
            </div>
        </div>
    )
}
