<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Daftarkan pengguna baru dan buat token akses API.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20', 'unique:users,phone'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'user' => $user,
            'token' => $user->createToken($validated['device_name'] ?? 'nexasmart-api')->plainTextToken,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Autentikasi pengguna dan buat token akses baru.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'login' => ['nullable', 'required_without:email', 'string', 'max:255'],
            'email' => ['nullable', 'required_without:login', 'string', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $identifier = $validated['login'] ?? $validated['email'];
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'phone';
        $user = User::where($field, $identifier)->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Email, nomor HP, atau password tidak sesuai.',
            ], 422);
        }

        return response()->json([
            'message' => 'Login berhasil.',
            'user' => $user,
            'token' => $user->createToken($validated['device_name'] ?? 'nexasmart-api')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Hapus token yang sedang digunakan pengguna.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logout berhasil.',
        ]);
    }

    /**
     * Tampilkan data pengguna yang sedang login.
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Kirim tautan reset password ke email pengguna.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink($validated);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => __($status),
        ]);
    }

    /**
     * Simpan password baru menggunakan token reset.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $validated,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();
                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'message' => __($status),
        ]);
    }
}
