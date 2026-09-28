import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import farmerDash from '../../assets/images/farmer-dashboard.jpeg'

export default function ForFarmersSection() {
  return (
    <section className="bg-forest/5 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <span className="inline-block text-xs font-semibold tracking-wide text-forest uppercase mb-3">
              For Farmers
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-main mb-4 leading-tight">
              Turn your weekly harvest into opportunity.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 max-w-md">
              List your products, manage pre-orders, pickup slots and grow
              your customers.
            </p>
            <Link
              to="/farmer/register"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
            >
              Join as Farmer
              <ArrowRight size={16} />
            </Link> 
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
              <img
                src={farmerDash}
                alt="Farmer with harvest crate"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating dashboard preview card */}
            <div className="absolute -bottom-4 -right-2 sm:right-4 w-64 rounded-2xl bg-surface-cream shadow-xl border border-line p-4">
              <p className="text-xs font-semibold text-text-main mb-3">Farmer Dashboard</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <p className="text-[10px] text-text-secondary">Weekly Orders</p>
                  <p className="text-sm font-bold text-text-main">48</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary">Pickup Slots</p>
                  <p className="text-sm font-bold text-text-main">12</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary">Revenue</p>
                  <p className="text-sm font-bold text-forest">Rs. 24,350</p>
                </div>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-line">
                {[
                  { name: 'Rahul S.', time: '9:00 AM', amount: 650 },
                  { name: 'Ayesha K.', time: '10:00 AM', amount: 450 },
                ].map((order) => (
                  <div key={order.name} className="flex items-center justify-between text-[11px]">
                    <span className="text-text-main">{order.name}</span>
                    <span className="text-text-secondary">{order.time}</span>
                    <span className="font-medium text-text-main">Rs. {order.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}