import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import Surface from '@/components/ui/Surface'
import Button from '@/components/ui/Button'
import { stallProfileSchema, DAYS } from '@/schemas/stallProfileSchema'
import { useStallProfile, useAvailableMarkets, useUpdateStallProfile } from '@/features/farmer/useStallProfile'
import { cn } from '@/lib/utils'

function SectionSkeleton() {
  return (
    <Surface className="p-6 animate-pulse space-y-4">
      <div className="h-5 w-32 bg-line rounded" />
      <div className="h-10 w-full bg-line rounded" />
      <div className="h-32 w-full bg-line rounded" />
    </Surface>
  )
}

function MarketEntryCard({ index, control, register, errors, watch, setValue, remove, availableMarkets }) {
  const selectedDays = watch(`markets.${index}.operatingDays`) || []

  function toggleDay(day) {
    const current = selectedDays
    if (current.includes(day)) {
      setValue(
        `markets.${index}.operatingDays`,
        current.filter((d) => d !== day),
        { shouldValidate: true }
      )
    } else {
      setValue(`markets.${index}.operatingDays`, [...current, day], { shouldValidate: true })
    }
  }

  const marketErrors = errors.markets?.[index]

  return (
    <div className="border border-line rounded-lg p-4 space-y-4 relative">
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-error/5 text-error"
        aria-label="Remove market"
      >
        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {/* Market selector — only shows markets not already picked in another row */}
      <div className="pr-8">
        <label className="block text-sm font-medium text-text-main mb-1.5">
          Market <span className="text-error">*</span>
        </label>
        <Controller
          name={`markets.${index}.marketId`}
          control={control}
          render={({ field }) => (
            <select
              {...field}
              onChange={(e) => {
                const market = availableMarkets.find((m) => m.id === e.target.value)
                field.onChange(e.target.value)
                setValue(`markets.${index}.marketName`, market?.name || '')
              }}
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                marketErrors?.marketId ? 'border-error' : 'border-line focus:border-forest'
              )}
            >
              <option value="">Select a market…</option>
              {availableMarkets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
        />
        {marketErrors?.marketId && (
          <p className="text-xs text-error mt-1">{marketErrors.marketId.message}</p>
        )}
        {availableMarkets.length === 0 && (
          <p className="text-xs text-text-secondary mt-1">
            No other markets available to add.
          </p>
        )}
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
                selectedDays.includes(day)
                  ? 'bg-forest text-white border-forest'
                  : 'bg-surface-cream text-text-secondary border-line hover:border-forest/40'
              )}
            >
              {day}
            </button>
          ))}
        </div>
        {marketErrors?.operatingDays && (
          <p className="text-xs text-error mt-1">{marketErrors.operatingDays.message}</p>
        )}
      </div>

      {/* Pickup window + cutoff */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">Pickup Start</label>
          <input
            {...register(`markets.${index}.pickupStart`)}
            type="time"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              marketErrors?.pickupStart ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">Pickup End</label>
          <input
            {...register(`markets.${index}.pickupEnd`)}
            type="time"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              marketErrors?.pickupEnd ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-main mb-1.5">Cutoff (hrs before)</label>
          <input
            {...register(`markets.${index}.cutoffHours`)}
            type="number"
            min="0"
            className={cn(
              'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
              marketErrors?.cutoffHours ? 'border-error' : 'border-line focus:border-forest'
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default function StallProfilePage() {
  const { data: stall, isLoading } = useStallProfile()
  const { data: availableMarkets } = useAvailableMarkets()
  const updateStallMutation = useUpdateStallProfile()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stallProfileSchema),
    defaultValues: { stallName: '', description: '', markets: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'markets' })

  useEffect(() => {
    if (stall) {
      reset({
        stallName: stall.stallName,
        description: stall.description || '',
        markets: stall.markets,
      })
    }
  }, [stall, reset])

  // Watch the whole markets array so we can compute per-row availability and the "Add Market" guard.
  const watchedMarkets = watch('markets') || []
  const usedMarketIds = watchedMarkets.map((m) => m.marketId).filter(Boolean)
  const hasMarketsLeft = (availableMarkets?.length || 0) > usedMarketIds.length

  function addMarket() {
    append({
      id: `new-${Date.now()}`,
      marketId: '',
      marketName: '',
      operatingDays: [],
      pickupStart: '',
      pickupEnd: '',
      cutoffHours: 2,
    })
  }

  function onValid(data) {
    updateStallMutation.mutate(data)
  }

  if (isLoading) return <SectionSkeleton />

  return (
    <form onSubmit={handleSubmit(onValid)} className="max-w-3xl space-y-6">
      {/* Stall basics */}
      <Surface className="p-6">
        <h2 className="font-display text-lg font-medium text-text-main mb-1">Stall Information</h2>
        <p className="text-xs text-text-secondary mb-5">Your business name and description shown to customers.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Stall Name <span className="text-error">*</span>
            </label>
            <input
              {...register('stallName')}
              type="text"
              className={cn(
                'w-full h-10 px-3 rounded-md border bg-surface-cream text-sm outline-none',
                errors.stallName ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.stallName && <p className="text-xs text-error mt-1">{errors.stallName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1.5">
              Description <span className="text-text-secondary font-normal">(optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className={cn(
                'w-full px-3 py-2 rounded-md border bg-surface-cream text-sm outline-none resize-none',
                errors.description ? 'border-error' : 'border-line focus:border-forest'
              )}
            />
            {errors.description && <p className="text-xs text-error mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </Surface>

      {/* Markets */}
      <Surface className="p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg font-medium text-text-main">Markets You Sell At</h2>
          <Button type="button" size="sm" variant="secondary" onClick={addMarket} disabled={!hasMarketsLeft}>
            <Plus className="w-3.5 h-3.5" />
            Add Market
          </Button>
        </div>
        <p className="text-xs text-text-secondary mb-5">
          Add each market you attend, with its own days, pickup window, and order cutoff.
        </p>

        {errors.markets?.message && (
          <p className="text-xs text-error mb-3">{errors.markets.message}</p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => {
            // Exclude markets already chosen in OTHER rows, but keep this row's own current value visible.
            const selectedElsewhere = watchedMarkets
              .map((m, i) => (i !== index ? m.marketId : null))
              .filter(Boolean)

            const marketsForThisRow = (availableMarkets || []).filter(
              (m) => !selectedElsewhere.includes(m.id)
            )

            return (
              <MarketEntryCard
                key={field.id}
                index={index}
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                remove={remove}
                availableMarkets={marketsForThisRow}
              />
            )
          })}
        </div>

        {fields.length === 0 && (
          <div className="py-8 text-center text-sm text-text-secondary border border-dashed border-line rounded-lg">
            No markets added yet. Click "Add Market" to get started.
          </div>
        )}
      </Surface>

      <div className="flex justify-end">
        <Button type="submit" disabled={updateStallMutation.isPending}>
          {updateStallMutation.isPending ? 'Saving…' : 'Save Stall Profile'}
        </Button>
      </div>
    </form>
  )
}