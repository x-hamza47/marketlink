import Modal from '@/components/ui/Modal'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/format'

export default function CustomerDetailModal({ customer, open, onClose }) {
  if (!customer) return null

  return (
    <Modal open={open} onClose={onClose} title="Customer Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xl font-medium text-text-main">{customer.name}</p>
            <p className="text-sm text-text-secondary">{customer.email}</p>
          </div>
          <StatusBadge status={customer.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-line/60">
          <div>
            <p className="text-xs text-text-secondary">Customer ID</p>
            <p className="text-sm font-medium text-text-main">{customer.id}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Phone</p>
            <p className="text-sm font-medium text-text-main">{customer.phone}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Total Orders</p>
            <p className="text-sm font-medium text-text-main">{customer.orders}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Joined</p>
            <p className="text-sm font-medium text-text-main">{formatDate(customer.joined)}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}