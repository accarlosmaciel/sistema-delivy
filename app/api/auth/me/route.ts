import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../src/lib/supabase/server';
import { createAdminClient } from '../../../../src/lib/supabase/admin';

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ authenticated: false });
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ authenticated: false });
    }

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const userProfile = profile as any;

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: userProfile?.name || user.email?.split('@')[0],
        role: userProfile?.role || 'cliente',
        avatar: userProfile?.avatar || null
      }
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message });
  }
}
