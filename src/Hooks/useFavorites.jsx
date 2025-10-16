import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from './UseAuth';
import useAxiosSecure from './useAxiosSecure';

/**
 * Hook to manage favourite biodatas for the authenticated user (or a supplied uid).
 * Provides the favourites list plus helper mutations to add/remove entries.
 */
const useFavorites = (overrideUid) => {
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const uid = overrideUid || user?.uid;

  const favoritesQuery = useQuery({
    queryKey: ['favorites', uid],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/favorites/${uid}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(uid),
    staleTime: 5 * 60 * 1000, // cache favourites for 5 minutes
  });

  const favourites = useMemo(() => favoritesQuery.data || [], [favoritesQuery.data]);

  const addMutation = useMutation({
    mutationFn: async (biodataId) => {
      if (!uid) {
        throw new Error('Cannot add favourites without a user id');
      }
      const { data } = await axiosSecure.post('/favorites', { uid, biodataId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', uid] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (biodataId) => {
      if (!uid) {
        throw new Error('Cannot remove favourites without a user id');
      }
      const { data } = await axiosSecure.delete('/favorites', { data: { uid, biodataId } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', uid] });
    },
  });

  return {
    favourites,
    favouritesIds: useMemo(() => favourites.map((item) => item.biodataId), [favourites]),
    favoritesCount: favourites.length,
    hasFavorites: favourites.length > 0,
    isLoadingFavorites: favoritesQuery.isLoading,
    isFetchingFavorites: favoritesQuery.isFetching,
    isFavoritesError: favoritesQuery.isError,
    favoritesError: favoritesQuery.error,
    refetchFavorites: favoritesQuery.refetch,
    addFavorite: addMutation.mutateAsync,
    isAddingFavorite: addMutation.isPending,
    removeFavorite: removeMutation.mutateAsync,
    isRemovingFavorite: removeMutation.isPending,
  };
};

export default useFavorites;
