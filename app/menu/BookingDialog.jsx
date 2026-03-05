'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BRAND = '#1b322c'
const GOLD = '#d4a843'

const TIME_SLOTS = [
    '12:00 م', '01:00 م', '02:00 م', '03:00 م', '04:00 م',
    '05:00 م', '06:00 م', '07:00 م', '08:00 م', '09:00 م',
    '10:00 م', '11:00 م', '12:00 ص',
]

export default function BookingDialog({ open, onClose }) {
    const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', partySize: '2', notes: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    setForm({ name: '', phone: '', date: '', time: '', partySize: '2', notes: '' })
                    onClose()
                }, 2000)
            }
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-right" style={{ color: BRAND }}>
                        احجز طاولتك
                    </DialogTitle>
                </DialogHeader>

                {success ? (
                    <div className="text-center py-8">
                        <div className="text-5xl mb-4">✅</div>
                        <p className="text-lg font-semibold" style={{ color: BRAND }}>تم تأكيد حجزك بنجاح!</p>
                        <p className="text-gray-500 text-sm mt-2">سنتواصل معك قريباً للتأكيد</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>الاسم الكامل *</Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="أدخل اسمك"
                                    required
                                    className="text-right"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>رقم الجوال *</Label>
                                <Input
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="+966 ..."
                                    required
                                    className="text-right"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>التاريخ *</Label>
                                <Input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>الوقت *</Label>
                                <Select onValueChange={v => setForm({ ...form, time: v })} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر الوقت" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TIME_SLOTS.map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>عدد الأشخاص *</Label>
                            <Select
                                defaultValue="2"
                                onValueChange={v => setForm({ ...form, partySize: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="عدد الأشخاص" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? 'شخص' : 'أشخاص'}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-sm font-medium mb-1 block" style={{ color: BRAND }}>ملاحظات (اختياري)</Label>
                            <Textarea
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                                placeholder="أي طلبات أو ملاحظات خاصة..."
                                rows={3}
                                className="text-right resize-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white font-bold py-2.5 rounded-lg"
                            style={{ background: BRAND }}
                        >
                            {loading ? 'جارٍ الحجز...' : 'تأكيد الحجز'}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
