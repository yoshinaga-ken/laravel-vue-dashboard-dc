<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TeamPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Team $team): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Team $team): bool
    {
        return $user->ownsTeam($team) || $this->hasTeamRole($user, $team, 'admin');
    }

    /**
     * Determine whether the user can add team members.
     */
    public function addTeamMember(User $user, Team $team): bool
    {
        // 個人チームにはメンバーを追加できない
        if ($team->personal_team) {
            return false;
        }

        return $user->ownsTeam($team) || $this->hasTeamRole($user, $team, 'admin');
    }

    /**
     * Determine whether the user can update team member permissions.
     */
    public function updateTeamMember(User $user, Team $team, User $teamMember = null): bool
    {
        // 引数が古い形式（team memberなし）の場合の互換性維持
        if ($teamMember === null) {
            return $user->ownsTeam($team) || $this->hasTeamRole($user, $team, 'admin');
        }

        // 所有者の役割は変更できない
        if ($team->user_id === $teamMember->id) {
            return false;
        }

        return $user->ownsTeam($team) || $this->hasTeamRole($user, $team, 'admin');
    }

    /**
     * Determine whether the user can remove team members.
     */
    public function removeTeamMember(User $user, Team $team, User $teamMember = null): bool
    {
        // 引数が古い形式（team memberなし）の場合の互換性維持
        if ($teamMember === null) {
            return $user->ownsTeam($team) || $this->hasTeamRole($user, $team, 'admin');
        }

        // 個人チームから自分自身を削除することはできない
        if ($team->personal_team && $user->id === $teamMember->id) {
            return false;
        }

        // 所有者を削除することはできない（自分自身でも不可）
        if ($team->user_id === $teamMember->id) {
            return false;
        }

        // 自分自身を削除する場合（離脱）
        if ($user->id === $teamMember->id) {
            return $user->belongsToTeam($team);
        }

        // 他のメンバーを削除する場合
        return $user->ownsTeam($team) || $this->hasTeamRole($user, $team, 'admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        // 個人チームは削除できない
        if ($team->personal_team) {
            return false;
        }

        return $user->ownsTeam($team);
    }

    /**
     * チーム切り替え権限チェック
     */
    public function switchTo(User $user, Team $team): bool
    {
        return $user->belongsToTeam($team);
    }

    /**
     * ユーザーが指定した役割を持っているかチェック
     */
    public function hasTeamRole(User $user, Team $team, string $role): bool
    {
        return $team->users()
            ->where('user_id', $user->id)
            ->where('role', $role)
            ->exists();
    }
}
