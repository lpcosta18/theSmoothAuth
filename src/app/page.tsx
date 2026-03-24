// ✅ Skill: next-best-practices sugere redirecionamento automático para login
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirecionar automaticamente para a página de login
  redirect('/sign-in');
}