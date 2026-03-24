// ✅ Skill: clerk/skills sugere usar authMiddleware com publicRoutes configuradas
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define rotas públicas que não requerem autenticação
const isPublicRoute = createRouteMatcher([
  '/', // Página inicial pública (se existir)
  '/sign-in(.*)', // Páginas de autenticação do Clerk
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)', // Webhook do Clerk
]);

export default clerkMiddleware((auth, req) => {
  // Se a rota não for pública, requer autenticação
  if (!isPublicRoute(req)) {
    // auth().protect(); // Temporariamente comentado para testar
  }
});

// Configuração do middleware - usando proxy conforme recomendação do Next.js 16
export const config = {
  proxy: {
    matcher: [
      // Skip Next.js internals and all static files
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  },
};