import { useState } from 'react'
import { Star } from 'lucide-react'
import { useAddReview } from '@/features/public/useReviews'

export default function ReviewForm({ orderId, onDone }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const addReview = useAddReview()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    addReview.mutate(
      { orderId, rating, comment },
      { onSuccess: () => { setComment(''); onDone?.() } }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-ivory rounded-2xl p-4 sm:p-5">
      <p className="text-sm font-semibold text-text-main mb-3">Rate this order</p>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
            <Star size={22} className={n <= rating ? 'fill-amber text-amber' : 'text-line'} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="How was your order?"
        className="w-full rounded-lg border border-line bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-forest resize-none mb-3"
        required
      />
      <button
        type="submit"
        disabled={addReview.isPending}
        className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60"
      >
        {addReview.isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}