export interface User {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
    is_followed_by: boolean,
    followers: Array<User>,
    following: Array<User>,
}
export interface Tag {
    id: number,
    name: string,
}
export interface Article {
    id: number,
    title: string,
    body: string,
    is_liked_by: boolean,
    created_at: string,
    updated_at: string,
    user: User,
    likes: Array<User>,
    tags: Array<Tag>,
}
export interface Role {
  key: string,
  name: string,
  description: string,
  permissions: Object[],
}
export interface Permission {
    canCreateArticle: boolean,
    canUpdateArticle: boolean,
    canDeleteArticle: boolean,
}
