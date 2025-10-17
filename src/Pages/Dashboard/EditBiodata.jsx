import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { FiSave, FiHash } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useAuth from '../../Hooks/UseAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useMyBiodata from '../../Hooks/useMyBiodata';

const biodataTypeOptions = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

const heightOptions = [
  "4'10\"",
  "5'0\"",
  "5'2\"",
  "5'4\"",
  "5'6\"",
  "5'8\"",
  "5'10\"",
  "6'0\"",
  "6'2\"",
];

const weightOptions = ['45kg', '50kg', '55kg', '60kg', '65kg', '70kg', '75kg', '80kg'];

const occupationOptions = [
  'Engineer',
  'Doctor',
  'Business Owner',
  'Teacher',
  'Government Service',
  'Student',
  'Freelancer',
  'Other',
];

const raceOptions = ['Fair', 'Medium', 'Wheatish', 'Olive', 'Brown', 'Dark'];

const divisionOptions = ['Dhaka', 'Chattagra', 'Rangpur', 'Barisal', 'Khulna', 'Mymensingh', 'Sylhet'];

const initialValues = {
  biodataType: '',
  name: '',
  profileImage: '',
  dateOfBirth: '',
  height: '',
  weight: '',
  age: '',
  occupation: '',
  race: '',
  fatherName: '',
  motherName: '',
  permanentDivision: '',
  presentDivision: '',
  expectedPartnerAge: '',
  expectedPartnerHeight: '',
  expectedPartnerWeight: '',
  contactEmail: '',
  mobileNumber: '',
  about: '',
};

const normalizePayload = (payload) => ({
  ...payload,
  age: payload.age ? Number(payload.age) : null,
});

export default function EditBiodata() {
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const requesterEmail = user?.email || '';

  const {
    data: biodata,
    isLoading,
    isFetching,
    refetch,
  } = useMyBiodata({
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (biodata) {
      reset({
        ...initialValues,
        ...biodata,
        age: biodata?.age ? String(biodata.age) : '',
        contactEmail: requesterEmail,
      });
    } else {
      reset({ ...initialValues, contactEmail: requesterEmail });
    }
  }, [biodata, reset, requesterEmail]);

  const hasExistingBiodata = useMemo(() => Boolean(biodata && biodata.biodataId), [biodata]);

  const mutation = useMutation({
    mutationFn: async (formValues) => {
      const payload = normalizePayload({
        ...formValues,
        uid: user?.uid,
        contactEmail: requesterEmail,
      });

      const { data } = await axiosSecure.post('/biodata', payload);
      return data;
    },
    onSuccess: (response) => {
      toast.success(response?.message || 'Biodata saved successfully');
      refetch();
    },
    onError: (err) => {
      const message = err?.response?.data?.message || 'Failed to save biodata. Please review the form.';
      toast.error(message);
    },
  });

  const onSubmit = (values) => {
    if (!user?.uid) {
      toast.error('You must be logged in to save biodata');
      return;
    }

    mutation.mutate(values);
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Edit Biodata</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          Provide accurate details to publish your biodata. All required fields must be completed before publishing.
        </p>
        {hasExistingBiodata && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-bg-light)]/70 px-4 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <FiHash /> Current Biodata ID: {biodata?.biodataId}
          </p>
        )}
      </header>

      <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Biodata Type *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('biodataType', { required: 'Please select a biodata type' })}
            >
              <option value="">Select type</option>
              {biodataTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.biodataType && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.biodataType.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Name *</label>
            <input
              type="text"
              placeholder="Full name"
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Profile Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('profileImage')}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Date of Birth *</label>
            <input
              type="date"
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('dateOfBirth', { required: 'Date of birth is required' })}
            />
            {errors.dateOfBirth && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.dateOfBirth.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Height *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('height', { required: 'Please select height' })}
            >
              <option value="">Select height</option>
              {heightOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.height && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.height.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Weight *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('weight', { required: 'Please select weight' })}
            >
              <option value="">Select weight</option>
              {weightOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.weight && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.weight.message}</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Age *</label>
            <input
              type="number"
              min={18}
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('age', {
                required: 'Age is required',
                min: { value: 18, message: 'Age must be at least 18' },
              })}
            />
            {errors.age && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.age.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Occupation *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('occupation', { required: 'Please select occupation' })}
            >
              <option value="">Select occupation</option>
              {occupationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.occupation && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.occupation.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Race *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('race', { required: 'Please select race/complexion' })}
            >
              <option value="">Select complexion</option>
              {raceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.race && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.race.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Father's Name</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('fatherName')}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Mother's Name</label>
            <input
              type="text"
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('motherName')}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Permanent Division *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('permanentDivision', { required: 'Select permanent division' })}
            >
              <option value="">Select division</option>
              {divisionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.permanentDivision && (
              <p className="mt-1 text-xs text-[var(--color-error)]">{errors.permanentDivision.message}</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Present Division *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('presentDivision', { required: 'Select present division' })}
            >
              <option value="">Select division</option>
              {divisionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.presentDivision && (
              <p className="mt-1 text-xs text-[var(--color-error)]">{errors.presentDivision.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Expected Partner Age</label>
            <input
              type="text"
              placeholder="e.g. 25-30"
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('expectedPartnerAge')}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Expected Partner Height *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('expectedPartnerHeight', { required: 'Select expected partner height' })}
            >
              <option value="">Select height</option>
              {heightOptions.map((option) => (
                <option key={`partner-height-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.expectedPartnerHeight && (
              <p className="mt-1 text-xs text-[var(--color-error)]">{errors.expectedPartnerHeight.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Expected Partner Weight *</label>
            <select
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm"
              {...register('expectedPartnerWeight', { required: 'Select expected partner weight' })}
            >
              <option value="">Select weight</option>
              {weightOptions.map((option) => (
                <option key={`partner-weight-${option}`} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.expectedPartnerWeight && (
              <p className="mt-1 text-xs text-[var(--color-error)]">{errors.expectedPartnerWeight.message}</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Contact Email</label>
            <input
              type="email"
              readOnly
              className="mt-2 w-full cursor-not-allowed rounded-lg border border-[var(--color-light-purple)]/50 bg-[var(--color-bg-light)]/60 px-3 py-2 text-sm font-medium text-[var(--color-primary)]"
              {...register('contactEmail')}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--color-dark-gray)]">Mobile Number *</label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
              {...register('mobileNumber', { required: 'Mobile number is required' })}
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-xs text-[var(--color-error)]">{errors.mobileNumber.message}</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[var(--color-dark-gray)]">About / Story</label>
          <textarea
            rows={4}
            className="mt-2 w-full rounded-lg border border-[var(--color-light-purple)]/50 bg-white px-3 py-2 text-sm"
            placeholder="Share a short story about yourself..."
            {...register('about')}
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-light-purple)]/30 pt-5">
          <p className="text-xs text-[var(--color-medium-gray)]">
            Complete all required fields before publishing. You can update the biodata anytime.
          </p>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-accent)] to-[var(--color-light-pink)] px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FiSave /> {mutation.isPending ? 'Saving…' : 'Save & Publish Now'}
          </button>
        </div>
      </form>

      {(isLoading || isFetching) && (
        <div className="rounded-2xl border border-[var(--color-light-purple)]/40 bg-[var(--color-bg-light)]/50 p-6 text-sm text-[var(--color-medium-gray)]">
          Loading current biodata…
        </div>
      )}
    </div>
  );
}
