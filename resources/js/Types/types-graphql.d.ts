import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Article = {
  __typename?: 'Article';
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  tags: Array<Tag>;
  title: Scalars['String']['output'];
  user: User;
};

/** A paginated list of Article items. */
export type ArticlePaginator = {
  __typename?: 'ArticlePaginator';
  /** A list of Article items. */
  data: Array<Article>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type CreateArticleInput = {
  body: Scalars['String']['input'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title: Scalars['String']['input'];
  user_id?: InputMaybe<Scalars['ID']['input']>;
};

export type FilterArticleInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
  user_name?: InputMaybe<Scalars['String']['input']>;
};

export type FilterTagInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FilterTeamInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type FilterUserInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  associateUserArticle?: Maybe<Article>;
  attachTagsArticle?: Maybe<Article>;
  createArticle?: Maybe<Article>;
  deleteArticle?: Maybe<Article>;
  detachTagsArticle?: Maybe<Article>;
  syncTagsArticle?: Maybe<Article>;
  syncTagsByNameArticle?: Maybe<Article>;
  updateArticle: Article;
};


export type MutationAssociateUserArticleArgs = {
  id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};


export type MutationAttachTagsArticleArgs = {
  id: Scalars['ID']['input'];
  tagIds: Array<Scalars['ID']['input']>;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationDeleteArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDetachTagsArticleArgs = {
  id: Scalars['ID']['input'];
  tagIds: Array<Scalars['ID']['input']>;
};


export type MutationSyncTagsArticleArgs = {
  id: Scalars['ID']['input'];
  tagIds: Array<Scalars['ID']['input']>;
};


export type MutationSyncTagsByNameArticleArgs = {
  id: Scalars['ID']['input'];
  tagNames: Array<Scalars['String']['input']>;
};


export type MutationUpdateArticleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateArticleInput;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM'
}

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int']['output'];
  /** Index of the current page. */
  currentPage: Scalars['Int']['output'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']['output']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean']['output'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']['output']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output'];
  /** Number of items per page. */
  perPage: Scalars['Int']['output'];
  /** Number of total available items. */
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  articles: ArticlePaginator;
  loginUser?: Maybe<User>;
  tag?: Maybe<Tag>;
  tags: TagPaginator;
  team?: Maybe<Team>;
  teams: TeamPaginator;
  user?: Maybe<User>;
  users: UserPaginator;
};


