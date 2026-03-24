// ✅ Skill: frontend-design sugere usar shadcn/ui components com validação Zod
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/nextjs';
import { updateProfileSchema, type UpdateProfileFormData } from '@/lib/schemas/profile';
import { updateProfile, getCurrentProfile } from '@/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, User, Phone, Camera, Upload, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfileForm() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      avatar_url: '',
      phone: '',
    },
    mode: 'onBlur',
    shouldUseNativeValidation: false,
  });

  // Carregar dados do perfil via Server Action
  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadProfile = async () => {
      try {
        const profile = await getCurrentProfile();

        if (profile) {
          const initialValues = {
            name: profile.name || user.fullName || '',
            avatar_url: profile.avatar_url || user.imageUrl || '',
            phone: profile.phone || '',
          };

          form.reset(initialValues);

          // Definir preview do avatar
          if (initialValues.avatar_url) {
            setAvatarPreview(initialValues.avatar_url);
          } else if (user.imageUrl) {
            setAvatarPreview(user.imageUrl);
          }
        } else {
          // Se não existir perfil, usar dados do Clerk
          form.reset({
            name: user.fullName || '',
            avatar_url: user.imageUrl || '',
            phone: '',
          });
          if (user.imageUrl) {
            setAvatarPreview(user.imageUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
      }
    };

    loadProfile();
  }, [isLoaded, user, form]);

  // Handler para upload de imagem (simulado)
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de ficheiro
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um ficheiro de imagem');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem não pode exceder 5MB');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Em produção, aqui faríamos upload para um serviço como Cloudinary, Supabase Storage, etc.
      // Por agora, criamos um URL local para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        form.setValue('avatar_url', base64String, { shouldValidate: true });
        setIsUploadingAvatar(false);
        toast.success('Imagem carregada com sucesso');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
      toast.error('Erro ao carregar imagem');
      setIsUploadingAvatar(false);
    }
  };

  // Remover avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    form.setValue('avatar_url', '', { shouldValidate: true });
    toast.info('Imagem removida');
  };

  const onSubmit = async (values: UpdateProfileFormData) => {
    setIsLoading(true);

    try {
      const updatedProfile = await updateProfile(values);

      // Atualizar também no Clerk (para avatar/name consistency)
      if (user && (values.name || values.avatar_url)) {
        try {
          // Atualizar nome
          if (values.name) {
            await user.update({
              firstName: values.name?.split(' ')[0] || user.firstName,
              lastName: values.name?.split(' ').slice(1).join(' ') || user.lastName,
            });
          }

          // Atualizar avatar (se fornecido e não for base64/local)
          if (values.avatar_url && values.avatar_url.startsWith('http')) {
            await user.setProfileImage({
              file: values.avatar_url,
            });
          }
        } catch (clerkError) {
          console.warn('Erro ao atualizar Clerk:', clerkError);
          // Não falhar o processo se o Clerk falhar
        }
      }

      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error.message || 'Erro ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Extrair iniciais para avatar fallback
  const getInitials = () => {
    const name = form.getValues('name') || user?.fullName || 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar Section */}
        <div className="space-y-4">
          <Label htmlFor="avatar">Foto de Perfil</Label>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={avatarPreview}
                  alt={form.getValues('name') || 'Avatar do utilizador'}
                  className="object-cover"
                />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              {avatarPreview && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveAvatar}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="avatar-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      A carregar...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Carregar Nova Foto
                    </>
                  )}
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </div>
              <p className="text-sm text-gray-500">
                Formatos suportados: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>

          {/* Campo hidden para avatar_url */}
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Nome Completo
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Introduza o seu nome completo"
                  {...field}
                  className={form.formState.errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-500 mt-1">
                Este nome será exibido no seu perfil público
              </p>
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Número de Telefone
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+351 912 345 678"
                  {...field}
                  className={form.formState.errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-500 mt-1">
                Opcional - usado apenas para contacto
              </p>
            </FormItem>
          )}
        />

        {/* Email (read-only from Clerk) */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <Camera className="mr-2 h-4 w-4" />
            Endereço de Email
          </Label>
          <Input
            value={user?.primaryEmailAddress?.emailAddress || 'Não disponível'}
            readOnly
            disabled
            className="bg-gray-50 text-gray-600"
          />
          <p className="text-sm text-gray-500">
            O email é gerido pelo Clerk e não pode ser alterado aqui
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A guardar...
              </>
            ) : (
              'Guardar Alterações'
            )}
          </Button>

          {!form.formState.isDirty && (
            <p className="text-sm text-gray-500 mt-2">
              Faça alterações para ativar o botão de guardar
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}