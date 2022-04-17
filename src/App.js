import Header from './Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import UpdateMango from './UpdateMango';
import { Global } from '@mantine/core';
import CurrentlyReading from './CurrentlyReading';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import FinishedReading from './FinishedReading';

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache()
});


function App() {

  return (
    <MantineProvider theme={{
      colorScheme: 'dark',
      fontFamily: 'Quicksand, sans-serif'
      }}
      >
        <Global
        styles={(theme) =>({
          fontFamily: 'Quicksand, sans-serif',
          h1:
          {
            textAlign: 'center',
            fontSize: '48px',
            fontWeight: 800,
            display:'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position:'relative',
            top: `2.5em`,
          }
        })}
        >
        </Global>
    <Router>
    <div className="App">
      <Header/>
      <div className="content">
        <Switch>
        <ApolloProvider client={client}>
          <Route path = "/currentlyreading">
          <CurrentlyReading/>
          </Route>
          <Route path = "/finishedreading">
          <FinishedReading/>
          </Route>
          <Route path = "/updatemango">
          <UpdateMango/>
          </Route>
          </ApolloProvider>
        </Switch>
        </div>
    </div>
    </Router>
    </MantineProvider>
  );
}

export default App;
