import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type React from 'react'
import './globals.css'
import { GTMConsent, GtagScript } from '@/libs/gtm'
import { GTM_ID } from '@/libs/gtm'
import { GoogleTagManager } from '@next/third-parties/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const imageUrl = '/assets/liam_erd.png'

export const metadata: Metadata = {
  title: 'Liam ERD',
  description:
    'Automatically generates beautiful and easy-to-read ER diagrams from your database.',
  openGraph: {
    siteName: 'Liam',
    type: 'website',
    locale: 'en_US',
    images: imageUrl,
  },
  twitter: {},
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <>
        <GoogleTagManager
          gtmId={GTM_ID}
          dataLayer={{ appEnv: process.env.NEXT_PUBLIC_ENV_NAME ?? '' }}
        />
        <GtagScript />
        <GTMConsent />
      </>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
