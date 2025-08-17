<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Laravel\Jetstream\Jetstream;

class TeamController extends Controller
{
    /**
     * チーム一覧を表示
     *
     * @param Request $request
     * @return \Inertia\Response
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(Request $request): \Inertia\Response
    {
        // 認可チェック
        Gate::authorize('viewAny', Jetstream::newTeamModel());

        $user = $request->user();

        // フィルター・検索パラメータ取得
        $search = $request->get('search');
        $type = $request->get('type', 'all');
        $roleFilter = $request->get('role_filter', 'all');
        $memberCount = $request->get('member_count');
        $sortBy = $request->get('sort_by', 'created_desc');

        // 空文字列の場合はnullに変換（フロントエンドとの整合性のため）
        if ($search === '') $search = null;
        if ($roleFilter === '') $roleFilter = null;
        if ($memberCount === '') $memberCount = null;

        // ベースクエリ - 全チームを対象とする
        $query = Jetstream::newTeamModel()::query()
            ->with(['owner', 'teamInvitations', 'users' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->withCount([
                'users as members_count',
                'teamInvitations as invitations_count'
            ]);

        // 検索フィルター
        if (!is_null($search) && trim($search) !== '') {
            $query->where('name', 'like', '%' . trim($search) . '%');
        }

        // チームタイプフィルター
        switch ($type) {
            case 'personal':
                $query->where('personal_team', true);
                break;
            case 'shared':
                $query->where('personal_team', false);
                break;
            case 'current':
                $query->where('id', $user->currentTeam->id);
                break;
        }

        // 役割フィルター
        switch ($roleFilter) {
            case 'owner':
                $query->where('user_id', $user->id);
                break;
            case 'member':
                $query->whereHas('users', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                })->where('user_id', '!=', $user->id);
                break;
            case 'all':
            default:
                // 全チーム表示（フィルターなし）
                break;
        }

        // メンバー数フィルター
        if (!is_null($memberCount)) {
            switch ($memberCount) {
                case '1':
                    $query->having('members_count', '=', 1);
                    break;
                case '2-5':
                    $query->having('members_count', '>=', 2)
                          ->having('members_count', '<=', 5);
                    break;
                case '6-10':
                    $query->having('members_count', '>=', 6)
                          ->having('members_count', '<=', 10);
                    break;
                case '11+':
                    $query->having('members_count', '>=', 11);
                    break;
            }
        }

        // 並び替え
        switch ($sortBy) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'created_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'created_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'members_asc':
                $query->orderBy('members_count', 'asc');
                break;
            case 'members_desc':
                $query->orderBy('members_count', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        // パラメータバリデーション
        $perPage = $request->get('per_page', 32);
        $page = $request->get('page', 1);

        // per_page バリデーション（32件、128件、全件）
        if (!in_array($perPage, [32, 128, 9999])) {
            $perPage = 32;
        }

        // 全件の場合は実際の総数に設定
        if ($perPage === 9999) {
            $perPage = Jetstream::newTeamModel()::count() ?: 32;
        }

        // page バリデーション
        if (!is_numeric($page) || $page < 1) {
            $page = 1;
        }

        // ページネーション実行
        $teams = $query->paginate(
            $perPage,
            ['*'],
            'page',
            $page
        );

        // 統計情報 - システム全体のチーム数を取得
        $totalTeams = Jetstream::newTeamModel()::count();

        // チームデータに追加情報を付与
        $teamsData = collect($teams->items())->map(function ($team) use ($user) {
            // 必要なプロパティのみを選択
            $teamData = [
                'id' => $team->id,
                'name' => $team->name,
                'personal_team' => $team->personal_team,
                'created_at' => $team->created_at,
                'updated_at' => $team->updated_at,
                'members_count' => $team->members_count ?? 0,
                'invitations_count' => $team->invitations_count ?? 0,
                'pending_invitations_count' => $team->invitations_count ?? 0,
                'projects_count' => 0, // 将来的に実装
                'is_active' => true, // 将来的に実装
                'profile_photo_url' => null, // 将来的に実装
                'recent_members' => [], // 将来的に実装
                'recent_invitations' => [], // 将来的に実装
                'owner' => [
                    'id' => $team->owner->id,
                    'name' => $team->owner->name,
                    'email' => $team->owner->email,
                ],
            ];

            // オーナーかどうか
            $teamData['is_owner'] = $team->user_id === $user->id;

            // 現在のチームかどうか
            $teamData['is_current'] = $user->currentTeam && $user->currentTeam->id === $team->id;

            // ユーザーの役割を判定
            if ($team->user_id === $user->id) {
                $teamData['user_role'] = 'owner';
            } else {
                // Eager Loadingした結果を使用してメンバーかどうかを確認
                $isMember = $team->users->isNotEmpty();
                $teamData['user_role'] = $isMember ? 'member' : 'none';
            }

            // 権限情報
            $teamData['permissions'] = [
                'canView' => Gate::check('view', $team),
                'canUpdate' => Gate::check('update', $team),
                'canDelete' => Gate::check('delete', $team) && !$team->personal_team,
            ];

            return $teamData;
        })->toArray();

        return Inertia::render('Teams/Index', [
            'teams' => $teamsData,
            'pagination' => [
                'current_page' => $teams->currentPage(),
                'last_page' => $teams->lastPage(),
                'per_page' => $teams->perPage(),
                'total' => $teams->total(),
                'from' => $teams->firstItem(),
                'to' => $teams->lastItem(),
                'links' => $teams->linkCollection(),
            ],
            'filters' => [
                'search' => $search,
                'type' => $type,
                'role_filter' => $roleFilter,
                'member_count' => $memberCount,
                'sort_by' => $sortBy,
            ],
            'stats' => [
                'total' => $totalTeams,
                'filtered' => $teams->total(),
                'showing' => $teams->count(),
                'from' => $teams->firstItem(),
                'to' => $teams->lastItem(),
            ],
            'jetstream' => [
                'hasTeamFeatures' => Jetstream::userHasTeamFeatures($user),
                'canCreateTeams' => Jetstream::userHasTeamFeatures($user) && Gate::check('create', Jetstream::newTeamModel()),
            ],
        ]);
    }
}
