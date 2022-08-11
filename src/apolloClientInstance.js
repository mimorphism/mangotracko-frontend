import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

const BASE_URL = 'https://graphql.anilist.co';

const apolloClientInstance = new ApolloClient({
  uri: BASE_URL,
  cache: new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        Page: {
          // shorthand  
          merge: true,
        },
      },
    },
  },
})
});

export {apolloClientInstance};
