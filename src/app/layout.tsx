// ✅ Skill: clerk/skills sugere envolver a aplicação com ClerkProvider no layout raiz
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ptPT } from '@clerk/localizations';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'theSmoothAuth Clerk',
  description: 'Aplicação de autenticação moderna com Clerk e Supabase',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptPT}>
      <html lang="pt-PT">
        <body className={inter.className}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'font-sans',
              duration: 4000,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}