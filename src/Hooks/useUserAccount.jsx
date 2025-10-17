import { useQuery } from '@tanstack/react-query';
import useAuth from './UseAuth';
import useAxiosSecure from './useAxiosSecure';

const FALLBACK_ACCOUNT = null;

export default function useUserAccount(overrideUid) {
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();

  const uid = overrideUid || user?.uid;

  const query = useQuery({
    queryKey: ['user-account', uid],
    enabled: Boolean(uid),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/users/${uid}`);
        return data || FALLBACK_ACCOUNT;
      } catch (error) {
        if (error?.response?.status === 404) {
          return FALLBACK_ACCOUNT;
        }
        throw error;
      }
    },
  });

  const account = query.data ?? FALLBACK_ACCOUNT;
  const isAdmin = account?.role === 'admin';

  return {
    account,
    isAdmin,
    isLoadingAccount: query.isLoading,
    isFetchingAccount: query.isFetching,
    isAccountError: query.isError,
    accountError: query.error,
    refetchAccount: query.refetch,
  };
}
