// ✅ Skill: clerk-webhooks sugere validar signature e processar eventos async
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createProfileForUser, updateProfileForUser } from '@/actions/profile';
import { NextResponse } from 'next/server';

// Validar variável de ambiente
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.warn('⚠️ CLERK_WEBHOOK_SECRET não está definido. Webhooks não serão validados.');
}

export async function POST(req: Request) {
  try {
    // Obter headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // Se não tivermos headers, retornar erro
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse('Erro: headers do webhook ausentes', {
        status: 400,
      });
    }

    // Obter body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Criar objeto Svix
    const wh = new Webhook(webhookSecret || '');

    let evt: WebhookEvent;

    try {
      // Verificar signature (apenas se tivermos secret)
      if (webhookSecret) {
        evt = wh.verify(body, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        }) as WebhookEvent;
      } else {
        // Em desenvolvimento sem secret, usar payload diretamente
        evt = payload as WebhookEvent;
        console.warn('⚠️ Webhook executado sem validação de signature (modo desenvolvimento)');
      }
    } catch (err) {
      console.error('Erro ao verificar webhook:', err);
      return new NextResponse('Erro: signature inválida', {
        status: 400,
      });
    }

    // Processar evento
    const eventType = evt.type;

    console.log(`📨 Webhook recebido: ${eventType}`, {
      userId: evt.data.id,
    });

    switch (eventType) {
      case 'user.created': {
        const userData = evt.data as any;
        const { id, first_name, last_name, image_url, email_addresses } = userData;

        // Construir nome completo
        const name = [first_name, last_name].filter(Boolean).join(' ') || 'Novo Utilizador';

        // Obter email principal
        const primaryEmail = email_addresses?.find((email: any) => email.id === userData.primary_email_address_id);

        await createProfileForUser(id, {
          name,
          avatar_url: image_url,
          email: primaryEmail?.email_address,
        });

        console.log(`✅ Perfil criado para utilizador: ${id}`);
        break;
      }

      case 'user.updated': {
        const userData = evt.data as any;
        const { id, first_name, last_name, image_url } = userData;

        // Construir nome completo se disponível
        const updates: any = {};
        if (first_name || last_name) {
          updates.name = [first_name, last_name].filter(Boolean).join(' ') || undefined;
        }
        if (image_url) {
          updates.avatar_url = image_url;
        }

        if (Object.keys(updates).length > 0) {
          await updateProfileForUser(id, updates);
          console.log(`✅ Perfil atualizado para utilizador: ${id}`);
        }
        break;
      }

      case 'user.deleted': {
        // Nota: Em produção, considerar soft delete ou arquivamento
        const { id } = evt.data;
        console.log(`🗑️ Utilizador eliminado: ${id} (implementar lógica de eliminação se necessário)`);
        break;
      }

      default:
        console.log(`ℹ️ Evento não processado: ${eventType}`);
    }

    return new NextResponse('Webhook processado com sucesso', { status: 200 });
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);

    return new NextResponse(
      JSON.stringify({
        error: 'Erro interno ao processar webhook',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Configuração do endpoint
export const dynamic = 'force-dynamic';