import { useQuery } from '@tanstack/react-query';
import useAuth from './UseAuth';
import useAxiosSecure from './useAxiosSecure';

const useMyBiodata = (options = {}) => {
  const { user } = useAuth() || {};
  const axiosSecure = useAxiosSecure();
  const uid = user?.uid;

  const query = useQuery({
    queryKey: ['myBiodata', uid],
    queryFn: async () => {
      try {
        const { data } = await axiosSecure.get(`/biodata/user/${uid}`);
        return data;
      } catch (error) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: Boolean(uid),
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return query;
};

export default useMyBiodata;
