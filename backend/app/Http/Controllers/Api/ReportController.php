<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function show(Request $request, int $warung): JsonResponse
    {
        $warung = $request->user()->warungs()->findOrFail($warung);
        $input = $request->validate([
            'date_from' => ['required', 'date_format:Y-m-d'],
            'date_to' => ['required', 'date_format:Y-m-d', 'after_or_equal:date_from'],
        ]);
        $from = Carbon::parse($input['date_from'])->startOfDay();
        $to = Carbon::parse($input['date_to'])->endOfDay();
        abort_if($from->diffInDays($to) > 366, 422, 'Rentang laporan maksimal satu tahun.');
        $sales = $warung->sales()->with(['payment', 'saleItems.menu.category', 'saleItems.menu.menuIngredients.ingredient'])
            ->whereBetween('created_at', [$from, $to])->orderBy('created_at')->get();
        $expenses = $warung->expenses()->whereNull('ingredient_id')
            ->whereBetween('expense_date', [$from->toDateString(), $to->toDateString()])->get();
        $points = [];
        for ($day = $from->copy(); $day->lte($to); $day->addDay()) {
            $key = $day->toDateString();
            $points[$key] = ['label' => $key, 'revenue' => 0, 'profit' => 0, 'transactions' => 0];
        }
        $products = [];
        $categories = [];
        $revenue = 0;
        $cogs = 0;
        $count = 0;
        foreach ($sales as $sale) {
            if ($sale->status !== 'completed') {
                continue;
            }
            $key = $sale->created_at->toDateString();
            $saleRevenue = (float) $sale->total - (float) $sale->tax;
            $saleCost = 0;
            foreach ($sale->saleItems as $item) {
                $menu = $item->menu;
                $category = $menu?->category?->name ?? 'Tanpa kategori';
                $cost = $menu?->menuIngredients->sum(fn ($recipe) => (float) $recipe->quantity * (float) ($recipe->ingredient?->purchase_price ?? 0)) ?? 0;
                $saleCost += $cost * $item->quantity;
                $itemRevenue = (float) $sale->subtotal > 0 ? (float) $item->subtotal / (float) $sale->subtotal * $saleRevenue : 0;
                $id = $item->menu_id;
                $products[$id] ??= ['id' => $id, 'name' => $menu?->name ?? 'Menu dihapus', 'category' => $category, 'sold' => 0, 'revenue' => 0];
                $products[$id]['sold'] += $item->quantity;
                $products[$id]['revenue'] += $itemRevenue;
                $categories[$category] = ($categories[$category] ?? 0) + $itemRevenue;
            }
            $revenue += $saleRevenue;
            $cogs += $saleCost;
            $count++;
            $points[$key]['revenue'] += $saleRevenue;
            $points[$key]['profit'] += $saleRevenue - $saleCost;
            $points[$key]['transactions']++;
        }
        foreach ($expenses as $expense) {
            $key = $expense->expense_date->toDateString();
            $points[$key]['profit'] -= (float) $expense->amount;
        }
        $expenseTotal = (float) $expenses->sum('amount');
        $profit = $revenue - $cogs - $expenseTotal;
        $top = collect($products)->sortByDesc('sold')->take(5)->values()->map(function ($product, $index) use ($revenue) {
            return [...$product, 'rank' => $index + 1, 'icon' => '🍽️', 'percentage' => $revenue > 0 ? round($product['revenue'] / $revenue * 100, 1) : 0];
        });

        return response()->json([
            'summary' => ['revenue' => round($revenue, 2), 'estimated_profit' => round($profit, 2), 'sales_count' => $count, 'average_order' => $count ? round($revenue / $count, 2) : 0, 'profit_margin' => $revenue ? round($profit / $revenue * 100, 1) : 0],
            'chart' => array_values($points),
            'top_products' => $top,
            'categories' => collect($categories)->map(fn ($amount, $name) => ['name' => $name, 'revenue' => round($amount, 2), 'percentage' => $revenue ? round($amount / $revenue * 100, 1) : 0])->values(),
            'transactions' => $sales->reverse()->values()->map(fn ($sale) => [
                'id' => 'TRX-'.$sale->id, 'time' => $sale->created_at->format('H:i'), 'date' => $sale->created_at->format('Y-m-d'),
                'items' => $sale->saleItems->map(fn ($item) => ($item->menu?->name ?? 'Menu dihapus').' ('.$item->quantity.')')->implode(', '),
                'itemCount' => $sale->saleItems->sum('quantity'), 'payment' => match ($sale->payment?->method) {
                    'cash' => 'Tunai', 'qris' => 'QRIS', default => 'Transfer'
                },
                'total' => (float) $sale->total, 'status' => $sale->status === 'completed' ? 'selesai' : 'refund',
            ]),
            'profit_basis' => 'Estimasi memakai resep dan harga bahan saat ini; penjualan tanpa pajak dikurangi biaya bahan dan pengeluaran operasional.',
        ]);
    }
}
