import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../src/lib/supabase/server';

export async function POST() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    }
    return NextResponse.json({ success: true, message: 'Sessão encerrada com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

