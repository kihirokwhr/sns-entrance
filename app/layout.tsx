import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const TITLE = 'SNS ENTRANCE｜AIフィルターですべての会話をフラットに'
const DESCRIPTION =
  '感情的なメッセージも、AIが自動でビジネス敬語に変換。言葉のトラブルを防ぎ、整った第一印象を届けるビジネスチャットです。月100通まで無料で始められます。'

export const metadata: Metadata = {
  metadataBase: new URL('https://sns-entrance.com'),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://sns-entrance.com',
    siteName: 'SNS ENTRANCE',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  verification: {
    google: 'mQPf_VOnXnR87G9kTvgAKfwz-4DOQGS69XnMfU6j0m0',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SNS ENTRANCE',
  url: 'https://sns-entrance.com',
  description: DESCRIPTION,
  inLanguage: 'ja',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full bg-c-bg text-c-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
