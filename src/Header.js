import { Link } from "react-router-dom";
import { createStyles, Center, Text, Group, UnstyledButton, Container } from '@mantine/core';
import { useContext, useReducer, useEffect, useState } from 'react';
import { UserContext } from './services/UserContext';
import AuthService from './services/AuthService';
import { useLocation } from "react-router-dom";
import { useMediaQuery } from '@mantine/hooks';
import MobileMenu from "./MobileMenu";
import { FaSearchengin } from 'react-icons/fa';
import UserButton from "./UserButton";
import { notifyLoadingCallback } from "./util/utils";
import TokenService from "./services/TokenService";



const Header = ({ username }) => {


  const { state, dispatch } = useContext(UserContext);
  const currentRoute = useLocation().pathname;

  const toggleActivePage = (state, action) => {
    switch (action.type) {
      case "BACKLOG":
        return { BACKLOG: true, CTLY_READING: false, FINISHED: false, SEARCH: false };
      case "CTLY_READING":
        return { BACKLOG: false, CTLY_READING: true, FINISHED: false, SEARCH: false };
      case "FINISHED":
        return { BACKLOG: false, CTLY_READING: false, FINISHED: true, SEARCH: false };
      case "SEARCH":
        return { BACKLOG: false, CTLY_READING: false, FINISHED: false, SEARCH: true };
      default:
        return initialState;
    }
  }

  const initialActiveState =
  {
    BACKLOG: false,
    CTLY_READING: false,
    FINISHED: false,
    SEARCH: false
  }



  const [activePage, toggle] = useReducer(toggleActivePage, initialActiveState);

  useEffect(() => {
    if (currentRoute === '/backlog') {
      toggle({ type: 'BACKLOG', value: true });
    }
    else if (currentRoute === '/finishedreading') {
      toggle({ type: 'FINISHED', value: true });
    }
    else if (currentRoute === '/currentlyreading') {
      toggle({ type: 'CTLY_READING', value: true });
    }
    else if (currentRoute === '/search') {
      toggle({ type: 'SEARCH', value: true });
    }

  }, []);



  const useStyles = createStyles((theme, _params, getRef) => ({

    header: {

      ref: getRef('header'),
      // display: 'flex',
      textAlign: 'right',
      lineHeight: '40px',
      padding: '0 30px',
      position: `relative`,
      // flex: '0 1 auto',
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,

      [`@media (max-width: 1024px)`]: {
        padding: 0,
        backgroundColor: theme.colors.dark[4],
        borderBottom: 'none',
        justifyContent: 'center',
        '&:before': {
          content: 'none',
        }
      },
    },

    logo:
    {
      letterSpacing: '2px',
      position: 'relative',
      display: 'inline-block',
      top: '0',
      left: 0,
      textDecoration: 'none',
      textTransform: 'uppercase',
      color: theme.colors.dark[9],
      fontSize: '1.5rem',
      fontWeight: 800,
      display: 'flex',
      justifyContent: 'center',


      [`&:hover .${getRef('logoBar')}`]: {
        opacity: 1,
        bottom: `-6px`,//'127px',
      }

    },


    operationsList:
    {

      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: 0,
      margin: 0
    },


    linkBar:
    {
      ref: getRef('linkBar'),
      width: '100%',
      display: 'inline-block',
      borderBottom: '5px solid white',
      position: 'absolute',
      bottom: '0',
      left: 0,
      opacity: 0,
      transition: 'all 300ms',
    },

    linkBarActive:
    {
      opacity: 1
    },

    container: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: theme.spacing.xs,
      alignItems: 'center',
      maxWidth:'1440px',
    },

  }));

  const { classes, cx } = useStyles();
  const matches = useMediaQuery('(min-width: 1025px)');



  const tryLogout = () => {
    AuthService.logout().then(() => {
      TokenService.removeUser();
      notifyLoadingCallback('See you again '+ username, 'logout','Logout succesful!', false );
  });
  dispatch({ type: 'LOGGED_OUT' });

};

return (
  <div className={classes.header}>
    {!matches &&
    <MobileMenu username={username} tryLogout={tryLogout}></MobileMenu>
    }
    
    
    {matches &&
      <Container className={classes.container}>
        {/* <div className={classes.operationsList}> */}
        <Center>
        <Link to="search" className='headerLinkWrapper'
        onClick={() => toggle({ type: 'SEARCH', value: true })}
          >Search
            <div className={cx(classes.linkBar, { [classes.linkBarActive]: activePage.SEARCH })}></div>
          </Link>
          <Link to="backlog" className='headerLinkWrapper'
            onClick={() => toggle({ type: 'BACKLOG', value: true })}
          >Backlog
            <div className={cx(classes.linkBar, { [classes.linkBarActive]: activePage.BACKLOG })}></div>
          </Link>
          <Link to="finished" className='headerLinkWrapper'
            onClick={() => toggle({ type: 'FINISHED', value: true })}
          >Finished
            <div className={cx(classes.linkBar, { [classes.linkBarActive]: activePage.FINISHED })}></div>
          </Link>
          <Link to="currentlyreading" className='headerLinkWrapper'
            onClick={() => toggle({ type: 'CTLY_READING', value: true })}
          >Currently Reading
            <div className={cx(classes.linkBar, { [classes.linkBarActive]: activePage.CTLY_READING })}></div>
          </Link>
          </Center>
          <Group 
                spacing={0} position="right" noWrap>
          <UserButton username={username} tryLogout={tryLogout} />
          </Group>
        {/* </div> */}
      </Container>
    }

  </div>
);
}

export default Header;