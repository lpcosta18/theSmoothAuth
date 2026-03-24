// ✅ Skill: supabase-postgres-best-practices sugere configurar cliente com boas práticas de conexão
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Tipos para o nosso schema
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_user_id: string;
          name: string;
          avatar_url: string | null;
          email: string | null;
          phone: string | null;
          role: 'basic' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          name: string;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: 'basic' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          name?: string;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: 'basic' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Validar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definido nas variáveis de ambiente');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definido nas variáveis de ambiente');
}

/**
 * Cria e retorna uma instância do cliente Supabase
 * Configurado com boas práticas para aplicações Next.js
 */
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Não usar persistência de sessão - Clerk gere a autenticação
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'thesmoothauth-clerk@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
  });
}

/**
 * Cliente Supabase singleton para uso em Server Components e Server Actions
 * Nota: Em Server Components, criar nova instância a cada request é mais seguro
 */
let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Obtém ou cria uma instância do cliente Supabase
 * Útil para Client Components onde não queremos criar múltiplas instâncias
 */
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}

/**
 * Tipos utilitários para o schema
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Funções utilitárias para operações comuns
 */
export const supabaseUtils = {
  /**
   * Obtém um perfil pelo clerk_user_id
   */
  async getProfileByClerkId(clerkUserId: string) {
    const client = createClient();
    return client
      .from('profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();
  },

  /**
   * Verifica se um perfil existe para o clerk_user_id
   */
  async profileExists(clerkUserId: string) {
    const client = createClient();
    const { data, error } = await client
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }

    return !!data;
  },

  /**
   * Atualiza o timestamp updated_at de um perfil
   */
  async touchProfile(clerkUserId: string) {
    const client = createClient();
    return client
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('clerk_user_id', clerkUserId);
  },
};