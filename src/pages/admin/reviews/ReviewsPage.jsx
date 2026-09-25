import { useMemo, useState } from "react";
import {
  useReviews,
  useReviewStats,
  useUpdateReviewStatus,
  useDeleteReview,
} from "@/features/admin/useReviews";
import Surface from "@/components/ui/Surface";
import Stat from "@/components/ui/Stat";
import Table from "@/components/ui/Table";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ActionMenu from "@/components/ui/ActionMenu";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Star, MessageSquare, Flag, EyeOff, Eye, Trash2 } from "lucide-react";
import StatusBadge from "../../../components/ui/StatusBadge";

const PAGE_SIZE = 6;

const STAT_CONFIG = [
  { key: "total", label: "Total Reviews", icon: MessageSquare },
  { key: "flagged", label: "Flagged", icon: Flag },
  { key: "hidden", label: "Hidden", icon: EyeOff },
  { key: "avgRating", label: "Average Rating", icon: Star },
];

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  );
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating ? "text-amber fill-amber" : "text-line",
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { data: stats, isLoading: statsLoading } = useReviewStats();
  const { data: reviews, isLoading, isError } = useReviews();
  const updateStatus = useUpdateReviewStatus();
  const deleteReviewMutation = useDeleteReview();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingReview, setDeletingReview] = useState(null);

  const filtered = useMemo(() => {
    if (!reviews) return [];
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.customer.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.farmer.toLowerCase().includes(q),
    );
  }, [reviews, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading
          ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
          : STAT_CONFIG.map((item) => (
              <Stat
                key={item.key}
                label={item.label}
                value={stats?.[item.key] ?? 0}
                icon={item.icon}
              />
            ))}
      </div>

      {/* Table */}
      <Surface className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-medium text-text-main">
              Reviews
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {reviews?.length ?? 0} reviews across all products
            </p>
          </div>
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search customer, product, farmer…"
            className="w-64"
          />
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">
            Couldn't load reviews.
          </p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">
            Loading reviews…
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">
            No reviews match your search.
          </div>
        ) : (
          <>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell>Customer</Table.HeadCell>
                  <Table.HeadCell>Product</Table.HeadCell>
                  <Table.HeadCell>Farmer</Table.HeadCell>
                  <Table.HeadCell>Rating</Table.HeadCell>
                  <Table.HeadCell>Comment</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell className="text-right">
                    Actions
                  </Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginated.map((review) => (
                  <Table.Row
                    key={review.id}
                    className={
                      review.status === "flagged" ? "bg-error/5" : undefined
                    }
                  >
                    <Table.Cell className="font-medium text-text-main">
                      {review.customer}
                    </Table.Cell>
                    <Table.Cell>{review.product}</Table.Cell>
                    <Table.Cell className="text-text-secondary">
                      {review.farmer}
                    </Table.Cell>
                    <Table.Cell>
                      <RatingStars rating={review.rating} />
                    </Table.Cell>
                    <Table.Cell className="max-w-xs">
                      <div className="flex items-center gap-1.5">
                        {review.status === "flagged" && (
                          <Flag
                            className="w-3.5 h-3.5 text-error shrink-0"
                            strokeWidth={1.75}
                          />
                        )}
                        <span className="text-text-secondary truncate">
                          {review.comment}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-text-secondary">
                      {formatDate(review.date)}
                    </Table.Cell>
                    
                     <Table.Cell>
                      <StatusBadge status={review.status} />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center justify-end">
                        <ActionMenu
                          actions={[
                            review.status === "hidden"
                              ? {
                                  label: "Unhide",
                                  icon: Eye,
                                  onClick: () =>
                                    updateStatus.mutate({
                                      reviewId: review.id,
                                      status: "visible",
                                    }),
                                }
                              : {
                                  label: "Hide",
                                  icon: EyeOff,
                                  onClick: () =>
                                    updateStatus.mutate({
                                      reviewId: review.id,
                                      status: "hidden",
                                    }),
                                },
                            {
                              label: "Remove",
                              icon: Trash2,
                              danger: true,
                              onClick: () => setDeletingReview(review),
                            },
                          ]}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-4"
            />
          </>
        )}

        <ConfirmDialog
          open={!!deletingReview}
          onClose={() => setDeletingReview(null)}
          onConfirm={() => {
            deleteReviewMutation.mutate(deletingReview.id);
            setDeletingReview(null);
          }}
          title="Remove Review"
          description={`Remove this review by "${deletingReview?.customer}"? This cannot be undone.`}
          confirmLabel="Remove"
        />
      </Surface>
    </div>
  );
}
