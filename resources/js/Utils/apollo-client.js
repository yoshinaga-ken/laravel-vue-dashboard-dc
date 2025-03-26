import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {usePage} from "@inertiajs/vue3";


const httpLink = createHttpLink({
  uri: (import.meta.env.DEV ? '/' : import.meta.env.VITE_DOCUMENT_ROOT) + 'graphql',
});

const authLink = setContext((_, {headers}) => {
  let token = localStorage.getItem('token');
  if (!token) {
    const page = usePage()
    token = page.props.apiToken
  }
  return {
    headers: {
      ...headers,
      ...(token && {authorization: `Bearer ${token}`}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

