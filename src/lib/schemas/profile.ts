// ✅ Skill: frontend-design sugere usar Zod para validação type-safe
import { z } from 'zod';

// Regex para validação de URL (simples)
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Regex para validação de telefone português
const phoneRegex = /^(\+351)?\s?9[1236]\d{7}$/;

/**
 * Schema para validação de atualização de perfil
 * Campos opcionais com validações específicas
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    .max(100, { message: 'O nome não pode exceder 100 caracteres' })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'O nome só pode conter letras e espaços',
    })
    .transform((val) => val.trim()),

  avatar_url: z
    .union([
      z.string().url({ message: 'URL da imagem inválida' }),
      z.string().regex(urlRegex, { message: 'URL da imagem inválida' }),
      z.string().max(0), // String vazia
    ])
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),

  phone: z
    .union([
      z.string().regex(phoneRegex, {
        message: 'Número de telefone português inválido. Formato: +351 9XX XXX XXX',
      }),
      z.string().max(0), // String vazia
    ])
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || val === '') return null;
      // Normalizar formato do telefone
      return val.replace(/\s+/g, ' ').trim();
    }),
});

/**
 * Schema para criação de perfil (usado pelo webhook)
 * Campos obrigatórios diferentes do update
 */
export const createProfileSchema = z.object({
  clerk_user_id: z
    .string()
    .min(1, { message: 'clerk_user_id é obrigatório' })
    .max(255, { message: 'clerk_user_id muito longo' }),

  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
    .max(100, { message: 'O nome não pode exceder 100 caracteres' })
    .default('Novo Utilizador'),

  avatar_url: z
    .union([
      z.string().url({ message: 'URL da imagem inválida' }),
      z.string().regex(urlRegex, { message: 'URL da imagem inválida' }),
    ])
    .optional()
    .nullable(),

  phone: z
    .union([
      z.string().regex(phoneRegex, {
        message: 'Número de telefone português inválido',
      }),
      z.string().max(0),
    ])
    .optional()
    .nullable(),

  role: z
    .enum(['basic', 'admin'])
    .default('basic')
    .transform((val) => val as 'basic' | 'admin'),
});

/**
 * Schema para validação de ID do perfil
 */
export const profileIdSchema = z.object({
  id: z.string().uuid({ message: 'ID do perfil inválido' }),
});

/**
 * Schema para validação de clerk_user_id
 */
export const clerkUserIdSchema = z.object({
  clerk_user_id: z.string().min(1, { message: 'clerk_user_id é obrigatório' }),
});

/**
 * Schema para pesquisa de perfis (filtros)
 */
export const profileFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['basic', 'admin']).optional(),
  limit: z
    .number()
    .int()
    .min(1, { message: 'O limite deve ser pelo menos 1' })
    .max(100, { message: 'O limite não pode exceder 100' })
    .default(20),
  offset: z
    .number()
    .int()
    .min(0, { message: 'O offset não pode ser negativo' })
    .default(0),
});

/**
 * Schema para validação de upload de imagem
 */
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'A imagem não pode exceder 5MB',
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'O ficheiro deve ser uma imagem',
    }),
});

/**
 * Tipos TypeScript derivados dos schemas
 */
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateProfileData = z.infer<typeof createProfileSchema>;
export type ProfileFilter = z.infer<typeof profileFilterSchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;

/**
 * Tipos para respostas de validação
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

/**
 * Função utilitária para validar dados do perfil
 */
export function validateProfileUpdate(data: unknown): ValidationResult<UpdateProfileFormData> {
  try {
    const validated = updateProfileSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
}

/**
 * Função utilitária para validar criação de perfil
 */
export function validateProfileCreation(data: unknown): ValidationResult<CreateProfileData> {
  try {
    const validated = createProfileSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
}

/**
 * Mensagens de erro traduzidas para PT-PT
 */
export const validationMessages = {
  required: 'Campo obrigatório',
  invalidEmail: 'Email inválido',
  invalidPhone: 'Número de telefone inválido',
  invalidUrl: 'URL inválida',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  nameFormat: 'Só pode conter letras e espaços',
  phoneFormat: 'Formato: +351 9XX XXX XXX',
};

/**
 * Configurações de validação para formulários
 */
export const formValidationConfig = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
  },
  phone: {
    pattern: phoneRegex,
  },
  avatar_url: {
    maxLength: 500,
  },
} as const;