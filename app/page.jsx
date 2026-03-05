import Link from 'next/link'

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#1b322c' }}>
            <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">مطعم سفرة</h1>
                <p className="text-lg mb-8 opacity-80">استمتع بتجربة طعام فاخرة</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/menu" className="bg-white text-[#1b322c] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                        عرض القائمة
                    </Link>
                    <Link href="/qr" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
                        رمز QR
                    </Link>
                    <Link href="/admin" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
                        لوحة التحكم
                    </Link>
                </div>
            </div>
        </main>
    )
}
