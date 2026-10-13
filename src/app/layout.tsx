import type { Metadata } from 'next'
import './globals.css'
import { PlatformShell } from '../components/platform-shell'

export const metadata: Metadata = {
  title: 'Apprendre le dev de A à Z',
  description: 'Comprendre le parcours de la donnée, pas seulement recopier du code.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><PlatformShell>{children}</PlatformShell></body></html>
}
