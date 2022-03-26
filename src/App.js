import Header from './Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OngoingMango from './OngoingMango';
import { MantineProvider } from '@mantine/core';
import UpdateMango from './UpdateMango';
import { Global } from '@mantine/core';

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
          <Route path = "/ongoingmango">
          <OngoingMango/>
          </Route>
          <Route path = "/completedmango">
          <OngoingMango/>
          </Route>
          <Route path = "/updatemango">
          <UpdateMango/>
          </Route>
        </Switch>
        </div>
    </div>
    </Router>
    </MantineProvider>
  );
}

export default App;
