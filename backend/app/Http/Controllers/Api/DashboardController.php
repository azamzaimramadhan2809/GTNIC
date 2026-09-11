<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SaleItem;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function show(Request $request, int $warung): JsonResponse
    {
        $warung = $request->user()->warungs()->findOrFail($warung);
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        $dateFrom = isset($validated['date_from'])
            ? Carbon::parse($validated['date_from'])->startOfDay()
            : now()->startOfDay();
        $dateTo = isset($validated['date_to'])
            ? Carbon::parse($validated['date_to'])->endOfDay()
            : now()->endOfDay();

        $completedSales = $warung->sales()
            ->where('status', 'completed')
            ->whereBetween('created_at', [$dateFrom, $dateTo]);
        $expenses = $warung->expenses()
            ->whereDate('expense_date', '>=', $dateFrom->toDateString())
            ->whereDate('expense_date', '<=', $dateTo->toDateString());

        $revenue = round((float) (clone $completedSales)->sum('total'), 2);
        $expenseTotal = round((float) (clone $expenses)->sum('amount'), 2);
        $estimatedCogs = round((float) SaleItem::query()
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('menu_ingredients', 'menu_ingredients.menu_id', '=', 'sale_items.menu_id')
            ->join('ingredients', 'ingredients.id', '=', 'menu_ingredients.ingredient_id')
            ->where('sales.warung_id', $warung->id)
            ->where('sales.status', 'completed')
            ->whereBetween('sales.created_at', [$dateFrom, $dateTo])
            ->selectRaw(
                'COALESCE(SUM(sale_items.quantity * menu_ingredients.quantity * ingredients.purchase_price), 0) as total'
            )
            ->value('total'), 2);

        $topMenus = SaleItem::query()
            ->select(['menus.id', 'menus.name'])
            ->selectRaw('SUM(sale_items.quantity) as quantity_sold')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->join('menus', 'menus.id', '=', 'sale_items.menu_id')
            ->where('sales.warung_id', $warung->id)
            ->where('sales.status', 'completed')
            ->whereBetween('sales.created_at', [$dateFrom, $dateTo])
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('quantity_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'period' => [
                'date_from' => $dateFrom->toDateString(),
                'date_to' => $dateTo->toDateString(),
            ],
            'summary' => [
                'revenue' => $revenue,
                'expenses' => $expenseTotal,
                'net_income' => round($revenue - $expenseTotal, 2),
                'estimated_cogs' => $estimatedCogs,
                'estimated_profit' => round(
                    $revenue - $expenseTotal - $estimatedCogs,
                    2
                ),
                'sales_count' => (clone $completedSales)->count(),
                'menus_count' => $warung->menus()->count(),
                'ingredients_count' => $warung->ingredients()->count(),
                'low_stock_count' => $warung->ingredients()
                    ->whereColumn('stock', '<=', 'minimum_stock')
                    ->count(),
            ],
            'low_stock_ingredients' => $warung->ingredients()
                ->whereColumn('stock', '<=', 'minimum_stock')
                ->orderBy('stock')
                ->limit(10)
                ->get(['id', 'name', 'stock', 'minimum_stock', 'unit']),
            'top_menus' => $topMenus,
            'recent_sales' => $warung->sales()
                ->with('payment:id,sale_id,method,status')
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
