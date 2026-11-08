import { NextResponse } from 'next/server';
import { couponService } from '../../../../src/services/couponService';
import { ValidateCouponSchema } from '../../../../src/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, subtotal } = ValidateCouponSchema.parse(body);
    const result = await couponService.validateCoupon(code, subtotal);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 400 });
  }
}
