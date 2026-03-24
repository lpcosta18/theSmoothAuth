// ✅ Skill: next-best-practices sugere usar Server Components para dados do utilizador
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/user/UserMenu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function HomePage() {
  // Verificar autenticação do utilizador
  const { userId } = await auth();

  // Se não estiver autenticado, redirecionar para sign-in
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  theSmoothAuth Clerk
                </h1>
              </div>
              <nav className="ml-10 flex space-x-8">
                <Link
                  href="/home"
                  className="text-gray-900 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium"
                >
                  Início
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent px-3 py-2 text-sm font-medium"
                >
                  Perfil
                </Link>
                <Link
                  href="#"
                  className="text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent px-3 py-2 text-sm font-medium"
                >
                  Definições
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600">
              A sua conta está configurada e pronta a usar. Explore as funcionalidades disponíveis.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sessão Ativa
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Online</div>
                <p className="text-xs text-gray-500">
                  Autenticado via Clerk
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Perfil Completo
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-gray-500">
                  Dados sincronizados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Segurança
                </CardTitle>
                <Settings className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Protegido</div>
                <p className="text-xs text-gray-500">
                  Autenticação Clerk + Supabase
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Último Acesso
                </CardTitle>
                <Calendar className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Hoje</div>
                <p className="text-xs text-gray-500">
                  Sessão ativa
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Perfil</CardTitle>
                <CardDescription>
                  Atualize as suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Mantenha o seu perfil atualizado com as informações mais recentes.
                  Pode editar o seu nome, foto de perfil e número de telefone.
                </p>
                <Button asChild className="w-full">
                  <Link href="/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    Gerir Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Configure as definições de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  A sua autenticação é gerida pelo Clerk. Pode alterar a password,
                  configurar autenticação de dois fatores e gerir dispositivos.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="https://clerk.com" target="_blank">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Painel Clerk
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Sobre a Aplicação</CardTitle>
                <CardDescription>
                  Tecnologias e funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Stack Tecnológica
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Next.js 16 com App Router</li>
                      <li>Clerk para autenticação</li>
                      <li>Supabase como base de dados PostgreSQL</li>
                      <li>shadcn/ui para componentes de interface</li>
                      <li>TypeScript para type safety</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Funcionalidades Principais
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Autenticação segura com Clerk</li>
                      <li>Sincronização automática Clerk → Supabase</li>
                      <li>Gestão de perfil de utilizador</li>
                      <li>Proteção de rotas com middleware</li>
                      <li>Validação de formulários com Zod</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}