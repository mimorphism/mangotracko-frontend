import { FaGrimace } from 'react-icons/fa';
import {
    createStyles, Notification,
} from '@mantine/core';


const ErrorPopup = ({error}) => {


const useStyles = createStyles((theme, _params, getRef) => ({
        notifsTitle:
        {
            fontSize: '25',
            color: theme.colors.red
        },
        notifsDesc:
        {
            fontSize:'20',
            color: theme.colors.red
        },
        notification:
        {
            color: theme.colors.dark[0],
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '0'
        }
    }));

    const { classes } = useStyles();





    return ( 
        <>{error && <Notification fontSize="lg" className={classes.notification} 
        icon={<FaGrimace size={90} />} color="red" 
        classNames={
            {
                 title:  classes.notifsTitle,
                 description: classes.notifsDesc 
                 }
                 } 
        disallowClose title="Oops, something went wrong!">
        {error}</Notification>}</>
     );
}
 
export default ErrorPopup;