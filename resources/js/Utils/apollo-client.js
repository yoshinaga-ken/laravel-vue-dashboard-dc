import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { usePage } from '@inertiajs/vue3'

const httpLink = new HttpLink({
  uri:
    import.meta.env.VITE_APP_URL +
    (import.meta.env.DEV ? '/' : import.meta.env.VITE_DOCUMENT_ROOT) +
    'graphql',
})

const authLink = new SetContextLink(prevContext => {
  let token = localStorage.getItem('token')
  if (!token) {
    const page = usePage()
    token = page.props?.apiToken ?? import.meta.env.VITE_API_TOKEN
  }
  return {
    headers: {
      ...prevContext.headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
