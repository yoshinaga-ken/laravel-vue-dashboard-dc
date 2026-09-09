---
paths:
  - 'resources/js/**'
---

# Graphql

## Apollo Client 4 Vue Apollo compat
Apollo Client 4 requires an explicit `HttpLink` and `SetContextLink` (callback args are `prevContext`, then `operation`). GraphQL errors use `CombinedGraphQLErrors.is(error)` and `error.errors`, not `graphQLErrors`/`networkError`. Vue Apollo v5 composables keep v4 signatures only via `@vue/apollo-composable/compat`; `DefaultApolloClient` stays on the main package. Keep `graphql-tag` for `gql` documents.
