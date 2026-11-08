import { NextResponse } from 'next/server';
import { couponService } from '../../../src/services/couponService';
import { CouponSchema } from '../../../src/types';

export async function GET() {
  try {
    const coupons = await couponService.getCoupons();
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CouponSchema.parse(body);
    const created = await couponService.createCoupon(validated);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
