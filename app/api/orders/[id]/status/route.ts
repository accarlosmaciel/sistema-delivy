import { NextResponse } from 'next/server';
import { orderService } from '../../../../../src/services/orderService';
import { UpdateOrderStatusSchema } from '../../../../../src/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = UpdateOrderStatusSchema.parse(body);

    await orderService.updateOrderStatus(id, status);
    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

