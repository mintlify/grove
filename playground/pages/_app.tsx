import '../styles/globals.css'
import type { AppProps } from 'next/app'

function Playground({ Component, pageProps }: AppProps) {
  return <><Component {...pageProps} /></>
}

export default Playground
