<?php

use App\Models\Article;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

// ユーザーがフォロワーを持てる
test('user can have followers', function () {
    $follower = User::factory()->create();

    // フォロー関係を作成
    $this->user->followedBy($follower);

    // フォロワー関係の確認
    expect($this->user->followers->contains($follower))->toBeTrue();
    expect($this->user->followers()->count())->toBe(1);
});

// ユーザーが他のユーザーをフォローできる
test('user can follow other users', function () {
    $targetUser = User::factory()->create();

    // フォロー関係を作成
    $targetUser->followedBy($this->user);

    // フォロー関係の確認
    expect($this->user->following->contains($targetUser))->toBeTrue();
    expect($this->user->following()->count())->toBe(1);
});

// isFollowedByメソッドが正しく動作する
test('isFollowedBy method works correctly', function () {
    $follower = User::factory()->create();

    // フォロー前の確認
    expect($this->user->isFollowedBy($follower->id))->toBeFalse();

    // フォロー関係を作成
    $this->user->followedBy($follower);

    // フォロー後の確認
    expect($this->user->isFollowedBy($follower->id))->toBeTrue();
});

// followedByメソッドで新規フォローができる
test('followedBy method can create new follow', function () {
    $follower = User::factory()->create();

    // フォロー実行
    $this->user->followedBy($follower);

    expect($this->user->isFollowedBy($follower->id))->toBeTrue();
});

// unfollowedByメソッドでアンフォローができる
test('unfollowedBy method can unfollow', function () {
    $follower = User::factory()->create();

    // 事前にフォロー関係を作成
    $this->user->followedBy($follower);

    // アンフォロー実行
    $this->user->unfollowedBy($follower);

    expect($this->user->isFollowedBy($follower->id))->toBeFalse();
});

// 既にフォロー済みのユーザーを再度フォローしても重複しない
test('already followed user cannot be followed again without duplication', function () {
    $follower = User::factory()->create();

    // 事前にフォロー関係を作成
    $this->user->followedBy($follower);

    // 重複フォローの実行
    $this->user->followedBy($follower);

    // 重複は避けられ、1つのみ存在
    expect($this->user->followers()->count())->toBe(1);
    expect($this->user->isFollowedBy($follower->id))->toBeTrue();
});

// フォローしていないユーザーをアンフォローしても影響なし
test('unfollowing non-followed user has no effect', function () {
    $notFollower = User::factory()->create();

    // 未フォロー状態でのアンフォロー試行
    $this->user->unfollowedBy($notFollower);

    // 何も変わらない
    expect($this->user->followers()->count())->toBe(0);
    expect($this->user->isFollowedBy($notFollower->id))->toBeFalse();
});

// ユーザーが記事を持てる
test('user can have articles', function () {
    $articles = Article::factory(3)->create(['user_id' => $this->user->id]);

    expect($this->user->articles()->count())->toBe(3);
    expect($this->user->articles->contains($articles->first()))->toBeTrue();
});

// ユーザーがチームを所有できる
test('user can own teams', function () {
    $team = Team::factory()->create(['user_id' => $this->user->id]);

    expect($this->user->ownedTeams()->count())->toBe(1);
    expect($this->user->ownedTeams->contains($team))->toBeTrue();
});

// ユーザーがチームのメンバーになれる
test('user can be team member', function () {
    $team = Team::factory()->create();
    $team->users()->attach($this->user->id);

    expect($this->user->teams()->count())->toBe(1);
    expect($this->user->teams->contains($team))->toBeTrue();
});

// プロフィール写真URLアクセサが正しく動作する
test('profile photo url accessor works correctly', function () {
    // デフォルトのプロフィール写真URL
    $defaultUrl = $this->user->profile_photo_url;
    expect($defaultUrl)->toContain('ui-avatars.com');
    expect($defaultUrl)->toContain('name=');
});

