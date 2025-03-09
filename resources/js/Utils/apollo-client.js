import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {usePage} from "@inertiajs/vue3";


const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

