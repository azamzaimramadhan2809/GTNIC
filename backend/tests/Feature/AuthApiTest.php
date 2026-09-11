<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_access_profile_login_and_logout(): void
    {
        $register = $this->postJson('/api/register', [
            'name' => 'Zaim',
            'email' => 'zaim@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $register
            ->assertCreated()
            ->assertJsonPath('user.email', 'zaim@example.com')
            ->assertJsonStructure(['message', 'user', 'token', 'token_type']);

        $token = $register->json('token');

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('user.email', 'zaim@example.com');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout berhasil.');

        Auth::forgetGuards();

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertUnauthorized();

        $this->postJson('/api/login', [
            'email' => 'zaim@example.com',
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['user', 'token', 'token_type']);

        $this->postJson('/api/login', [
            'email' => 'zaim@example.com',
            'password' => 'password-salah',
        ])->assertUnprocessable()->assertJsonPath(
            'message',
            'Email atau password tidak sesuai.'
        );
    }

    public function test_protected_endpoint_returns_json_unauthorized_without_token(): void
    {
        $this->getJson('/api/warungs')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthenticated.');
    }
}
