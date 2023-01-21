import '#styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { DashboardProvider } from '#lib/front/dashboard-context';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <link rel="icon" type="image/svg" href="/icon.svg" />
      <title>snatch</title>
    </Head>
    <Toaster />
    <DashboardProvider>
      <Component {...pageProps} />
    </DashboardProvider>
  </>
}
