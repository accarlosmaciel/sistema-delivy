import { NextResponse } from 'next/server';
import { financeService } from '../../../src/services/financeService';
import { ExpenseSchema } from '../../../src/types';

export async function GET() {
  try {
    const expenses = await financeService.getExpenses();
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ExpenseSchema.parse(body);
    const created = await financeService.createExpense(validated);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