export type QueryArticleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryArticlesArgs = {
  first?: Scalars['Int']['input'];
  input?: InputMaybe<FilterArticleInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  first?: Scalars['Int']['input'];
  input?: InputMaybe<FilterTagInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTeamArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeamsArgs = {
  first?: Scalars['Int']['input'];
  input?: InputMaybe<FilterTeamInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  first?: Scalars['Int']['input'];
  input?: InputMaybe<FilterUserInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

export type Tag = {
  __typename?: 'Tag';
  articles: ArticlePaginator;
  articles_count?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};


export type TagArticlesArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** A paginated list of Tag items. */
export type TagPaginator = {
  __typename?: 'TagPaginator';
  /** A list of Tag items. */
  data: Array<Tag>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type Team = {
  __typename?: 'Team';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  personal_team: Scalars['Boolean']['output'];
  teamInvitations: Array<TeamInvitation>;
  users: UserPaginator;
};


export type TeamUsersArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type TeamInvitation = {
  __typename?: 'TeamInvitation';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: Scalars['String']['output'];
  team?: Maybe<Team>;
};

/** A paginated list of Team items. */
export type TeamPaginator = {
  __typename?: 'TeamPaginator';
  /** A list of Team items. */
  data: Array<Team>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type UpdateArticleInput = {
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
  user_id?: InputMaybe<Scalars['ID']['input']>;
};

export type User = {
  __typename?: 'User';
  allTeams: Array<Team>;
  articles: ArticlePaginator;
  created_at: Scalars['DateTime']['output'];
  current_team_id?: Maybe<Scalars['ID']['output']>;
  email: Scalars['String']['output'];
  followers: UserPaginator;
  following: UserPaginator;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  ownedTeams: Array<Team>;
  profile_photo_path?: Maybe<Scalars['String']['output']>;
  teams: Array<Team>;
  updated_at: Scalars['DateTime']['output'];
};


export type UserArticlesArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type UserFollowersArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type UserFollowingArgs = {
  first: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: 'UserPaginator';
  /** A list of User items. */
  data: Array<User>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, name: string, email: string, current_team_id?: string | null, profile_photo_path?: string | null, articles: { __typename?: 'ArticlePaginator', paginatorInfo: { __typename?: 'PaginatorInfo', count: number, total: number }, data: Array<{ __typename?: 'Article', id: string, title: string, tags: Array<{ __typename?: 'Tag', name: string }> }> }, followers: { __typename?: 'UserPaginator', data: Array<{ __typename?: 'User', name: string }> }, following: { __typename?: 'UserPaginator', data: Array<{ __typename?: 'User', name: string }> }, ownedTeams: Array<{ __typename?: 'Team', name: string }>, teams: Array<{ __typename?: 'Team', name: string }> } | null };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Article: ResolverTypeWrapper<Article>;
  ArticlePaginator: ResolverTypeWrapper<ArticlePaginator>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateArticleInput: CreateArticleInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  FilterArticleInput: FilterArticleInput;
  FilterTagInput: FilterTagInput;
  FilterTeamInput: FilterTeamInput;
  FilterUserInput: FilterUserInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  OrderByClause: OrderByClause;
  OrderByRelationAggregateFunction: OrderByRelationAggregateFunction;
  OrderByRelationWithColumnAggregateFunction: OrderByRelationWithColumnAggregateFunction;
  PaginatorInfo: ResolverTypeWrapper<PaginatorInfo>;
  Query: ResolverTypeWrapper<{}>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tag: ResolverTypeWrapper<Tag>;
  TagPaginator: ResolverTypeWrapper<TagPaginator>;
  Team: ResolverTypeWrapper<Team>;
  TeamInvitation: ResolverTypeWrapper<TeamInvitation>;
  TeamPaginator: ResolverTypeWrapper<TeamPaginator>;
  Trashed: Trashed;
  UpdateArticleInput: UpdateArticleInput;
  User: ResolverTypeWrapper<User>;
  UserPaginator: ResolverTypeWrapper<UserPaginator>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Article: Article;
  ArticlePaginator: ArticlePaginator;
  Boolean: Scalars['Boolean']['output'];
  CreateArticleInput: CreateArticleInput;
  DateTime: Scalars['DateTime']['output'];
  FilterArticleInput: FilterArticleInput;
  FilterTagInput: FilterTagInput;
  FilterTeamInput: FilterTeamInput;
  FilterUserInput: FilterUserInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  OrderByClause: OrderByClause;
  PaginatorInfo: PaginatorInfo;
  Query: {};
  String: Scalars['String']['output'];
  Tag: Tag;
  TagPaginator: TagPaginator;
  Team: Team;
  TeamInvitation: TeamInvitation;
  TeamPaginator: TeamPaginator;
  UpdateArticleInput: UpdateArticleInput;
  User: User;
  UserPaginator: UserPaginator;
};

export type ArticleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = {
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticlePaginatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ArticlePaginator'] = ResolversParentTypes['ArticlePaginator']> = {
  data?: Resolver<Array<ResolversTypes['Article']>, ParentType, ContextType>;
  paginatorInfo?: Resolver<ResolversTypes['PaginatorInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  associateUserArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationAssociateUserArticleArgs, 'id' | 'user_id'>>;
  attachTagsArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationAttachTagsArticleArgs, 'id' | 'tagIds'>>;
  createArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationCreateArticleArgs, 'input'>>;
  deleteArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationDeleteArticleArgs, 'id'>>;
  detachTagsArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationDetachTagsArticleArgs, 'id' | 'tagIds'>>;
  syncTagsArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationSyncTagsArticleArgs, 'id' | 'tagIds'>>;
  syncTagsByNameArticle?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<MutationSyncTagsByNameArticleArgs, 'id' | 'tagNames'>>;
  updateArticle?: Resolver<ResolversTypes['Article'], ParentType, ContextType, RequireFields<MutationUpdateArticleArgs, 'id' | 'input'>>;
};

export type PaginatorInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatorInfo'] = ResolversParentTypes['PaginatorInfo']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  currentPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  firstItem?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  hasMorePages?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastItem?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  lastPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  article?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType, RequireFields<QueryArticleArgs, 'id'>>;
  articles?: Resolver<ResolversTypes['ArticlePaginator'], ParentType, ContextType, RequireFields<QueryArticlesArgs, 'first'>>;
  loginUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  tags?: Resolver<ResolversTypes['TagPaginator'], ParentType, ContextType, RequireFields<QueryTagsArgs, 'first'>>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType, RequireFields<QueryTeamArgs, 'id'>>;
  teams?: Resolver<ResolversTypes['TeamPaginator'], ParentType, ContextType, RequireFields<QueryTeamsArgs, 'first'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<ResolversTypes['UserPaginator'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'first'>>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  articles?: Resolver<ResolversTypes['ArticlePaginator'], ParentType, ContextType, RequireFields<TagArticlesArgs, 'first'>>;
  articles_count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagPaginatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagPaginator'] = ResolversParentTypes['TagPaginator']> = {
  data?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  paginatorInfo?: Resolver<ResolversTypes['PaginatorInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Team'] = ResolversParentTypes['Team']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  personal_team?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  teamInvitations?: Resolver<Array<ResolversTypes['TeamInvitation']>, ParentType, ContextType>;
  users?: Resolver<ResolversTypes['UserPaginator'], ParentType, ContextType, RequireFields<TeamUsersArgs, 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamInvitationResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamInvitation'] = ResolversParentTypes['TeamInvitation']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['Team']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamPaginatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['TeamPaginator'] = ResolversParentTypes['TeamPaginator']> = {
  data?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  paginatorInfo?: Resolver<ResolversTypes['PaginatorInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  allTeams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  articles?: Resolver<ResolversTypes['ArticlePaginator'], ParentType, ContextType, RequireFields<UserArticlesArgs, 'first'>>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  current_team_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['UserPaginator'], ParentType, ContextType, RequireFields<UserFollowersArgs, 'first'>>;
  following?: Resolver<ResolversTypes['UserPaginator'], ParentType, ContextType, RequireFields<UserFollowingArgs, 'first'>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownedTeams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  profile_photo_path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teams?: Resolver<Array<ResolversTypes['Team']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPaginatorResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPaginator'] = ResolversParentTypes['UserPaginator']> = {
  data?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  paginatorInfo?: Resolver<ResolversTypes['PaginatorInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Article?: ArticleResolvers<ContextType>;
  ArticlePaginator?: ArticlePaginatorResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  PaginatorInfo?: PaginatorInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagPaginator?: TagPaginatorResolvers<ContextType>;
  Team?: TeamResolvers<ContextType>;
  TeamInvitation?: TeamInvitationResolvers<ContextType>;
  TeamPaginator?: TeamPaginatorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPaginator?: UserPaginatorResolvers<ContextType>;
};

