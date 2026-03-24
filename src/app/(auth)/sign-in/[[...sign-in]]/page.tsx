// ✅ Skill: clerk/skills sugere usar SignIn component com appearance personalizado
import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sessão | theSmoothAuth Clerk',
  description: 'Inicie sessão na sua conta',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600">
            Introduza as suas credenciais para aceder à sua conta
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
                socialButtonsBlockButton:
                  'border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200',
                footerActionLink: 'text-blue-600 hover:text-blue-800 font-medium',
                formFieldLabel: 'text-gray-700 font-medium mb-1.5',
                identityPreviewEditButton: 'text-blue-600 hover:text-blue-800',
              },
              variables: {
                colorPrimary: '#2563eb',
                colorText: '#1f2937',
                colorTextSecondary: '#6b7280',
                colorBackground: '#ffffff',
                colorInputBackground: '#ffffff',
                colorInputText: '#1f2937',
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/home"
          />

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <a
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Registe-se aqui
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Ao iniciar sessão, concorda com os nossos{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}