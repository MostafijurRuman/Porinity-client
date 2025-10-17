import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiSave, FiImage, FiUser, FiMail, FiPhone, FiMapPin, FiFileText } from 'react-icons/fi'
import { toast } from 'react-toastify'
import useAuth from '../../Hooks/UseAuth'
import useAxiosSecure from '../../Hooks/useAxiosSecure'

const initialValues = {
  displayName: '',
  photoURL: '',
  phoneNumber: '',
  address: '',
  bio: '',
}

export default function EditProfile() {
  const { user, updateUserProfile, setUser } = useAuth() || {}
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const uid = user?.uid

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  })

  const profileQuery = useQuery({
    queryKey: ['userProfile', uid],
    enabled: Boolean(uid),
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/${uid}`)
      return data || {}
    },
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (!uid) return

    const profile = profileQuery.data || {}
    reset({
      displayName: profile.displayName || user?.displayName || '',
      photoURL: profile.photoURL || user?.photoURL || '',
      phoneNumber: profile.phoneNumber || '',
      address: profile.address || '',
      bio: profile.bio || '',
    })
  }, [uid, profileQuery.data, user?.displayName, user?.photoURL, reset])

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!uid) {
        throw new Error('You need to be logged in to update your profile.')
      }

      const payload = {
        uid,
        email: user?.email || '',
        displayName: values.displayName?.trim() || '',
        photoURL: values.photoURL?.trim() || '',
        phoneNumber: values.phoneNumber?.trim() || '',
        address: values.address?.trim() || '',
        bio: values.bio?.trim() || '',
      }

      const currentDisplayName = user?.displayName || ''
      const currentPhoto = user?.photoURL || ''

      if (
        updateUserProfile &&
        (payload.displayName !== currentDisplayName || payload.photoURL !== currentPhoto)
      ) {
        await updateUserProfile({
          displayName: payload.displayName || currentDisplayName,
          photoURL: payload.photoURL || null,
        })
        setUser?.((prev) => ({
          ...prev,
          displayName: payload.displayName || prev?.displayName || '',
          photoURL: payload.photoURL || null,
        }))
      }

      let serverMessage
      try {
        const { data } = await axiosSecure.put('/users/profile', payload)
        serverMessage = data?.message
      } catch (error) {
        if (error?.response?.status === 404) {
          const { data } = await axiosSecure.post('/users/profile', payload)
          serverMessage = data?.message
        } else {
          throw error
        }
      }

      return { message: serverMessage }
    },
    onSuccess: ({ message }) => {
      toast.success(message || 'Profile updated successfully')
      if (uid) {
        queryClient.invalidateQueries({ queryKey: ['userProfile', uid] })
      }
    },
    onError: (err) => {
      const message = err?.response?.data?.message || err?.message || 'Failed to update profile'
      toast.error(message)
    },
  })

  const onSubmit = (values) => {
    mutation.mutate(values)
  }

  const isLoadingProfile = profileQuery.isLoading || profileQuery.isFetching
  const photoPreview = watch('photoURL') || user?.photoURL || ''
  const watchedDisplayName = watch('displayName')
  const watchedPhoneNumber = watch('phoneNumber')

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-64px-280px)] flex items-center justify-center bg-[var(--color-bg-light)]">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[var(--color-bg-light)] text-center max-w-md">
          <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Please log in</h1>
          <p className="mt-2 text-sm text-[var(--color-medium-gray)]">
            You need an account to edit your profile details.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-64px-280px)] bg-[var(--color-bg-light)] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-bg-light)]">
          <div className="border-b border-[var(--color-light-purple)]/40 px-6 py-5">
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">Edit Profile</h1>
            <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
              Keep your personal information up to date so other members see the latest details.
            </p>
          </div>

          {profileQuery.isError && (
            <div className="mx-6 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              We could not load your saved profile details. You can still update them below.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 px-6 py-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                  <FiUser className="h-4 w-4" /> Display Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
                  {...register('displayName', { required: 'Display name is required' })}
                />
                {errors.displayName && (
                  <p className="mt-1 text-xs text-[var(--color-error)]">{errors.displayName.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                  <FiImage className="h-4 w-4" /> Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
                  {...register('photoURL', {
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i,
                      message: 'Enter a valid URL or leave empty',
                    },
                  })}
                />
                {errors.photoURL && (
                  <p className="mt-1 text-xs text-[var(--color-error)]">{errors.photoURL.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                  <FiPhone className="h-4 w-4" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +8801XXXXXXXXX"
                  className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
                  {...register('phoneNumber')}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                  <FiMapPin className="h-4 w-4" /> Address
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
                  {...register('address')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                  <FiMail className="h-4 w-4" /> Email
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  readOnly
                  className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)] px-3 py-2 text-sm text-[var(--color-medium-gray)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark-gray)]">
                  <FiFileText className="h-4 w-4" /> About You
                </label>
                <textarea
                  rows={6}
                  placeholder="Tell others a little about yourself"
                  className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
                  {...register('bio')}
                />
              </div>

              <div className="rounded-xl border border-[var(--color-light-purple)]/40 bg-[var(--color-bg-light)]/60 p-4 text-sm text-[var(--color-medium-gray)]">
                <p className="font-semibold text-[var(--color-primary)]">Profile preview</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-full border border-[var(--color-light-purple)]/50 bg-white">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-medium-gray)]">
                        No photo
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark-gray)]">
                      {watchedDisplayName || user.displayName || 'Your name'}
                    </p>
                    <p className="text-xs text-[var(--color-medium-gray)]">{user.email}</p>
                    {watchedPhoneNumber && (
                      <p className="text-xs text-[var(--color-medium-gray)]">{watchedPhoneNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 border-t border-[var(--color-light-purple)]/30 pt-4">
              {isLoadingProfile && (
                <p className="text-xs text-[var(--color-medium-gray)]">Loading saved profile details…</p>
              )}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-light-purple)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSave className="h-4 w-4" />
                {mutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
