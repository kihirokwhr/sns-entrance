import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SNS ENTRANCE — ビジネスの入り口',
  description: '送信メッセージをAIが自動でビジネス敬語に変換。感情を整理して届けるチャットサービスです。',
  openGraph: {
    title: 'SNS ENTRANCE — ビジネスの入り口',
    description: '送信メッセージをAIが自動でビジネス敬語に変換。感情を整理して届けるチャットサービスです。',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SNS ENTRANCE — ビジネスの入り口',
    description: '送信メッセージをAIが自動でビジネス敬語に変換。感情を整理して届けるチャットサービスです。',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full bg-c-bg text-c-text">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
