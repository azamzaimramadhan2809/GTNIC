<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warung;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarungController extends Controller
{
    /**
     * Tampilkan seluruh warung milik pengguna yang sedang login.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'warungs' => $request->user()->warungs()->latest()->paginate(15),
        ]);
    }

    /**
     * Buat warung baru untuk pengguna yang sedang login.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateWarung($request);

        $warung = $request->user()->warungs()->create($validated);

        return response()->json([
            'message' => 'Warung berhasil dibuat.',
            'warung' => $warung,
        ], 201);
    }

    /**
     * Tampilkan detail satu warung milik pengguna yang sedang login.
     */
    public function show(Request $request, int $warung): JsonResponse
    {
        return response()->json([
            'warung' => $this->findUserWarung($request, $warung),
        ]);
    }

    /**
     * Perbarui warung milik pengguna yang sedang login.
     */
    public function update(Request $request, int $warung): JsonResponse
    {
        $warung = $this->findUserWarung($request, $warung);
        $warung->update($this->validateWarung($request, true));

        return response()->json([
            'message' => 'Warung berhasil diperbarui.',
            'warung' => $warung->fresh(),
        ]);
    }

    /**
     * Hapus warung milik pengguna yang sedang login.
     */
    public function destroy(Request $request, int $warung): JsonResponse
    {
        $this->findUserWarung($request, $warung)->delete();

        return response()->json([
            'message' => 'Warung berhasil dihapus.',
        ]);
    }

    /**
     * Ambil warung yang memang dimiliki pengguna aktif atau kirim respons 404.
     */
    private function findUserWarung(Request $request, int $warung): Warung
    {
        return $request->user()->warungs()->findOrFail($warung);
    }

    /**
     * Validasi data warung saat dibuat atau diperbarui.
     *
     * @return array<string, mixed>
     */
    private function validateWarung(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
