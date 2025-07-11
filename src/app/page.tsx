import { ServerPrefetchDemo } from '@/components/server-prefetch';
import { ClientSuspenseDemo } from '@/components/client-suspense';

export default function Home() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold mb-2">Welcome to PPR Demo</h1>
        <p className="text-xl text-gray-600">
          Experience the power of Partial Pre-rendering with real-time data fetching
        </p>
      </header>

      <main className="space-y-12">
        <section>
          <ServerPrefetchDemo />
        </section>

        <section>
          <ClientSuspenseDemo />
        </section>
      </main>

      <footer className="mt-12 pt-8 border-t text-center text-gray-500">
        <p>Built with Next.js 15, tRPC v11, TanStack Query, and shadcn/ui</p>
      </footer>
    </div>
  );
}
