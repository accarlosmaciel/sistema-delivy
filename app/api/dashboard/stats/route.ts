import { NextResponse } from 'next/server';
import { financeService } from '../../../../src/services/financeService';
import { orderService } from '../../../../src/services/orderService';
import { productService } from '../../../../src/services/productService';

export async function GET() {
  try {
    const summary = await financeService.getFinancialSummary();
    const activeOrders = await orderService.getOrders({ status: 'active' });
    const allProducts = await productService.getProducts();

    const lowStock = allProducts.filter((p) => (p.stock !== undefined ? p.stock : 25) < 10);

    return NextResponse.json({
      ...summary,
      activeKitchenOrdersCount: activeOrders.length,
      lowStockCount: lowStock.length,
      averageTicket: summary.ordersCount > 0 ? Number((summary.totalRevenue / summary.ordersCount).toFixed(2)) : 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

