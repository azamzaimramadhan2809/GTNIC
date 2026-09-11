<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Warung;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpenseController extends Controller
{
    public function index(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
        ]);

        return response()->json([
            'expenses' => $warung->expenses()
                ->with('ingredient:id,name,unit')
                ->when(
                    $request->filled('date_from'),
                    fn ($query) => $query->whereDate('expense_date', '>=', $request->date('date_from'))
                )
                ->when(
                    $request->filled('date_to'),
                    fn ($query) => $query->whereDate('expense_date', '<=', $request->date('date_to'))
                )
                ->latest('expense_date')
                ->paginate(15),
        ]);
    }

    public function store(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $expense = $warung->expenses()->create(
            $this->validateExpense($request, $warung)
        );

        return response()->json([
            'message' => 'Pengeluaran berhasil dibuat.',
            'expense' => $expense->load('ingredient:id,name,unit'),
        ], 201);
    }

    public function show(Request $request, int $warung, int $expense): JsonResponse
    {
        return response()->json([
            'expense' => $this->findExpense($request, $warung, $expense)
                ->load('ingredient:id,name,unit'),
        ]);
    }

    public function update(Request $request, int $warung, int $expense): JsonResponse
    {
        $warungModel = $this->findUserWarung($request, $warung);
        $expense = $warungModel->expenses()->findOrFail($expense);
        $expense->update($this->validateExpense($request, $warungModel, true));

        return response()->json([
            'message' => 'Pengeluaran berhasil diperbarui.',
            'expense' => $expense->fresh()->load('ingredient:id,name,unit'),
        ]);
    }

    public function destroy(Request $request, int $warung, int $expense): JsonResponse
    {
        $this->findExpense($request, $warung, $expense)->delete();

        return response()->json(['message' => 'Pengeluaran berhasil dihapus.']);
    }

    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    private function findExpense(Request $request, int $warung, int $expense): Expense
    {
        return $this->findUserWarung($request, $warung)
            ->expenses()
            ->findOrFail($expense);
    }

    /** @return array<string, mixed> */
    private function validateExpense(
        Request $request,
        Warung $warung,
        bool $partial = false
    ): array {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'ingredient_id' => [
                'nullable',
                'integer',
                Rule::exists('ingredients', 'id')->where(
                    fn (Builder $query) => $query->where('warung_id', $warung->id)
                ),
            ],
            'description' => [$required, 'string', 'max:255'],
            'amount' => [$required, 'numeric', 'gt:0'],
            'expense_date' => [$required, 'date'],
        ]);
    }
}
