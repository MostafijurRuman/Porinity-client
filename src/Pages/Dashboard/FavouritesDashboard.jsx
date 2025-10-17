import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useFavorites from '../../Hooks/useFavorites';

export default function FavouritesDashboard() {
  const {
    favourites,
    isLoadingFavorites,
    isFetchingFavorites,
    removeFavorite,
    isRemovingFavorite,
  } = useFavorites();

  const handleRemove = async (biodataId) => {
    if (!biodataId) return;
    if (isRemovingFavorite) return;

    const result = await Swal.fire({
      title: 'Remove favourite?',
      text: 'This biodata will be removed from your favourites list.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await removeFavorite(biodataId);
      const message = response?.message || 'Biodata removed from favourites';
      toast.success(message);
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to remove favourite biodata';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-5">
      <header className="border-b border-[var(--color-light-purple)]/40 pb-4">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Favourites Biodata</h2>
        <p className="mt-1 text-sm text-[var(--color-medium-gray)]">
          All biodatas you have marked as favourite appear here. Manage your shortlist by removing entries you no longer need.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-light-purple)]/30 bg-white">
        <table className="min-w-full divide-y divide-[var(--color-light-purple)]/30">
          <thead className="bg-[var(--color-bg-light)]/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Biodata ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Permanent Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-medium-gray)]">
                Occupation
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-light-purple)]/20">
            {favourites.length === 0 && !isLoadingFavorites && !isFetchingFavorites && (
              <tr>
                <td className="px-4 py-6 text-sm text-[var(--color-medium-gray)]" colSpan={5}>
                  You have not added any favourites yet.
                </td>
              </tr>
            )}

            {favourites.map((item) => (
              <tr key={item.biodataId}>
                <td className="px-4 py-3 text-sm font-medium text-[var(--color-dark-gray)]">{item.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-medium-gray)]">{item.biodataId}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-medium-gray)]">{item.permanentAddress || 'Not provided'}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-medium-gray)]">{item.occupation || 'Not provided'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemove(item.biodataId)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50"
                    disabled={isRemovingFavorite}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}

            {(isLoadingFavorites || isFetchingFavorites) && (
              <tr>
                <td className="px-4 py-6 text-sm text-[var(--color-medium-gray)]" colSpan={5}>
                  Loading favourites…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
