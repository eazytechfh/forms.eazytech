import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Eazytech - Briefing',
  description: 'Eazytech - Briefing',
  generator: 'Eazytech - Briefing',
  icons: {
    icon: '/s-c3-admbolo-20gradiente.png',
    shortcut: '/s-c3-admbolo-20gradiente.png',
    apple: '/s-c3-admbolo-20gradiente.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