// ユーザーが記事にいいねできる
test('user can like articles', function () {
    $article = Article::factory()->create();

    // いいねを追加
    $this->user->likes()->attach($article->id);

    expect($this->user->likes()->count())->toBe(1);
    expect($this->user->likes->contains($article))->toBeTrue();
});

// ユーザーが複数のフォロワーを持てる
test('user can have multiple followers', function () {
    $followers = User::factory(5)->create();

    foreach ($followers as $follower) {
        $this->user->followedBy($follower);
    }

    expect($this->user->followers()->count())->toBe(5);

    // 各フォロワーの確認
    foreach ($followers as $follower) {
        expect($this->user->isFollowedBy($follower->id))->toBeTrue();
    }
});

// ユーザーが複数のユーザーをフォローできる
test('user can follow multiple users', function () {
    $targetUsers = User::factory(3)->create();

    foreach ($targetUsers as $targetUser) {
        $targetUser->followedBy($this->user);
    }

    expect($this->user->following()->count())->toBe(3);

    // 各フォロー関係の確認
    foreach ($targetUsers as $targetUser) {
        expect($this->user->following->contains($targetUser))->toBeTrue();
    }
});

// フォロワー数とフォロー中数が正しく計算される
test('follower and following counts are calculated correctly', function () {
    // フォロワーを追加
    $followers = User::factory(3)->create();
    foreach ($followers as $follower) {
        $this->user->followedBy($follower);
    }

    // フォロー中を追加
    $following = User::factory(2)->create();
    foreach ($following as $followUser) {
        $followUser->followedBy($this->user);
    }

    expect($this->user->followers()->count())->toBe(3);
    expect($this->user->following()->count())->toBe(2);
});

// ユーザーが必要な属性を持つ
test('user has required attributes', function () {
    expect($this->user->name)->not->toBeNull();
    expect($this->user->email)->not->toBeNull();
    expect($this->user->created_at)->not->toBeNull();
    expect($this->user->updated_at)->not->toBeNull();
});

// ユーザーが機密属性を隠す
test('user hides sensitive attributes', function () {
    $userArray = $this->user->toArray();

    expect($userArray)->not->toHaveKey('password');
    expect($userArray)->not->toHaveKey('remember_token');
    expect($userArray)->not->toHaveKey('two_factor_recovery_codes');
    expect($userArray)->not->toHaveKey('two_factor_secret');
});

// ユーザーがプロフィール写真URLを追加する
test('user appends profile photo url', function () {
    $userArray = $this->user->toArray();

    expect($userArray)->toHaveKey('profile_photo_url');
    expect($userArray['profile_photo_url'])->not->toBeNull();
});

// フォローメソッドの統合テスト
test('follow methods integration test', function () {
    $user = User::factory()->create();
    $follower1 = User::factory()->create();
    $follower2 = User::factory()->create();

    // フォロー OFF　チェック
    expect($user->isFollowedBy($follower1->id))->toBeFalse();

    // フォロー ON
    $user->followedBy($follower1);
    $user->followedBy($follower2);

    // フォロー ON　チェック
    expect($user->isFollowedBy($follower1->id))->toBeTrue();

    // フォロー数チェック
    expect($user->followers()->count())->toBe(2);

    // フォロー Off
    $user->unfollowedBy($follower1);

    // フォロー OFF　チェック
    expect($user->isFollowedBy($follower1->id))->toBeFalse();

    // フォロー数チェック
    expect($user->followers()->count())->toBe(1);
});

// isFollowedByメソッドのパラメーターテスト - user_id:null
test('isFollowedBy method parameter test - user_id:null', function () {
    $user = User::factory()->create();
    $loginUser = User::factory()->create();

    $this->actingAs($loginUser);

    // $user は $loginUser にフォローされていない
    expect($user->isFollowedBy())->toBeFalse();

    // $loginUser でフォロー
    $user->followedBy($loginUser);

    // $user は $loginUser にフォローされている
    expect($user->isFollowedBy())->toBeTrue();
});
