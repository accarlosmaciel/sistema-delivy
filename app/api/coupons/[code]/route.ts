import { NextResponse } from 'next/server';
import { couponService } from '../../../../src/services/couponService';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    await couponService.deleteCoupon(code);
    return NextResponse.json({ success: true, message: 'Cupom excluído com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

