import './globals.css'
import { Inter } from 'next/font/google'
import Provider from './context/provider'
import ToasterContext from './context/toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Toaa-Niung',
  description: 'Table reservation websit',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><Provider><ToasterContext />{children}</Provider></body>
    </html>
  )
}
