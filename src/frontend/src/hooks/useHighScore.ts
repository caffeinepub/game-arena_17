import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useHighScore() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: highScores = [] } = useQuery<bigint[]>({
    queryKey: ['highScores'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHighScores();
    },
    enabled: !!actor && !isFetching,
  });

  const submitScoreMutation = useMutation({
    mutationFn: async (score: number) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.submitScore(BigInt(score));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highScores'] });
    },
  });

  const highScore = highScores.length > 0 
    ? Math.max(...highScores.map(s => Number(s)))
    : 0;

  return {
    highScore,
    submitHighScore: submitScoreMutation.mutate,
    isSubmitting: submitScoreMutation.isPending,
  };
}
