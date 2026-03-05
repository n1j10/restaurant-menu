'use client'

import { QRCodeSVG } from 'qrcode.react'

export default function QRPage() {
    const menuUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/menu`

    return (
        <main
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{ background: '#1b322c' }}
        >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#d4a843', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ background: '#d4a843', transform: 'translate(-30%, 30%)' }} />
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" style={{ border: '2px solid #d4a843' }} />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" style={{ border: '2px solid #d4a843' }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-8">
                {/* Logo */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: '#d4a843' }}>
                        🍽️
                    </div>
                    <div className="text-white text-right">
                        <div className="text-2xl font-bold">مطعم البريميوم</div>
                        <div className="text-sm opacity-60">Premium Restaurant</div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-24 h-px mb-8" style={{ background: '#d4a843' }} />

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-3">
                    امسح الرمز لعرض القائمة
                </h1>
                <p className="text-white/60 mb-10 text-lg max-w-sm leading-relaxed">
                    استمتع بتجربة طعام فاخرة واستعرض قائمتنا المختارة بعناية
                </p>

                {/* QR Code Card */}
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    <QRCodeSVG
                        value={menuUrl}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#1b322c"
                        level="H"
                    />
                </div>

                {/* Scan instruction */}
                <div className="mt-8 flex items-center gap-3 text-white/70">
                    <div className="h-px w-12" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    <span className="text-sm">أو انقر على الرابط أدناه</span>
                    <div className="h-px w-12" style={{ background: 'rgba(255,255,255,0.2)' }} />
                </div>

                {/* Direct link */}
                <a
                    href="/menu"
                    className="mt-4 text-white font-semibold underline underline-offset-4 hover:text-yellow-300 transition-colors"
                    style={{ color: '#d4a843' }}
                >
                    عرض القائمة مباشرة ←
                </a>

                {/* Bottom tagline */}
                <p className="mt-12 text-white/40 text-sm">
                    © ٢٠٢٤ مطعم البريميوم. جميع الحقوق محفوظة.
                </p>
            </div>
        </main>
    )
}
