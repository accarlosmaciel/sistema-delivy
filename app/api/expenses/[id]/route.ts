import { NextResponse } from 'next/server';
import { financeService } from '../../../../src/services/financeService';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await financeService.deleteExpense(id);
    return NextResponse.json({ success: true, message: 'Despesa excluída com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

