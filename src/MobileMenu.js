import { Menu, createStyles,Burger, Space,Center } from '@mantine/core';
import {FaUserAstronaut} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MobileMenu = ({ username, tryLogout }) => {

    const useStyles = createStyles((theme, _params, getRef) => ({

        unstyledBtn:{
            color:'inherit',
            paddingRight:'2px'
        },
        mobileMenu:{
            // position:`absolute`,
            // right:`0`,
            // padding:`1.5em 3em`,
            bottom:0
        },
        texts:{
          padding:0,
          fontSize:theme.fontSizes.sm
        }


     }));

    const { classes} = useStyles();

    return ( 
    <Center>
    <Menu radius={0} size="lg" className={classes.texts} position="bottom-start">
    <Menu.Target>
    <Burger size={100}/>
    </Menu.Target>

     <Menu.Dropdown>
      <Menu.Item className={classes.texts} component={Link} to="backlog">BACKLOG</Menu.Item>
      <Menu.Item className={classes.texts} component={Link} to="currentlyreading">CURRENTLY READING</Menu.Item>
      <Menu.Item className={classes.texts} component={Link} to="finished">FINISHED</Menu.Item>
      <Menu.Item className={classes.texts} component={Link} to="addMango">ADD</Menu.Item>
      <Menu.Divider />
      <Menu.Item 
      color="red" onClick={() => tryLogout()}
      className={classes.texts}
      icon={<FaUserAstronaut size="2.5em"/>}>{username}<Space h="xs"></Space>LOGOUT</Menu.Item>
      </Menu.Dropdown>
    </Menu>
    </Center>
  );
}

 
export default MobileMenu;

