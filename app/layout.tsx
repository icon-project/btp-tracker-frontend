import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BTP message explorer',
  description: 'btp message explorer',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    let networkOptions;
    try {
        const summaryRes = await fetch(`${process.env.API_URI}/tracker/bmc/summary`, {cache: 'no-store'});
        const summaryJson = await summaryRes.json();
        networkOptions = summaryJson;
    } catch(error) {
    }
  return (
    <html lang="en">
      <body className={inter.className + " bg-[#f0ffff] min-h-screen flex flex-col"}>
      <Header networkOptions={networkOptions}/>
      {children}
      <Footer/>
      </body>
    </html>
  )
}
