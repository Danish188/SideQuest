import { Link } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { SideQuestMascot } from '@/components/mascot/SideQuestMascot';

export function NotFoundPage() {
  return (
    <PageShell>
      <div className="flex flex-col items-start">
        <SideQuestMascot state="surprised" size={120} />
        <h1 className="sq-display mt-6 text-5xl sm:text-6xl">Nothing here.</h1>
        <p className="mt-4 text-lg text-muted">
          Not every side path leads somewhere. This one does.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center rounded-2xl bg-accent px-6 font-medium text-accent-ink shadow-lift transition-[filter] hover:brightness-110"
        >
          Back to the quest
        </Link>
      </div>
    </PageShell>
  );
}
