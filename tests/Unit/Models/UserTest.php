<?php

namespace Tests\Unit\Models;

use App\Models\User;
use App\Models\Article;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * ユーザーのフォロワー関係テスト
     */
    public function test_user_can_have_followers(): void
    {
        $follower = User::factory()->create();

        // フォロー関係を作成
        $this->user->followedBy($follower);

        // フォロワー関係の確認
        $this->assertTrue($this->user->followers->contains($follower));
        $this->assertEquals(1, $this->user->followers()->count());
    }

    /**
     * ユーザーのフォロー中関係テスト
     */
    public function test_user_can_follow_others(): void
    {
        $targetUser = User::factory()->create();

        // フォロー関係を作成
        $targetUser->followedBy($this->user);

        // フォロー関係の確認
        $this->assertTrue($this->user->following->contains($targetUser));
        $this->assertEquals(1, $this->user->following()->count());
    }

    /**
     * isFollowedBy メソッドのテスト
     */
    public function test_is_followed_by_method(): void
    {
        $follower = User::factory()->create();

        // フォロー前の確認
        $this->assertFalse($this->user->isFollowedBy($follower->id));

        // フォロー関係を作成
        $this->user->followedBy($follower);

        // フォロー後の確認
        $this->assertTrue($this->user->isFollowedBy($follower->id));
    }

    /**
     * followedBy メソッドのテスト（新規フォロー）
     */
    public function test_followed_by_method(): void
    {
        $follower = User::factory()->create();

        // フォロー実行
        $this->user->followedBy($follower);

        $this->assertTrue($this->user->isFollowedBy($follower->id));
    }

    /**
     * unfollowedBy メソッドのテスト
     */
    public function test_unfollowed_by_method(): void
    {
        $follower = User::factory()->create();

        // 事前にフォロー関係を作成
        $this->user->followedBy($follower);

        // アンフォロー実行
        $this->user->unfollowedBy($follower);

        $this->assertFalse($this->user->isFollowedBy($follower->id));
    }

    /**
     * 既にフォロー済みの場合のfollowedByテスト
     */
    public function test_followed_by_already_following_user(): void
    {
        $follower = User::factory()->create();

        // 事前にフォロー関係を作成
        $this->user->followedBy($follower);

        // 重複フォローの実行
        $this->user->followedBy($follower);

        // 重複は避けられ、1つのみ存在
        $this->assertEquals(1, $this->user->followers()->count());
        $this->assertTrue($this->user->isFollowedBy($follower->id));
    }

    /**
     * フォローしていない場合のunfollowedByテスト
     */
    public function test_unfollowed_by_not_following_user(): void
    {
        $notFollower = User::factory()->create();

        // 未フォロー状態でのアンフォロー試行
        $this->user->unfollowedBy($notFollower);

        // 何も変わらない
        $this->assertEquals(0, $this->user->followers()->count());
        $this->assertFalse($this->user->isFollowedBy($notFollower->id));
    }

    /**
     * ユーザーの記事関係テスト
     */
    public function test_user_can_have_articles(): void
    {
        $articles = Article::factory(3)->create(['user_id' => $this->user->id]);

        $this->assertEquals(3, $this->user->articles()->count());
        $this->assertTrue($this->user->articles->contains($articles->first()));
    }

    /**
     * ユーザーのチーム所有関係テスト
     */
    public function test_user_can_own_teams(): void
    {
        $team = Team::factory()->create(['user_id' => $this->user->id]);

        $this->assertEquals(1, $this->user->ownedTeams()->count());
        $this->assertTrue($this->user->ownedTeams->contains($team));
    }

    /**
     * ユーザーのチーム参加関係テスト
     */
    public function test_user_can_be_member_of_teams(): void
    {
        $team = Team::factory()->create();
        $team->users()->attach($this->user->id);

        $this->assertEquals(1, $this->user->teams()->count());
        $this->assertTrue($this->user->teams->contains($team));
    }

    /**
     * プロフィール写真URLのテスト
     */
    public function test_profile_photo_url_accessor(): void
    {
        // デフォルトのプロフィール写真URL
        $defaultUrl = $this->user->profile_photo_url;
        $this->assertStringContainsString('ui-avatars.com', $defaultUrl);
        $this->assertStringContainsString('name=', $defaultUrl);
    }

    /**
     * いいね関係のテスト
     */
    public function test_user_can_like_articles(): void
    {
        $article = Article::factory()->create();

        // いいねを追加
        $this->user->likes()->attach($article->id);

        $this->assertEquals(1, $this->user->likes()->count());
        $this->assertTrue($this->user->likes->contains($article));
    }

    /**
     * 複数フォロワーのテスト
     */
    public function test_user_can_have_multiple_followers(): void
    {
        $followers = User::factory(5)->create();

        foreach ($followers as $follower) {
            $this->user->followedBy($follower);
        }

        $this->assertEquals(5, $this->user->followers()->count());

        // 各フォロワーの確認
        foreach ($followers as $follower) {
            $this->assertTrue($this->user->isFollowedBy($follower->id));
        }
    }

    /**
     * 複数フォロー中のテスト
     */
    public function test_user_can_follow_multiple_users(): void
    {
        $targetUsers = User::factory(3)->create();

        foreach ($targetUsers as $targetUser) {
            $targetUser->followedBy($this->user);
        }

        $this->assertEquals(3, $this->user->following()->count());

        // 各フォロー関係の確認
        foreach ($targetUsers as $targetUser) {
            $this->assertTrue($this->user->following->contains($targetUser));
        }
    }

    /**
     * フォロワー数とフォロー中数の動的計算テスト
     */
    public function test_followers_and_following_counts(): void
    {
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

        $this->assertEquals(3, $this->user->followers()->count());
        $this->assertEquals(2, $this->user->following()->count());
    }

    /**
     * ユーザーの基本情報テスト
     */
    public function test_user_has_required_attributes(): void
    {
        $this->assertNotNull($this->user->name);
        $this->assertNotNull($this->user->email);
        $this->assertNotNull($this->user->created_at);
        $this->assertNotNull($this->user->updated_at);
    }

    /**
     * ユーザーのhidden属性テスト
     */
    public function test_user_hides_sensitive_attributes(): void
    {
        $userArray = $this->user->toArray();

        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
        $this->assertArrayNotHasKey('two_factor_recovery_codes', $userArray);
        $this->assertArrayNotHasKey('two_factor_secret', $userArray);
    }

    /**
     * ユーザーのappended属性テスト
     */
    public function test_user_appends_profile_photo_url(): void
    {
        $userArray = $this->user->toArray();

        $this->assertArrayHasKey('profile_photo_url', $userArray);
        $this->assertNotNull($userArray['profile_photo_url']);
    }
}
