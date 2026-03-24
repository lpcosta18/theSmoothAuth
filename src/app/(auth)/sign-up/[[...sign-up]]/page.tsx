// ✅ Skill: clerk/skills sugere usar SignUp component com appearance consistente
import { SignUp } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar Conta | theSmoothAuth Clerk',
  description: 'Crie uma nova conta para começar a usar a aplicação',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Nova Conta
          </h1>
          <p className="text-gray-600">
            Junte-se a nós e comece a sua jornada
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <SignUp
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
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/home"
            unsafeMetadata={{
              signup_source: 'thesmoothauth_clerk',
            }}
          />

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <a
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Inicie sessão aqui
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Ao registar-se, concorda com os nossos{' '}
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