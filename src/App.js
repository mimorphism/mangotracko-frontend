import Header from './Header';
import Footer from './Footer';
import { Router, Route, Switch } from 'react-router-dom';
import { createStyles, MantineProvider, ScrollArea } from '@mantine/core';
import UpdateMango from './UpdateMango';
import CurrentlyReading from './CurrentlyReading';
import FinishedReading from './FinishedReading';
import SearchMango from './SearchMango';
import { apolloClientInstance } from './apolloClientInstance';
import { ApolloProvider } from "@apollo/client";
import Login from './Login';
import { useReducer, useEffect } from 'react';
import { UserContext } from './services/UserContext';
import history from './history';
import Backlog from './Backlog';
import { Helmet } from "react-helmet";
import { NotificationsProvider } from '@mantine/notifications';
import GlobalStyles from './GlobalStyles';
import { useMediaQuery } from '@mantine/hooks';
import { PageNotFound } from './PageNotFound';




function App() {


  const initialState =
  {
    loggedin: false,
    username: ""
  }

  const loginReducer = (state, action) => {
    switch (action.type) {
      case "LOGGED_IN":
        return { loggedin: true, username: action.value };
      case "LOGGED_OUT":
        return { loggedin: false, username: "" }
      default:
        return initialState;
    }
  }


  const [state, dispatch] = useReducer(loginReducer, initialState);



  const useStyles = createStyles(() => ({
    content: {
      flex:'1 1 auto',
      maxWidth: '1440px',
      width: `calc(100vw - 20vw)`,
      height: 'calc(100vh - 18vh)',
      margin: `0 auto`,
      [`@media (max-width: 1024px)`]: {
        height: 'calc(100vh - 5vh)',

      },

    },

    main: {
      // overflow: 'hidden',
      display:'flex',
      flexDirection:'column',
      height:'100%',
    }

  }
  ));

  const { classes } = useStyles();
  const matchesMobileView = useMediaQuery('(min-width: 1024px)');


  useEffect(() => {
    if (localStorage.getItem('user')) {
      dispatch({ type: 'LOGGED_IN', value: JSON.parse(localStorage.getItem('user')).user });
    }
  }, [])


  return (
    <MantineProvider theme={{
      colorScheme: 'dark',
      fontFamily: 'Quicksand, sans-serif',
    }
    }
    >
      <NotificationsProvider autoClose={4000}>
        <GlobalStyles />
        <Helmet>
          <title>MangoTracko</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        </Helmet>
        <Router history={history}>
          <div className={!state.loggedin ? "main" : classes.main}>
            <UserContext.Provider value={{ state, dispatch }}>
              {!state.loggedin ? <Login /> : <>
                <Header username={state.username} />
                <ScrollArea offsetScrollbars scrollbarSize={4} className={classes.content}>
                <ApolloProvider client={apolloClientInstance}>
                  <Switch>
                      <Route exact path="/currentlyreading">
                        <CurrentlyReading />
                      </Route>
                      <Route exact path="/finished">
                        <FinishedReading />
                      </Route>
                      <Route exact path="/updatemango">
                        <UpdateMango />
                      </Route>
                      <Route exact path="/addmango">
                        <SearchMango />
                      </Route>
                      <Route exact path="/backlog">
                        <Backlog />
                      </Route>
                    <Route path="*">
                    <PageNotFound/>
                    </Route>
                  </Switch>
                </ApolloProvider>
                </ScrollArea>
            {matchesMobileView && <Footer/>}
            </>}
          </UserContext.Provider>
          </div>
        </Router>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
