import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-manrope',
})

export const metadata = {
    title: 'سفرة - قائمة الطعام',
    description: 'اكتشف مزيجاً فريداً من النكهات العالمية المحضرة بأجود المكونات المحلية الطازجة',
}

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${manrope.variable} font-manrope antialiased`}>
                {children}
            </body>
        </html>
    )
}
