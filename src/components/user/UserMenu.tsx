// ✅ Skill: clerk/skills sugere usar UserButton com appearance personalizado
'use client';

import { UserButton, useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, HelpCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentProfile } from '@/actions/profile';

export function UserMenu() {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{ avatar_url?: string | null } | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (user && isLoaded) {
        try {
          setLoadingProfile(true);
          const userProfile = await getCurrentProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          setProfile(null);
        } finally {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();
  }, [user, isLoaded]);

  if (!isLoaded || loadingProfile) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="hidden md:block">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/sign-in">Iniciar Sessão</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Criar Conta</Link>
        </Button>
      </div>
    );
  }

  // Extrair iniciais do nome para o avatar
  const getInitials = () => {
    if (!user.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center space-x-4">
      {/* User Info (desktop) */}
      <div className="hidden md:block text-right">
        <p className="text-sm font-medium text-gray-900">
          {user.fullName || 'Utilizador'}
        </p>
        <p className="text-xs text-gray-500 truncate max-w-[150px]">
          {user.primaryEmailAddress?.emailAddress || 'Sem email'}
        </p>
      </div>

      {/* Dropdown Menu Único - funciona para desktop e mobile */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 transition-colors"
          >
            <Avatar className="h-10 w-10 border-2 border-gray-200">
              <AvatarImage
                src={profile?.avatar_url || user.imageUrl}
                alt={user.fullName || 'Avatar do utilizador'}
              />
              <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.fullName || 'Utilizador'}
              </p>
              <p className="text-xs leading-none text-gray-500 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="#" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Definições</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="#" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Segurança</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="#" className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ajuda & Suporte</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Botão de logout personalizado */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <SignOutButton redirectUrl="/sign-in">
              <button className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Terminar Sessão</span>
              </button>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}