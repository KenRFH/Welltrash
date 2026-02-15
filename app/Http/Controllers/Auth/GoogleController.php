<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user && $user->role !== 'company') {
                return redirect()->route('login')->with('status', 'Access denied. Google login is only available for Company accounts.');
            }

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'password' => $user ? $user->password : bcrypt(Str::random(16)), // Don't overwrite existing password
                    'role' => 'company',
                ]
            );

            Auth::login($user);

            return redirect()->route('company.dashboard');

        } catch (\Exception $e) {
            return redirect()->route('login')->with('status', 'Google login failed. Please try again.');
        }
    }
}

