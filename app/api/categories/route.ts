import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../src/lib/supabase/admin';
import { CATEGORIES as INITIAL_CATEGORIES } from '../../../src/data/products';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) {
      return NextResponse.json(INITIAL_CATEGORIES);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(INITIAL_CATEGORIES);
  }
}
