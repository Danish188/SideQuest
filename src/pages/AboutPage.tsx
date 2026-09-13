import { PageShell } from '@/components/layout/PageShell';
import { SideQuestMascot } from '@/components/mascot/SideQuestMascot';
import { QUESTS } from '@/data/quests';

const STACK = ['React', 'TypeScript', 'Vite'];

export function AboutPage() {
  return (
    <PageShell>
      <div className="flex items-end gap-4">
        <SideQuestMascot state="idle" size={96} />
        <h1 className="sq-display pb-4 text-4xl sm:text-5xl">About</h1>
      </div>

      <div className="mt-8 space-y-6 text-pretty text-lg leading-relaxed text-muted">
        <p className="text-ink">
          SideQuest is for those moments when you want to do something, but can&rsquo;t decide what.
        </p>

        <p>
          Tell it how long you have, what mood you are in, where you are and how far you want to
          take it. It gives you one thing to do, not a list, not a feed, not twelve options to
          deliberate over. One. You can accept it, or ask for another.
        </p>

        <p>
          There are {QUESTS.length} quests in the catalogue, all written by hand. Nothing in there is
          &ldquo;go for a walk&rdquo;.
        </p>

        <p>
          Recommendations run in your browser by default, using a local scoring engine over that
          catalogue. You can switch on AI quests in Stats to have one written for your exact answers
          instead, and if that is ever slow or unavailable the catalogue quietly takes over.
        </p>

        <p>
          There is no account and no sign-up. Your history, favourites and streak live in this
          browser&rsquo;s storage and nowhere else.
        </p>
      </div>

      <dl className="mt-14 space-y-6 border-t border-line pt-8">
        <div className="flex flex-wrap items-baseline gap-x-4">
          <dt className="sq-eyebrow w-24">Built by</dt>
          <dd>
            <a
              href="https://danishelahi.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              Danish Elahi
            </a>
            <span className="ml-2 text-faint">danishelahi.com</span>
          </dd>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-4">
          <dt className="sq-eyebrow w-24">Built with</dt>
          <dd className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-line px-2.5 py-1 font-mono text-xs text-muted"
              >
                {item}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </PageShell>
  );
}
