<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_access_profile_login_and_logout(): void
    {
        Notification::fake();

        $register = $this->postJson('/api/register', [
            'name' => 'Zaim',
            'warung_name' => 'Warung Zaim',
            'email' => 'zaim@gmail.com',
            'phone' => '08123456789',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $register
            ->assertCreated()
            ->assertJsonPath('email', 'zaim@gmail.com')
            ->assertJsonPath('requires_verification', true);

        $user = User::where('email', 'zaim@gmail.com')->firstOrFail();
        $this->assertDatabaseHas('warungs', [
            'user_id' => $user->id,
            'name' => 'Warung Zaim',
        ]);
        $this->assertNull($user->email_verified_at);

        $verificationUrl = null;
        Notification::assertSentTo(
            $user,
            VerifyEmail::class,
            function (VerifyEmail $notification) use ($user, &$verificationUrl): bool {
                $verificationUrl = $notification->toMail($user)->actionUrl;

                return true;
            }
        );

        $this->postJson('/api/login', [
            'login' => '08123456789',
            'password' => 'password123',
        ])->assertForbidden();

        $this->get($verificationUrl)
            ->assertRedirect('http://localhost:5173/login?verified=1');

        $login = $this->postJson('/api/login', [
            'login' => 'zaim@gmail.com',
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['user', 'token', 'token_type']);

        $token = $login->json('token');

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('user.email', 'zaim@gmail.com');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout berhasil.');

        Auth::forgetGuards();

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertUnauthorized();

        $this->postJson('/api/login', [
            'email' => 'zaim@gmail.com',
            'password' => 'password-salah',
        ])->assertUnprocessable()->assertJsonPath(
            'message',
            'Email, nomor HP, atau password tidak sesuai.'
        );
    }

    public function test_registration_rejects_non_gmail_address(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Budi',
            'warung_name' => 'Warung Budi',
            'email' => 'budi@example.com',
            'phone' => '081200000001',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_protected_endpoint_returns_json_unauthorized_without_token(): void
    {
        $this->getJson('/api/warungs')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Unauthenticated.');
    }

    public function test_user_can_request_and_complete_password_reset(): void
    {
        Notification::fake();
        $user = User::factory()->create([
            'email' => 'reset@example.com',
        ]);
        $token = null;

        $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ])->assertOk();

        Notification::assertSentTo(
            $user,
            ResetPasswordNotification::class,
            function (ResetPasswordNotification $notification) use (&$token, $user): bool {
                $token = $notification->token;
                $url = $notification->toMail($user)->actionUrl;

                $this->assertStringStartsWith(
                    'http://localhost:5173/reset-password?',
                    $url
                );
                $this->assertStringContainsString(
                    'email=reset%40example.com',
                    $url
                );

                return true;
            }
        );

        $this->postJson('/api/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'password-baru',
            'password_confirmation' => 'password-baru',
        ])->assertOk();

        $this->assertTrue(Hash::check('password-baru', $user->fresh()->password));
    }
}
