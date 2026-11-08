import { NextResponse } from 'next/server';
import { createAdminClient } from '../../../src/lib/supabase/admin';
import { RESTAURANT_INFO } from '../../../src/data/products';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('restaurants').select('*').limit(1).single();

    if (error || !data) {
      return NextResponse.json(RESTAURANT_INFO);
    }

    const r = data as any;
    return NextResponse.json({
      name: r.name,
      tagline: r.tagline,
      rating: Number(r.rating),
      reviewsCount: r.reviews_count,
      deliveryTime: r.delivery_time,
      deliveryFee: Number(r.delivery_fee),
      freeDeliveryMin: Number(r.free_delivery_min),
      status: r.status,
      openingHours: r.opening_hours,
      address: r.address,
      phone: r.phone,
      bannerImage: r.banner_image || RESTAURANT_INFO.bannerImage,
      logoImage: r.logo_image || RESTAURANT_INFO.logoImage
    });
  } catch {
    return NextResponse.json(RESTAURANT_INFO);
  }
}
