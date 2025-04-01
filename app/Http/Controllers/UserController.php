<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    public function follow(Request $request, User $user)
    {
        $isWantsJson = $request->wantsJson();
        $followedUser = $request->user();
        if ($user->id === $followedUser->id) {
            return abort('404', 'Cannot follow yourself.');
        }

        $user->followedBy($followedUser);

        return $isWantsJson
            ? response()->json($user->only(['id', 'name']))
            : Redirect::back()->with('success', __('User followed', ['followed_id' => $followedUser->id, 'following_id' => $user_id]));
    }

    public function unfollow(Request $request, User $user)
    {
        $isWantsJson = $request->wantsJson();
        $followedUser = $request->user();
        if ($user->id === $followedUser->id) {
            return abort('404', 'Cannot unfollow yourself.');
        }

        $user->unfollowedBy($followedUser);

        return $isWantsJson
            ? response()->json($user->only(['id', 'name']))
            : Redirect::back()->with('success', __('User unfollowed', ['followed_id' => $followedUser->id, 'following_id' => $user_id]));
    }
}
