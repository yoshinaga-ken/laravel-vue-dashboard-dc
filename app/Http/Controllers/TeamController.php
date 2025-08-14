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
        $memberCount = $request->get('member_count');
        $sortBy = $request->get('sort_by', 'created_desc');

        // ベースクエリ - ユーザーが所属するすべてのチーム
        // ユーザーが所有するチーム + ユーザーが所属するチーム
        $ownedTeamIds = $user->ownedTeams()->pluck('teams.id');
        $memberTeamIds = $user->teams()->pluck('teams.id');
        $allTeamIds = $ownedTeamIds->merge($memberTeamIds)->unique();

        $query = Jetstream::newTeamModel()::whereIn('id', $allTeamIds)
            ->with(['owner', 'teamInvitations'])
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
        $perPage = $request->get('per_page', 12);
        $page = $request->get('page', 1);

        // per_page バリデーション
        if (!in_array($perPage, [5, 6, 12, 24, 48])) {
            $perPage = 12;
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

        // 統計情報 - フィルター適用前の総数を取得
        $totalQuery = Jetstream::newTeamModel()::whereIn('id', $allTeamIds);
        $totalTeams = $totalQuery->count();

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
            
            // ユーザーの役割
            $teamData['user_role'] = $team->user_id === $user->id ? 'owner' : 'member';
            
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
                'canCreateTeams' => Jetstream::userHasTeamFeatures($user) && Gate::check('create', Jetstream::newTeamModel()),
            ],
        ]);
    }
}
