import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import LocationPicker from './LocationPicker'
import { marketSchema } from '@/schemas/marketSchema'
import { useCreateMarket } from '@/features/admin/useMarkets'
import { cn } from '@/lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AddMarketModal({ open, onClose }) {
  const createMarketMutation = useCreateMarket()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: '',
      address: '',
      operatingDays: [],
      lat: undefined,
      lng: undefined,
    },
  })

  const selectedDays = watch('operatingDays')
  const locationValue = { lat: watch('lat'), lng: watch('lng'), address: watch('address') }

  function toggleDay(day) {
    const current = selectedDays || []
    if (current.includes(day)) {
      setValue('operatingDays', current.filter((d) => d !== day), { shouldValidate: true })
    } else {
      setValue('operatingDays', [...current, day], { shouldValidate: true })
    }
  }

  function onValid(data) {
    createMarketMutation.mutate(data, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  function handleClose() {
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Market" size="lg">
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        {/* Market name */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Market Name <span className="text-error">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. Clifton Sunday Market"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              errors.name ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
          {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
        </div>

        {/* Operating days */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Operating Days <span className="text-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors',
                  selectedDays?.includes(day)
                    ? 'bg-forest text-white border-forest'
                    : 'bg-surface-cream text-text-secondary border-line hover:border-forest/40'
                )}
              >
                {day}
              </button>
            ))}
          </div>
          {errors.operatingDays && (
            <p className="text-xs text-error mt-1">{errors.operatingDays.message}</p>
          )}
        </div>

        {/* Location picker */}
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">
            Location <span className="text-error">*</span>
          </label>
          <Controller
            name="lat"
            control={control}
            render={() => (
              <LocationPicker
                value={locationValue}
                onChange={({ lat, lng, address }) => {
                  setValue('lat', lat, { shouldValidate: true })
                  setValue('lng', lng, { shouldValidate: true })
                  setValue('address', address, { shouldValidate: true })
                }}
              />
            )}
          />
          {(errors.lat || errors.address) && (
            <p className="text-xs text-error mt-1">
              {errors.address?.message || errors.lat?.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
          <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={createMarketMutation.isPending}>
            {createMarketMutation.isPending ? 'Creating…' : 'Create Market'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}