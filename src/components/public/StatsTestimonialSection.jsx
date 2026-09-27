import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const STATS = [
  { value: '500+', label: 'Markets' },
  { value: '2,000+', label: 'Farmers' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+', label: 'Locations' },
]

const TESTIMONIALS = [
  { name: 'Sana Ahmed', role: 'Happy Customer', quote: 'MarketLink makes it so easy to find fresh produce from trusted local farmers. I love the pickup experience and supporting my community!' },
  { name: 'Bilal Raza', role: 'Regular Shopper', quote: 'No more guessing if my favorite stall is open. I check the app, reserve, and pick up on my way home.' },
]

export default function StatsTestimonialSection() {
  const [index, setIndex] = useState(0)
  const testimonial = TESTIMONIALS[index]

  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length)
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section className="bg-bg-ivory py-14 sm:py-20 border-t border-line">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl sm:text-4xl font-bold text-forest">{stat.value}</p>
                <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-3xl bg-surface-cream border border-line p-6 sm:p-8 shadow-soft relative">
            <Quote size={28} className="text-forest/20 mb-3" />
            <p className="text-sm sm:text-base text-text-main leading-relaxed mb-6">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-forest/10 flex items-center justify-center text-sm font-semibold text-forest">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">{testimonial.name}</p>
                  <p className="text-xs text-text-secondary">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="h-8 w-8 flex items-center justify-center rounded-full border border-line hover:border-forest hover:text-forest transition-colors" aria-label="Previous">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={next} className="h-8 w-8 flex items-center justify-center rounded-full border border-line hover:border-forest hover:text-forest transition-colors" aria-label="Next">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}