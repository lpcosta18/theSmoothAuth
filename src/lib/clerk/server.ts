// ✅ Skill: clerk/skills sugere helpers para operações server-side com Clerk
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/client';

/**
 * Obtém o utilizador atual com informações do perfil do Supabase
 */
export async function getCurrentUserWithProfile() {
  try {
    // Obter utilizador do Clerk
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // Obter perfil do Supabase
    const supabase = createClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_user_id' as any, user.id as any)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao obter perfil:', error);
    }

    return {
      clerkUser: user,
      profile: profile || null,
    };
  } catch (error) {
    console.error('Erro ao obter utilizador com perfil:', error);
    return null;
  }
}

/**
 * Verifica se o utilizador atual está autenticado
 * Retorna o userId ou redireciona para sign-in
 */
export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Não autenticado');
  }

  return userId;
}

/**
 * Obtém o perfil do utilizador atual
 * Lança erro se não autenticado
 */
export async function getCurrentUserProfile() {
  const userId = await requireAuth();
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id' as any, userId as any)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Perfil não existe, criar um básico
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          clerk_user_id: userId,
          name: 'Utilizador',
          role: 'basic',
        } as any)
        .select()
        .single();

      if (createError) {
        throw new Error('Erro ao criar perfil: ' + createError.message);
      }

      return newProfile;
    }
    throw new Error('Erro ao obter perfil: ' + error.message);
  }

  return profile;
}

/**
 * Verifica se o utilizador atual tem uma role específica
 */
export async function checkUserRole(allowedRoles: string[]) {
  try {
    const profile = await getCurrentUserProfile();
    return allowedRoles.includes((profile as any).role);
  } catch (error) {
    console.error('Erro ao verificar role:', error);
    return false;
  }
}

/**
 * Verifica se o utilizador atual é admin
 */
export async function isUserAdmin() {
  return await checkUserRole(['admin']);
}

/**
 * Obtém informações públicas do utilizador (para uso em componentes)
 */
export async function getPublicUserInfo(userId: string) {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, avatar_url, role')
      .eq('clerk_user_id' as any, userId as any)
      .single();

    if (error) {
      return null;
    }

    return {
      name: (profile as any).name,
      avatarUrl: (profile as any).avatar_url,
      role: (profile as any).role,
    };
  } catch (error) {
    console.error('Erro ao obter informações públicas:', error);
    return null;
  }
}

/**
 * Atualiza o perfil do utilizador atual
 */
export async function updateUserProfile(updates: {
  name?: string;
  avatar_url?: string | null;
  phone?: string | null;
}) {
  const userId = await requireAuth();
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('clerk_user_id' as any, userId as any)
    .select()
    .single();

  if (error) {
    throw new Error('Erro ao atualizar perfil: ' + error.message);
  }

  return profile;
}

/**
 * Obtém estatísticas do utilizador
 */
export async function getUserStats(userId: string) {
  const supabase = createClient();

  // Contar número de perfis (exemplo)
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }

  return {
    totalUsers: count || 0,
    // Adicionar mais estatísticas conforme necessário
  };
}

/**
 * Helper para criar contexto de autenticação em Server Components
 */
export async function createAuthContext() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return {
      isAuthenticated: false,
      userId: null,
      user: null,
      profile: null,
    };
  }

  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id' as any, userId as any)
    .single();

  return {
    isAuthenticated: true,
    userId,
    user,
    profile: profile || null,
  };
}