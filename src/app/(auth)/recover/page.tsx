// ✅ Skill: clerk/skills sugere página personalizada para recuperação de password
import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Recuperar Password | theSmoothAuth Clerk',
  description: 'Recupere o acesso à sua conta',
};

export default function RecoverPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recuperar Password
          </h1>
          <p className="text-gray-600">
            Introduza o seu email para receber instruções de recuperação
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200',
                formFieldInput:
                  'border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200',
                card: 'shadow-none bg-transparent',
                headerTitle: 'text-2xl font-bold text-gray-900',
                headerSubtitle: 'text-gray-600',
                footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
                formFieldLabel: 'text-gray-700 font-medium mb-1.5',
                formFieldErrorText: 'text-red-600 text-sm mt-1.5',
                formFieldSuccessText: 'text-green-600 text-sm mt-1.5',
              },
              variables: {
                colorPrimary: '#2563eb',
                colorText: '#1f2937',
                colorTextSecondary: '#6b7280',
                colorBackground: '#ffffff',
                colorInputBackground: '#ffffff',
                colorInputText: '#1f2937',
                colorDanger: '#dc2626',
                colorSuccess: '#059669',
              },
            }}
            routing="path"
            path="/recover"
            signUpUrl="/sign-up"
            signInUrl="/sign-in"
          />

          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Lembrou-se da password?{' '}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Inicie sessão aqui
              </Link>
            </p>
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Registe-se aqui
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            As instruções serão enviadas para o email associado à sua conta.
            Verifique a pasta de spam se não receber em alguns minutos.
          </p>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            ⚠️ Informações importantes
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>O link de recuperação é válido por 24 horas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Certifique-se de introduzir o email correto da sua conta</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contacte o suporte se continuar com problemas</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}