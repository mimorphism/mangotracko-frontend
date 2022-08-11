import { Menu, createStyles, Space, UnstyledButton } from '@mantine/core';
import { FaUserAstronaut } from 'react-icons/fa';

const LogoutButton = ({ username, tryLogout }) => {

  const useStyles = createStyles((theme, _params, getRef) => ({

    texts: {
      fontSize: theme.fontSizes.sm,
      fontWeight: '800',
      [`@media (max-width: 1024px)`]: {
        fontSize: theme.fontSizes.sm,
      },
    },
  }));

  const { classes } = useStyles();

  return (
    <Menu position="bottom" 
      radius={0} size="xl" className={classes.texts}
      trigger="hover" openDelay={100} closeDelay={100}>
      <Menu.Target>
        <div className='headerLinkWrapper'>
          <UnstyledButton
          ><FaUserAstronaut
              color="white" size="2.5rem" /></UnstyledButton>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label className={classes.texts}>User: {username}</Menu.Label>
        <Menu.Divider />
        <Menu.Item
          color="red" onClick={() => tryLogout()}
          className={classes.texts}
        >LOGOUT</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}


export default LogoutButton;