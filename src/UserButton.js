import { Menu, createStyles, UnstyledButton } from '@mantine/core';
import { FaUserAstronaut } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const UserButton = ({ username, tryLogout }) => {

  const useStyles = createStyles((theme, _params, getRef) => ({

    texts: {
      fontSize: theme.fontSizes.sm,
      fontWeight: '800',
      [`@media (max-width: 1024px)`]: {
        fontSize: theme.fontSizes.sm,
      },
    },
    userIcon: {
      display: 'inline-block',
      padding: '0',
      marginTop: '15px',
      marginBottom: '15px',
      marginLeft: '30px',
      marginRight: '0px',
      position: 'relative',
      textDecoration: 'none',
      textTransform: 'uppercase',
      fontWeight: '800',
      fontSize: '1rem',
      // bottom: '6',
      shadows: theme.shadows.xl,


      [`@media (max-width: 1024px)`]: {
        fontSize: theme.fontSizes.md,
      },
    }
  }));

  const { classes } = useStyles();

  return (
    <Menu position="bottom"
      radius={0} size="xl" className={classes.texts}
      trigger="hover" openDelay={100} closeDelay={100}>
      <Menu.Target>
        <div className={classes.userIcon}>
          <UnstyledButton
          ><FaUserAstronaut
              color="white" size="2.5rem" /></UnstyledButton>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label className={classes.texts}>User: {username}</Menu.Label>
        <Menu.Divider />
        <Menu.Item className={classes.texts} component={Link} to="home">STATS</Menu.Item>
        <Menu.Item
          color="red" onClick={() => tryLogout()}
          className={classes.texts}
        >LOGOUT</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}


export default UserButton;