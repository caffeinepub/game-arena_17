import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetHighScores() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['highScores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHighScores();
    },
    enabled: !!actor && !isFetching,
  });
}
