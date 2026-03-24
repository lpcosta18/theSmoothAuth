// ✅ Skill: next-best-practices sugere usar Server Actions para mutações de dados
'use server';

import { auth } from '@clerk/nextjs/server';
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/schemas/profile';
import { getProfile, updateProfile as updateProfileDb } from '@/lib/db/profiles';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/supabase/client';

/**
 * Server Action: Obtém o perfil do utilizador atual
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const profile = await getProfile();
    return profile;
  } catch (error) {
    console.error('Erro ao obter perfil:', error);

    // Se for erro de perfil não encontrado, retornar null em vez de lançar erro
    if (error instanceof Error) {
      if (error.message.includes('PGRST116')) {
        console.log('Perfil não encontrado na base de dados. Retornando null.');
        return null;
      }
      if (error.message.includes('Não autenticado')) {
        console.log('Utilizador não autenticado. Retornando null.');
        return null;
      }
    }

    // Para outros erros, lançar exceção com mais detalhes
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Não foi possível obter o perfil: ${errorMessage}`);
  }
}

/**
 * Server Action: Atualiza o perfil do utilizador atual
 */
export async function updateProfile(formData: UpdateProfileFormData): Promise<Profile> {
  try {
    // Validar dados com Zod
    const validatedData = updateProfileSchema.parse(formData);

    // Verificar autenticação
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Não autenticado');
    }

    // Atualizar perfil na base de dados
    const updatedProfile = await updateProfileDb({
      name: validatedData.name,
      phone: validatedData.phone || null,
      avatar_url: validatedData.avatar_url || null,
    });

    return updatedProfile;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);

    // Retornar erros específicos para o cliente
    if (error instanceof Error) {
      if (error.message.includes('Não autenticado')) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      if (error.message.includes('validação') || error.message.includes('ZodError')) {
        throw new Error('Dados inválidos. Por favor, verifique os campos.');
      }
      if (error.message.includes('PGRST116')) {
        throw new Error('Perfil não encontrado. Por favor, recarregue a página.');
      }

      // Para outros erros, fornecer mais detalhes
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    throw new Error('Não foi possível atualizar o perfil. Por favor, tente novamente.');
  }
}

/**
 * Server Action: Verifica se o utilizador tem perfil
 */
export async function checkProfileExists(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return false;
    }

    // Tenta obter o perfil - se falhar com PGRST116, não existe
    await getProfile();
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('PGRST116')) {
      return false;
    }
    throw error;
  }
}

/**
 * Server Action: Obtém estatísticas básicas do perfil (para dashboard)
 */
export async function getProfileStats() {
  try {
    const profile = await getProfile();

    return {
      name: profile.name,
      role: profile.role,
      avatar_url: profile.avatar_url,
      member_since: new Date(profile.created_at).toLocaleDateString('pt-PT'),
      last_updated: new Date(profile.updated_at).toLocaleDateString('pt-PT'),
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas do perfil:', error);
    throw new Error('Não foi possível obter estatísticas do perfil.');
  }
}

/**
 * Server Action: Cria perfil para um utilizador (usado por webhook)
 */
export async function createProfileForUser(clerkUserId: string, userData: {
  name: string;
  avatar_url?: string;
  email?: string;
}): Promise<Profile> {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        clerk_user_id: clerkUserId,
        name: userData.name,
        avatar_url: userData.avatar_url || null,
        role: 'basic',
        email: userData.email || null,
      } as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao criar perfil: ${error.message}`);
    }

    if (!profile) {
      throw new Error('Perfil não foi criado (retornou null)');
    }

    return profile as unknown as Profile;
  } catch (error) {
    console.error('Erro ao criar perfil via webhook:', error);
    throw error;
  }
}

/**
 * Server Action: Atualiza perfil para um utilizador (usado por webhook)
 */
export async function updateProfileForUser(clerkUserId: string, updates: {
  name?: string;
  avatar_url?: string;
}): Promise<Profile> {
  try {
    const supabase = createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }

    if (!profile) {
      throw new Error('Perfil não foi atualizado (retornou null)');
    }

    return profile as unknown as Profile;
  } catch (error) {
    console.error('Erro ao atualizar perfil via webhook:', error);
    throw error;
  }
}