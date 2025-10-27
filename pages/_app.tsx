import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider} from 'react-query';
import Head from 'next/head';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';


const queryClient = new QueryClient();

export default function App({Component, pageProps }: AppProps<{ initialSession: Session}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  return (
    <>
      <Head>
          <title>FilmFront</title>
          <meta name="title" content="MyMovies" />
          <meta name="description" content="Discover new movies/tvshows/people all in one place. Dont forget to rate, watchlist, complete trivia and create lists!" />
          <meta name="keywords" content="movies, tvshows, actors, actresses, lists, mymovies, trivia, watchlist, ratings" />
          <meta name="robots" content="index, follow" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="language" content="English" />
          <meta name="revisit-after" content="10 days" />
          <meta name="author" content="Matthew Harvey" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/movie.png" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <QueryClientProvider client={queryClient}>
          <div className='bg-black w-full text-white min-h-screen'>
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </SessionContextProvider>
    </>
  )
}
