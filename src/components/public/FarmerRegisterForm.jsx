import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Plus, Trash2, Navigation } from 'lucide-react'
import { farmerRegisterSchema, FARMER_STEP_FIELDS } from '@/schemas/authSchema'
import { registerFarmerRequest } from '@/services/authService'
import { toast } from 'sonner'
import clsx from 'clsx'
import { useMarketsList } from '@/features/public/useMarketsList'
import LocationPicker from '@/components/admin/LocationPicker'
import { useGeolocation } from '@/hooks/useGeolocation'
import { reverseGeocode } from '@/services/geocodingService'


const STEP_LABELS = ['Account', 'Stall Info', 'Markets', 'Location']

function inputClass(hasError) {
  return `w-full rounded-xl border bg-surface-cream px-3.5 py-2.5 text-sm outline-none transition-colors ${hasError ? 'border-error focus:border-error' : 'border-line focus:border-forest'
    }`
}

export default function FarmerRegisterForm() {

  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(farmerRegisterSchema),
    defaultValues: { markets: [], locationAddress: '' },
  })
  const lat = watch('lat')
  const lng = watch('lng')

  const { location: browserLocation, status: geoStatus, requestLocation } = useGeolocation()

  async function useMyLocation() {
    requestLocation()
  }

  useEffect(() => {
    if (browserLocation && geoStatus === 'granted') {
      const [detectedLat, detectedLng] = browserLocation
      setValue('lat', detectedLat, { shouldValidate: true })
      setValue('lng', detectedLng, { shouldValidate: true })
      reverseGeocode(detectedLat, detectedLng)
        .then((address) => setValue('locationAddress', address, { shouldValidate: true }))
        .catch(() => { })
    }
  }, [browserLocation, geoStatus])

  const { fields, append, remove } = useFieldArray({ control, name: 'markets' })
  const { data: allMarkets, isLoading: marketsLoading } = useMarketsList()

  const watchedMarkets = watch('markets') || []

  function addMarketRow() {
    append({
      marketId: '',
      operatingDays: [],
      pickupStart: '',
      pickupEnd: '',
      cutoffHours: 2,
    })
  }

  function toggleMarketDay(index, day) {
    const current = watchedMarkets[index]?.operatingDays || []
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day]
    setValue(`markets.${index}.operatingDays`, next, { shouldValidate: true })
  }



  async function handleNext() {
    if (isNavigating || isSubmitting) return
    setIsNavigating(true)
    const valid = await trigger(FARMER_STEP_FIELDS[step])
    if (valid) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))
    setIsNavigating(false)
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function onSubmit(data) {
    setIsSubmitting(true)
    try {
      const { confirmPassword, locationAddress, lat, lng, ...rest } = data
      await registerFarmerRequest({
        ...rest,
        location: { address: locationAddress, lat, lng },
      })
      setSuccess(true)
      toast.success('Application submitted!')
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Registration failed. Try again.'
      toast.error(message)
    }
    setIsSubmitting(false)
  }

  if (success) {
    return (
      <div className="text-center bg-surface-cream border border-line rounded-3xl p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest mx-auto mb-4">
          <CheckCircle2 size={28} />
        </span>
        <h2 className="font-display text-xl font-semibold text-text-main mb-2">
          Application submitted
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Your stall is pending admin approval. We'll notify you once it's approved —
          you won't be able to log in until then.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-medium text-white hover:bg-forest-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={clsx(
                  'h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 transition-colors',
                  i < step
                    ? 'bg-forest border-forest text-white'
                    : i === step
                      ? 'border-forest text-forest'
                      : 'border-line text-text-secondary'
                )}
              >
                {i < step ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className={clsx('text-[10px] mt-1 text-center', i === step ? 'text-forest font-medium' : 'text-text-secondary')}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={clsx('h-0.5 flex-1 -mt-4', i < step ? 'bg-forest' : 'bg-line')} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {step === 0 && (
          <>
            <h2 className="font-display text-lg font-semibold text-text-main mb-1">Your account</h2>
            <p className="text-sm text-text-secondary mb-4">Basic details to create your login.</p>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Full name</label>
              <input {...register('name')} placeholder="Bilal Ahmed" className={inputClass(errors.name)} />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Email address</label>
              <input type="email" {...register('email')} placeholder="you@example.com" className={inputClass(errors.email)} />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">Phone</label>
                <input {...register('phone')} placeholder="0300-1234567" className={inputClass(errors.phone)} />
                {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">Home address</label>
                <input {...register('address')} placeholder="Karachi" className={inputClass(errors.address)} />
                {errors.address && <p className="text-error text-xs mt-1">{errors.address.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">Password</label>
                <input type="password" {...register('password')} placeholder="••••••••" className={inputClass(errors.password)} />
                {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-main mb-1.5">Confirm</label>
                <input type="password" {...register('confirmPassword')} placeholder="••••••••" className={inputClass(errors.confirmPassword)} />
                {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </>
        )}
        {/* Step 1 — Stall Info */}
        {step === 1 && (
          <>
            <h2 className="font-display text-lg font-semibold text-text-main mb-1">Your stall</h2>
            <p className="text-sm text-text-secondary mb-4">Tell customers what you sell and who to contact.</p>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Stall name</label>
              <input {...register('stallName')} placeholder="Fresh Farms" className={inputClass(errors.stallName)} />
              {errors.stallName && <p className="text-error text-xs mt-1">{errors.stallName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">Contact person</label>
              <input {...register('contactPerson')} placeholder="Bilal Ahmed" className={inputClass(errors.contactPerson)} />
              {errors.contactPerson && <p className="text-error text-xs mt-1">{errors.contactPerson.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-main mb-1.5">
                Description <span className="text-text-secondary font-normal">(optional)</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Organic vegetables and seasonal fruit, harvested weekly..."
                className={`${inputClass(errors.description)} resize-none`}
              />
              {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
            </div>
          </>
        )}

        {/* Step 2 — Markets & Schedule */}
        {step === 2 && (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-lg font-semibold text-text-main">Markets & schedule</h2>
              <button
                type="button"
                onClick={addMarketRow}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-forest hover:border-forest transition-colors"
              >
                <Plus size={13} />
                Add Market
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Pick each market you'll sell at, the days you'll be there, and your pickup window.
            </p>

            {errors.markets?.message && (
              <p className="text-error text-xs mb-3">{errors.markets.message}</p>
            )}

            {marketsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-bg-ivory rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const selectedMarketId = watchedMarkets[index]?.marketId
                  const selectedMarket = allMarkets?.find((m) => m._id === selectedMarketId)
                  const availableDaysForThisMarket = selectedMarket?.operatingDays || []
                  const rowErrors = errors.markets?.[index]

                  return (
                    <div key={field.id} className="border border-line rounded-xl p-4 space-y-3.5 relative bg-surface-cream">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-error/5 text-error"
                        aria-label="Remove market"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="pr-8">
                        <label className="block text-xs font-semibold text-text-main mb-1.5">Market</label>
                        <select
                          {...register(`markets.${index}.marketId`)}
                          onChange={(e) => {
                            setValue(`markets.${index}.marketId`, e.target.value, { shouldValidate: true })
                            setValue(`markets.${index}.operatingDays`, [], { shouldValidate: true })
                          }}
                          className={inputClass(rowErrors?.marketId)}
                        >
                          <option value="">Select a market…</option>
                          {allMarkets?.map((m) => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                        {rowErrors?.marketId && <p className="text-error text-xs mt-1">{rowErrors.marketId.message}</p>}
                      </div>

                      {selectedMarket && (
                        <div>
                          <label className="block text-xs font-semibold text-text-main mb-1.5">
                            Operating days <span className="text-text-secondary font-normal">(only {selectedMarket.name}'s open days)</span>
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {availableDaysForThisMarket.map((day) => {
                              const isSelected = (watchedMarkets[index]?.operatingDays || []).includes(day)
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => toggleMarketDay(index, day)}
                                  className={clsx(
                                    'px-3 py-1.5 rounded-md border text-xs font-medium transition-colors',
                                    isSelected
                                      ? 'bg-forest text-white border-forest'
                                      : 'bg-surface-cream text-text-secondary border-line hover:border-forest/40'
                                  )}
                                >
                                  {day}
                                </button>
                              )
                            })}
                          </div>
                          {rowErrors?.operatingDays && (
                            <p className="text-error text-xs mt-1">{rowErrors.operatingDays.message}</p>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-main mb-1.5">Pickup start</label>
                          <input
                            type="time"
                            {...register(`markets.${index}.pickupStart`)}
                            className={inputClass(rowErrors?.pickupStart)}
                          />
                          {rowErrors?.pickupStart && <p className="text-error text-xs mt-1">{rowErrors.pickupStart.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-main mb-1.5">Pickup end</label>
                          <input
                            type="time"
                            {...register(`markets.${index}.pickupEnd`)}
                            className={inputClass(rowErrors?.pickupEnd)}
                          />
                          {rowErrors?.pickupEnd && <p className="text-error text-xs mt-1">{rowErrors.pickupEnd.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-main mb-1.5">Cutoff (hrs)</label>
                          <input
                            type="number"
                            min="0"
                            {...register(`markets.${index}.cutoffHours`, { valueAsNumber: true })}
                            className={inputClass(rowErrors?.cutoffHours)}
                          />
                          {rowErrors?.cutoffHours && <p className="text-error text-xs mt-1">{rowErrors.cutoffHours.message}</p>}
                        </div>
                      </div>

                      {selectedMarket && (
                        <p className="text-[11px] text-text-secondary">
                          {selectedMarket.name} is open {selectedMarket.timings?.open}–{selectedMarket.timings?.close}
                        </p>
                      )}
                    </div>
                  )
                })}

                {fields.length === 0 && (
                  <div className="py-8 text-center text-sm text-text-secondary border border-dashed border-line rounded-xl">
                    No markets added yet. Click "Add Market" to get started.
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {/* Step 3 — Location */}
        {step === 3 && (
          <>
            <h2 className="font-display text-lg font-semibold text-text-main mb-1">Stall location</h2>
            <p className="text-sm text-text-secondary mb-4">
              Search for your stall's address, or click/drag the pin on the map.
            </p>
            <button
              type="button"
              onClick={useMyLocation}
              className="flex items-center gap-1.5 text-xs font-medium text-forest hover:underline mb-3"
            >
              <Navigation size={12} />
              {geoStatus === 'loading' ? 'Locating…' : 'Use my current location'}
            </button>
            <Controller
              name="lat"
              control={control}
              render={() => (
                <LocationPicker
                  value={{ lat, lng, address: watch('locationAddress') }}
                  onChange={({ lat, lng, address }) => {
                    setValue('lat', lat, { shouldValidate: true })
                    setValue('lng', lng, { shouldValidate: true })
                    setValue('locationAddress', address, { shouldValidate: true })
                  }}
                />
              )}
            />

            {isSubmitted && errors.locationAddress && <p className="text-error text-xs mt-1">{errors.locationAddress.message}</p>}
            {isSubmitted && errors.lat && <p className="text-error text-xs mt-1">{errors.lat.message}</p>}
            {isSubmitted && errors.lng && <p className="text-error text-xs mt-1">{errors.lng.message}</p>}
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          {step > 0 ? (
            <button type="button" onClick={handleBack} className="text-sm font-medium text-text-secondary hover:text-text-main">
              Back
            </button>
          ) : <span />}

          {step < STEP_LABELS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isNavigating}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || isNavigating}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-white hover:bg-forest-dark transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}