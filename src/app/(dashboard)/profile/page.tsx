// ✅ Skill: next-best-practices sugere combinar Server e Client Components
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserMenu } from '@/components/user/UserMenu';
import { UserProfileForm } from '@/components/user/UserProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Database, Bell } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
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
                  className="text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent px-3 py-2 text-sm font-medium"
                >
                  Início
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-900 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium"
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
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Gestão de Perfil
            </h2>
            <p className="text-gray-600">
              Atualize as suas informações pessoais e preferências da conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize o seu nome, foto de perfil e informações de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserProfileForm />
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                  <CardDescription>
                    Detalhes da sua conta e configurações de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Autenticação Segura
                        </h3>
                        <p className="text-sm text-gray-600">
                          A sua autenticação é gerida pelo Clerk com encriptação de ponta a ponta
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Database className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Sincronização de Dados
                        </h3>
                        <p className="text-sm text-gray-600">
                          O seu perfil é automaticamente sincronizado entre Clerk e Supabase
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Bell className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Notificações
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receba notificações sobre atividades da conta e atualizações de segurança
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Profile Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado do Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Informações Pessoais
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          100%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Segurança da Conta
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Protegida
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Sincronização
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Ativa
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Links Rápidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="https://clerk.com/docs"
                        target="_blank"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Documentação do Clerk
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://supabase.com/docs"
                        target="_blank"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Documentação do Supabase
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/home"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Voltar ao Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Configurar Notificações
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Security Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Dicas de Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></div>
                      <span>Use uma password forte e única</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></div>
                      <span>Ative a autenticação de dois fatores</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></div>
                      <span>Verifique regularmente a atividade da conta</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mt-1.5 mr-2"></div>
                      <span>Mantenha o seu email de recuperação atualizado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}