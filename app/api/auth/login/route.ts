import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../src/lib/supabase/server';
import { createAdminClient } from '../../../../src/lib/supabase/admin';
import { AdminLoginSchema } from '../../../../src/types';

const DEFAULT_ADMIN_USERS: Record<string, { role: string; name: string; pass: string }> = {
  'superadmin@delivy.com.br': { role: 'superadmin', name: 'Carlos Maciel (Master)', pass: 'admin123' },
  'roberto@delivygourmet.com': { role: 'admin', name: 'Roberto Valente (Dono da Loja)', pass: 'admin123' },
  'cozinha@delivygourmet.com': { role: 'kitchen', name: 'Equipe Cozinha Principal', pass: 'cozinha123' }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = AdminLoginSchema.parse(body);

    const supabase = await createServerSupabaseClient();

    // 1. Tentar autenticação oficial Supabase Auth se configurado
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!authError && authData.user) {
        // Buscar role na tabela profiles
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const userProfile = profile as any;
        const role = userProfile?.role || 'admin';
        if (!['superadmin', 'admin', 'kitchen'].includes(role)) {
          return NextResponse.json({ error: 'Acesso restrito a administradores e equipe de cozinha.' }, { status: 403 });
        }

        return NextResponse.json({
          success: true,
          user: {
            userId: authData.user.id,
            name: userProfile?.name || authData.user.email?.split('@')[0],
            email: authData.user.email,
            role,
            avatar: userProfile?.avatar || null
          }
        });
      }
    }

    // 2. Fallback de desenvolvimento e demonstração
    const match = DEFAULT_ADMIN_USERS[email.toLowerCase()];
    if (!match || match.pass !== password) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: `u-${match.role}`,
        name: match.name,
        email,
        role: match.role,
        avatar: null
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
