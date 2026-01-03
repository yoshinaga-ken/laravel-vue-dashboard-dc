<?php

namespace App\GraphQL\Mutations\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class UserMutation extends Controller
{
    /**
     * Update user profile information
     *
     * @param mixed $rootValue
     * @param array<string, mixed> $args
     * @param GraphQLContext $context
     * @return User
     * @throws \Exception
     */
    public function update(mixed $rootValue, array $args, GraphQLContext $context): User
    {
        try {
            $user = User::findOrFail($args['id']);
            $currentUser = Auth::user();

            if (!$currentUser) {
                throw new \Exception('認証されていないユーザーです');
            }

            // 認可チェック: 自分のプロフィールのみ編集可能
            if ($user->id !== $currentUser->id) {
                throw new \Exception('自分のプロフィールのみ編集できます');
            }

            // @spreadディレクティブにより、inputのフィールドが$argsに直接展開されている
            // バリデーション
            $validator = Validator::make($args, [
                'name' => ['nullable', 'string', 'max:255'],
                'email' => ['nullable', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users')->ignore($user->id)],
            ]);

            if ($validator->fails()) {
                throw new \Exception($validator->errors()->first());
            }

            // メールアドレスの変更処理
            if (isset($args['email']) && $args['email'] !== $user->email && $user instanceof MustVerifyEmail) {
                $user->forceFill([
                    'name' => $args['name'] ?? $user->name,
                    'email' => $args['email'],
                    'email_verified_at' => null,
                ])->save();

                $user->sendEmailVerificationNotification();
            } else {
                // 通常の更新
                $user->forceFill([
                    'name' => $args['name'] ?? $user->name,
                    'email' => $args['email'] ?? $user->email,
                ])->save();
            }

            return $user->fresh();
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
