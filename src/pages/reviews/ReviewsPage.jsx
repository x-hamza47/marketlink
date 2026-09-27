import { useEffect, useMemo, useState } from 'react'
import { useFarmerReviews, useFarmerReviewStats, useRespondToReview } from '@/features/farmer/useFarmerReviews'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import Pagination from '@/components/ui/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Star, MessageSquare, MessagesSquare } from 'lucide-react'

const STAT_CONFIG = [
  { key: 'total', label: 'Total Reviews', icon: MessagesSquare },
  { key: 'avgRating', label: 'Average Rating', icon: Star },
  { key: 'unanswered', label: 'Awaiting Response', icon: MessageSquare },
]

const RATING_OPTIONS = [
  { value: '', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
]

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn('w-3.5 h-3.5', i < rating ? 'fill-amber text-amber' : 'text-line')}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review, onRespond, isPending }) {
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)

  function submitReply() {
    if (!replyText.trim()) return
    onRespond(review.id, replyText.trim())
    setIsReplying(false)
  }

  return (
    <div className="py-4 border-b border-line/60 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-main">{review.customer}</p>
          <p className="text-xs text-text-secondary">
            on <span className="font-medium">{review.product}</span> &middot; {formatDate(review.date)}
          </p>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-sm text-text-main mt-2">{review.comment}</p>

      {/* Existing farmer response */}
      {review.response && !isReplying && (
        <div className="mt-3 ml-4 pl-3 border-l-2 border-forest/30">
          <p className="text-xs font-medium text-forest mb-0.5">Your response</p>
          <p className="text-sm text-text-secondary">{review.response}</p>
          <button
            type="button"
            onClick={() => {
              setReplyText(review.response)
              setIsReplying(true)
            }}
            className="text-xs text-forest hover:underline mt-1"
          >
            Edit response
          </button>
        </div>
      )}

      {/* Reply prompt / textarea */}
      {!review.response && !isReplying && (
        <button
          type="button"
          onClick={() => setIsReplying(true)}
          className="text-xs font-medium text-forest hover:underline mt-2"
        >
          Respond to this review
        </button>
      )}

      {isReplying && (
        <div className="mt-3 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Write a reply…"
            className="w-full px-3 py-2 rounded-md border border-line bg-surface-cream text-sm outline-none focus:border-forest resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setIsReplying(false)
                setReplyText('')
              }}
            >
              Cancel
            </Button>
            <Button size="sm" disabled={isPending || !replyText.trim()} onClick={submitReply}>
              {isPending ? 'Posting…' : 'Post Reply'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ReviewsPage() {
  const { data: stats, isLoading: statsLoading } = useFarmerReviewStats()
  const respondMutation = useRespondToReview()

  const [search, setSearch] = useState('')
  const [rating, setRating] = useState('')
  const [unansweredOnly, setUnansweredOnly] = useState(false)
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, rating, unansweredOnly])

  const queryParams = useMemo(
    () => ({ search: debouncedSearch, rating, unansweredOnly, page, limit: 10 }),
    [debouncedSearch, rating, unansweredOnly, page]
  )

  const { data, isLoading, isError } = useFarmerReviews(queryParams)
  const reviews = data?.items ?? []
  const totalPages = data?.pages ?? 1
  const total = data?.total ?? 0

  function handleRespond(reviewId, response) {
    respondMutation.mutate({ reviewId, response })
  }

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsLoading
          ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
          : STAT_CONFIG.map((item) => (
              <Stat key={item.key} label={item.label} value={stats?.[item.key] ?? 0} icon={item.icon} />
            ))}
      </div>

      <Surface className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-medium text-text-main">Customer Reviews</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {total} reviews left on your products
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="flex items-center gap-1.5 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={unansweredOnly}
                onChange={(e) => setUnansweredOnly(e.target.checked)}
                className="accent-forest"
              />
              Unanswered only
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="text-sm border border-line rounded-md px-3 py-2 bg-white text-text-main"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search customer or product…"
              className="w-64"
            />
          </div>
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load reviews.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">No reviews match your filters.</div>
        ) : (
          <>
            <div>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onRespond={handleRespond}
                  isPending={respondMutation.isPending && respondMutation.variables?.reviewId === review.id}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Surface>
    </div>
  )
}