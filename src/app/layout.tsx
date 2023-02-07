import { Header } from '@/components/ScrollingHeader'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className='bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100'>
        <Header />
        {children}
        </body>
    </html>
  )
}
