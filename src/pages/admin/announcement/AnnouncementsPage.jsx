import { useMemo, useState } from 'react'
import {
  useAnnouncements,
  useAnnouncementStats,
  useUpdateAnnouncementStatus,
  useDeleteAnnouncement,
} from '@/features/admin/useAnnouncements'
import Surface from '@/components/ui/Surface'
import Stat from '@/components/ui/Stat'
import Table from '@/components/ui/Table'
import SearchInput from '@/components/ui/SearchInput'
import ActionMenu from '@/components/ui/ActionMenu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import AddAnnouncementModal from '@/components/admin/AddAnnouncementModal'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Megaphone, CheckCircle2, FileText, Pencil, Trash2, Plus } from 'lucide-react'

const STAT_CONFIG = [
  { key: 'total', label: 'Total Announcements', icon: Megaphone },
  { key: 'published', label: 'Published', icon: CheckCircle2 },
  { key: 'drafts', label: 'Drafts', icon: FileText },
]

const AUDIENCE_LABELS = {
  all: 'Everyone',
  farmers: 'Farmers',
  customers: 'Customers',
  admins: 'Admins',
}

function StatSkeleton() {
  return (
    <Surface className="p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 w-20 bg-line rounded" />
      <div className="h-8 w-14 bg-line rounded" />
    </Surface>
  )
}

function AudiencePill({ audience }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-forest/10 text-forest border border-forest/20">
      {AUDIENCE_LABELS[audience] || audience}
    </span>
  )
}

// Same pattern as StatusSwitch in CategoriesPage — click to toggle published/draft.
function StatusSwitch({ status, onToggle, isPending }) {
  const isPublished = status === 'published'
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors disabled:opacity-50',
        isPublished
          ? 'bg-success/10 text-success border border-success/20 hover:bg-success/15'
          : 'bg-line text-text-secondary hover:bg-line/70'
      )}
      title={isPublished ? 'Click to move to drafts' : 'Click to publish'}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', isPublished ? 'bg-success' : 'bg-text-secondary/50')} />
      {isPublished ? 'Published' : 'Draft'}
    </button>
  )
}

export default function AnnouncementsPage() {
  const { data: stats, isLoading: statsLoading } = useAnnouncementStats()
  const { data: announcements, isLoading, isError } = useAnnouncements()
  const updateStatus = useUpdateAnnouncementStatus()
  const deleteAnnouncementMutation = useDeleteAnnouncement()

  const [search, setSearch] = useState('')
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!announcements) return []
    const q = search.trim().toLowerCase()
    if (!q) return announcements
    return announcements.filter(
      (a) => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q)
    )
  }, [announcements, search])

  function toggleStatus(announcement) {
    updateStatus.mutate({
      announcementId: announcement.id,
      status: announcement.status === 'published' ? 'draft' : 'published',
    })
  }

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsLoading
          ? STAT_CONFIG.map((item) => <StatSkeleton key={item.key} />)
          : STAT_CONFIG.map((item) => (
              <Stat
                key={item.key}
                label={item.label}
                value={(stats?.[item.key] ?? 0).toLocaleString()}
                icon={item.icon}
              />
            ))}
      </div>

      <Surface className="p-5">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-medium text-text-main">Announcements</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {announcements?.length ?? 0} announcements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search announcements…"
              className="w-56"
            />
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="w-4 h-4" strokeWidth={2} />
              New
            </Button>
          </div>
        </div>

        {isError ? (
          <p className="text-sm text-error py-6 text-center">Couldn't load announcements.</p>
        ) : isLoading ? (
          <div className="py-10 text-center text-sm text-text-secondary">Loading announcements…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-secondary">
            No announcements match your search.
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Audience</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Created</Table.HeadCell>
                <Table.HeadCell>Expires</Table.HeadCell>
                <Table.HeadCell className="text-right">Actions</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((announcement) => (
                <Table.Row key={announcement.id}>
                  <Table.Cell className="max-w-xs">
                    <p className="font-medium text-text-main truncate">{announcement.title}</p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">{announcement.message}</p>
                  </Table.Cell>
                  <Table.Cell>
                    <AudiencePill audience={announcement.audience} />
                  </Table.Cell>
                  <Table.Cell>
                    <StatusSwitch
                      status={announcement.status}
                      onToggle={() => toggleStatus(announcement)}
                      isPending={updateStatus.isPending && updateStatus.variables?.announcementId === announcement.id}
                    />
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary">{formatDate(announcement.createdAt)}</Table.Cell>
                  <Table.Cell className="text-text-secondary">
                    {announcement.expiresAt ? formatDate(announcement.expiresAt) : '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-end gap-1">
                      <ActionMenu
                        actions={[
                          { label: 'Edit', icon: Pencil, onClick: () => setEditingAnnouncement(announcement) },
                          {
                            label: 'Remove',
                            icon: Trash2,
                            danger: true,
                            onClick: () => setDeletingAnnouncement(announcement),
                          },
                        ]}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        <AddAnnouncementModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

        <AddAnnouncementModal
          open={!!editingAnnouncement}
          onClose={() => setEditingAnnouncement(null)}
          announcement={editingAnnouncement}
        />

        <ConfirmDialog
          open={!!deletingAnnouncement}
          onClose={() => setDeletingAnnouncement(null)}
          onConfirm={() => {
            deleteAnnouncementMutation.mutate(deletingAnnouncement.id)
            setDeletingAnnouncement(null)
          }}
          title="Remove Announcement"
          description={`Remove "${deletingAnnouncement?.name || deletingAnnouncement?.title}"? This cannot be undone.`}
          confirmLabel="Remove"
        />
      </Surface>
    </div>
  )
}