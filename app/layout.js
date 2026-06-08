import { Barlow_Condensed, DM_Sans } from 'next/font/google'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata = {
  title: 'Forte Shutters — Premium Security Solutions Kenya',
  description: 'Premium roller shutters, electric gates and security solutions for homes, businesses and industrial properties across Kenya. Based in Thika, serving Nairobi, Mombasa and beyond.',
  keywords: 'roller shutters Kenya, security shutters Nairobi, electric gates Thika, garage shutters Mombasa, shop front shutters',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
