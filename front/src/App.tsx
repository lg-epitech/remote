"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TvRemote } from "@/components/tv-remote"

function App() {
  const queryClient = new QueryClient();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <QueryClientProvider client={queryClient}>
        <TvRemote />
      </QueryClientProvider>
    </main>
  );
}

export default App;
