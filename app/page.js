import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Products from '@/components/Products'
import { WhyUs, Areas } from '@/components/WhyAndAreas'
import QuoteBuilder from '@/components/QuoteBuilder'
import { Contact, Footer } from '@/components/ContactAndFooter'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Products />
        <WhyUs />
        <Areas />
        <QuoteBuilder />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
