import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCheck,
  Package,
  Star,
  ShieldAlert,
  Megaphone,
  ShoppingBag,
  Info,
} from 'lucide-react'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/features/public/useNotifications'
import { formatDate } from '@/lib/format'
import clsx from 'clsx'

function getNotificationIcon(type) {
  if (type?.startsWith('order_')) return <Package size={15} className="text-forest" />
  if (type?.startsWith('review_')) return <Star size={15} className="text-amber" />
  if (type?.includes('status') || type?.includes('moderation')) return <ShieldAlert size={15} className="text-error" />
  if (type === 'announcement') return <Megaphone size={15} className="text-forest" />
  return <Info size={15} className="text-forest" />
}

export default function NotificationDropdown({ align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const { data: notifications = [], isLoading } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleNotificationClick = (n) => {
    if (!n.isRead) {
      markRead.mutate(n._id)
    }
    setIsOpen(false)
    if (n.link) {
      navigate(n.link)
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-forest text-text-secondary hover:text-text-main transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={clsx(
            'absolute top-full mt-2 w-80 sm:w-96 rounded-2xl border border-line bg-surface-cream shadow-xl z-50 overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-bg-ivory/50">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-main">Notifications</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="flex items-center gap-1 text-xs font-medium text-forest hover:underline"
              >
                <CheckCheck size={13} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-line/60">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-text-secondary">Loading notifications…</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="mx-auto mb-2 text-text-secondary/40" />
                <p className="text-xs font-medium text-text-main">No notifications yet</p>
                <p className="text-[11px] text-text-secondary mt-0.5">We'll alert you about order updates and news.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={clsx(
                    'flex items-start gap-3 p-3.5 hover:bg-bg-ivory transition-colors cursor-pointer text-left',
                    !n.isRead ? 'bg-forest/5' : 'bg-transparent'
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-sand/80 mt-0.5">
                    {getNotificationIcon(n.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-xs leading-snug', !n.isRead ? 'font-semibold text-text-main' : 'text-text-secondary')}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-text-secondary/80 mt-1">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-forest shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
