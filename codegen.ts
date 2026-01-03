import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://127.0.0.1:8000/graphql", // GraphQLエンドポイントを指定
  generates: {
    "resources/js/Types/types-graphql.d.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-resolvers"
      ]
    }
  }
};

export default config;
