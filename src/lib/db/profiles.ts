// ✅ Skill: supabase-postgres-best-practices sugere funções isoladas para operações de DB
import { createClient } from '@/lib/supabase/client';
import { auth } from '@clerk/nextjs/server';
import type { Profile, ProfileInsert, ProfileUpdate } from '@/lib/supabase/client';

/**
 * Obtém o perfil do utilizador atual
 * Lança erro se não autenticado ou se ocorrer erro na DB
 */
export async function getProfile(): Promise<Profile> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Não autenticado');
  }

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Perfil não existe, criar um básico
      console.log(`Perfil não encontrado para userId: ${userId}. Criando perfil básico...`);
      return await createProfile({
        clerk_user_id: userId,
        name: 'Utilizador',
        role: 'basic',
      });
    }
    throw new Error(`Erro ao obter perfil: ${error.message} (código: ${error.code})`);
  }

  return profile as unknown as Profile;
}

/**
 * Cria um novo perfil
 */
export async function createProfile(profileData: ProfileInsert): Promise<Profile> {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      ...profileData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar perfil: ${error.message}`);
  }

  return profile as unknown as Profile;
}

/**
 * Atualiza o perfil do utilizador atual
 */
export async function updateProfile(updates: ProfileUpdate): Promise<Profile> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Não autenticado');
  }

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar perfil: ${error.message}`);
  }

  return profile as unknown as Profile;
}

/**
 * Verifica se um perfil existe para o utilizador atual
 */
export async function profileExists(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return false;
    }
    throw new Error(`Erro ao verificar perfil: ${error.message}`);
  }

  return !!data;
}

/**
 * Obtém todos os perfis (apenas para admins)
 */
export async function getAllProfiles(): Promise<Profile[]> {
  // Verificar se é admin
  const currentProfile = await getProfile();
  if (currentProfile.role !== 'admin') {
    throw new Error('Acesso não autorizado');
  }

  const supabase = createClient();
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao obter perfis: ${error.message}`);
  }

  return (profiles as unknown as Profile[]) || [];
}

/**
 * Obtém um perfil por ID (apenas para admins ou próprio utilizador)
 */
export async function getProfileById(profileId: string): Promise<Profile> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Não autenticado');
  }

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) {
    throw new Error(`Erro ao obter perfil por ID: ${error.message}`);
  }

  // Verificar permissões
  const currentProfile = await getProfile();
  if ((currentProfile as any).role !== 'admin' && (profile as any).clerk_user_id !== userId) {
    throw new Error('Acesso não autorizado');
  }

  return profile as unknown as Profile;
}

/**
 * Elimina um perfil (apenas para admins)
 */
export async function deleteProfile(profileId: string): Promise<void> {
  // Verificar se é admin
  const currentProfile = await getProfile();
  if (currentProfile.role !== 'admin') {
    throw new Error('Acesso não autorizado');
  }

  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId);

  if (error) {
    throw new Error(`Erro ao eliminar perfil: ${error.message}`);
  }
}

/**
 * Pesquisa perfis por nome ou email (apenas para admins)
 */
export async function searchProfiles(query: string): Promise<Profile[]> {
  // Verificar se é admin
  const currentProfile = await getProfile();
  if (currentProfile.role !== 'admin') {
    throw new Error('Acesso não autorizado');
  }

  const supabase = createClient();
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`name.ilike.%${query}%,clerk_user_id.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Erro ao pesquisar perfis: ${error.message}`);
  }

  return (profiles as unknown as Profile[]) || [];
}

/**
 * Atualiza a role de um perfil (apenas para admins)
 */
export async function updateProfileRole(profileId: string, role: 'basic' | 'admin'): Promise<Profile> {
  // Verificar se é admin
  const currentProfile = await getProfile();
  if (currentProfile.role !== 'admin') {
    throw new Error('Acesso não autorizado');
  }

  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profileId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar role: ${error.message}`);
  }

  return profile as unknown as Profile;
}

/**
 * Obtém estatísticas dos perfis (apenas para admins)
 */
export async function getProfileStats(): Promise<{
  total: number;
  byRole: Record<string, number>;
  recentSignups: number;
}> {
  // Verificar se é admin
  const currentProfile = await getProfile();
  if (currentProfile.role !== 'admin') {
    throw new Error('Acesso não autorizado');
  }

  const supabase = createClient();

  // Contar total
  const { count: total, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Erro ao contar perfis: ${countError.message}`);
  }

  // Contar por role
  const { data: roleCounts, error: roleError } = await supabase
    .from('profiles')
    .select('role');

  if (roleError) {
    throw new Error(`Erro ao contar por role: ${roleError.message}`);
  }

  const byRole = (roleCounts as Array<{ role: string }> | null)?.reduce((acc, profile) => {
    acc[profile.role] = (acc[profile.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Contar inscrições recentes (últimos 7 dias)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentSignups, error: recentError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString());

  if (recentError) {
    throw new Error(`Erro ao contar inscrições recentes: ${recentError.message}`);
  }

  return {
    total: total || 0,
    byRole,
    recentSignups: recentSignups || 0,
  };
}