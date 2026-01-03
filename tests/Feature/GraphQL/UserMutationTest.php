<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

// updateUser mutation の基本テスト
test('updateUser mutation updates user name', function () {
    Sanctum::actingAs($this->user);

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                name
                email
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'name' => 'Updated Name',
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $response->assertJsonStructure([
        'data' => [
            'updateUser' => [
                'id', 'name', 'email',
            ],
        ],
    ]);

    $userData = $response->json('data.updateUser');
    expect($userData['name'])->toBe('Updated Name');
    expect($userData['email'])->toBe($this->user->email);

    // データベースが更新されていることを確認
    $this->user->refresh();
    expect($this->user->name)->toBe('Updated Name');
});

// updateUser mutation でメールアドレスを更新
test('updateUser mutation updates user email', function () {
    Sanctum::actingAs($this->user);

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                name
                email
            }
        }
    ';

    $newEmail = 'newemail@example.com';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'email' => $newEmail,
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $userData = $response->json('data.updateUser');
    expect($userData)->not->toBeNull();
    expect($userData['email'])->toBe($newEmail);

    // データベースが更新されていることを確認
    $this->user->refresh();
    expect($this->user->email)->toBe($newEmail);
    // メールアドレス変更時は email_verified_at が null になる（MustVerifyEmail を実装している場合）
    // テスト環境では、email_verified_at が null になるかどうかは実装に依存する
});

// updateUser mutation で名前とメールアドレスの両方を更新
test('updateUser mutation updates both name and email', function () {
    Sanctum::actingAs($this->user);

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                name
                email
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'name' => 'New Name',
                'email' => 'newemail@example.com',
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $userData = $response->json('data.updateUser');
    expect($userData)->not->toBeNull();
    expect($userData['name'])->toBe('New Name');
    expect($userData['email'])->toBe('newemail@example.com');

    // データベースが更新されていることを確認
    $this->user->refresh();
    expect($this->user->name)->toBe('New Name');
    expect($this->user->email)->toBe('newemail@example.com');
});

// updateUser mutation の認可テスト（他人のプロフィールは更新できない）
test('updateUser mutation requires ownership', function () {
    Sanctum::actingAs($this->user);

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                name
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->otherUser->id,
            'input' => [
                'name' => 'Hacked Name',
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);

    // データベースが更新されていないことを確認
    $this->otherUser->refresh();
    expect($this->otherUser->name)->not->toBe('Hacked Name');
});

// updateUser mutation の認証テスト
test('updateUser mutation requires authentication', function () {
    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                name
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'name' => 'Updated Name',
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// updateUser mutation のバリデーションテスト（無効なメールアドレス）
test('updateUser mutation validates email format', function () {
    Sanctum::actingAs($this->user);

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                email
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'email' => 'invalid-email',
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// updateUser mutation のバリデーションテスト（重複メールアドレス）
test('updateUser mutation validates unique email', function () {
    Sanctum::actingAs($this->user);

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                email
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'email' => $this->otherUser->email,
            ],
        ],
    ]);

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'errors' => [
            '*' => ['message'],
        ],
    ]);
});

// updateUser mutation で同じメールアドレスに更新（変更なし）
test('updateUser mutation allows same email', function () {
    Sanctum::actingAs($this->user);
    $originalEmail = $this->user->email;
    $originalEmailVerifiedAt = $this->user->email_verified_at;

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                email
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'email' => $originalEmail,
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $userData = $response->json('data.updateUser');
    expect($userData)->not->toBeNull();
    expect($userData['email'])->toBe($originalEmail);

    // データベースが更新されていないことを確認（同じメールアドレスのため）
    $this->user->refresh();
    expect($this->user->email)->toBe($originalEmail);
    // email_verified_at は変更されない
    if ($originalEmailVerifiedAt) {
        expect($this->user->email_verified_at)->not->toBeNull();
    }
});

// updateUser mutation で名前のみ更新（メールアドレスは変更しない）
test('updateUser mutation updates only name when email not provided', function () {
    Sanctum::actingAs($this->user);
    $originalEmail = $this->user->email;

    $mutation = '
        mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
                id
                name
                email
            }
        }
    ';

    $response = $this->postJson('/graphql', [
        'query' => $mutation,
        'variables' => [
            'id' => (string)$this->user->id,
            'input' => [
                'name' => 'Name Only Update',
            ],
        ],
    ]);

    $response->assertStatus(200);

    // エラーレスポンスの場合はデバッグ出力してエラーを確認
    if ($response->json('errors')) {
        $errors = $response->json('errors');
        $this->fail('GraphQL Error: ' . json_encode($errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    $userData = $response->json('data.updateUser');
    expect($userData)->not->toBeNull();
    expect($userData['name'])->toBe('Name Only Update');
    expect($userData['email'])->toBe($originalEmail);

    // データベースが更新されていることを確認
    $this->user->refresh();
    expect($this->user->name)->toBe('Name Only Update');
    expect($this->user->email)->toBe($originalEmail);
});

