import { motion } from 'framer-motion';
import { useQuestStore } from '@/hooks/useQuestStore';

export function FavoriteButton({ questId }: { questId: string }) {
  const { isFavorite, toggleFavorite } = useQuestStore();
  const active = isFavorite(questId);

  return (
    <motion.button
      type="button"
      onClick={() => toggleFavorite(questId)}
      whileTap={{ scale: 0.82 }}
      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
      aria-pressed={active}
      aria-label={active ? 'Remove from favourites' : 'Save to favourites'}
      className={`tap-target -m-2 shrink-0 rounded-full p-2 transition-colors ${
        active ? 'text-medium' : 'text-faint hover:text-ink'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <motion.path
          d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          animate={{ scale: active ? [1, 1.25, 1] : 1 }}
          transition={{ duration: 0.32 }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        />
      </svg>
    </motion.button>
  );
}
