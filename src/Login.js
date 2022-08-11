import {
    Text, Textarea, NumberInput, TextInput, Button, Paper, Modal, Center, Chips, Chip, Space,
    createStyles, LoadingOverlay, Notification, PasswordInput, Checkbox
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useContext } from 'react';
import AuthService from './services/AuthService';
import { UserContext } from './services/UserContext';
import { useState, useEffect } from 'react';
import { FaDatabase, FaCheck, FaGrimace } from 'react-icons/fa';
import ErrorPopup from './ErrorPopup';




const Login = () => {

    const {state, dispatch} = useContext(UserContext);
    const largeScreen = useMediaQuery('(min-width: 900px)');
    const [error, setError] = useState("");


    const useStyles = createStyles((theme, _params, getRef) => ({
        standardFont: {
            // fontFamily: "'Quicksand', sans-serif",
            textTransform: 'uppercase'
        },
        div: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            msTransform: 'translate(-50%, -50%)',
        },
        controls:
        {
            width: '100%'
        },
        paper:
        {
            maxWidth:'500px',
            width:`calc(100vw - 20vw)`,
        }
    }));

    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },
        validate: {
            username: (value) => (value.length < 3 ? 'Username length must be longer than 3 characters':null),
            password: (value) => (value.length < 2 ? 'Password length must be longer than 5 characters':null)
        },
        
    });


    const { classes } = useStyles();

    const tryLogin = (values) =>
    {
        AuthService.login(values.username, values.password).then((userData) => 
        {
            setError("");
            dispatch({ type: 'LOGGED_IN', value: userData.user });
            console.log("login sukses?: " + userData.user); 
        }).catch(error => setError(error));
        
    }

    return (

            <Center className={classes.div}>
                <form onSubmit={form.onSubmit((values) => tryLogin(values))}>
                    <Paper className={classes.paper} p='xl' pt={0} size={largeScreen ? 'xl' : 'md'}>
                        <Center><h2>LOGIN</h2></Center>
                        <TextInput {...form.getInputProps('username')} className={classes.controls} size={largeScreen ? 'xl' : 'md'} label="Username">
                        </TextInput>
                        <Space h="md" />
                        <PasswordInput  {...form.getInputProps('password')} className={classes.controls} size={largeScreen ? 'xl' : 'md'} label="Password">
                        </PasswordInput>
                        <Space h="xl" />
                        {/* <Checkbox size={largeScreen ? 'xl' : 'md'} checked={false} label="Remember password" />
                        <Space h="xl" /> */}
                        <Button size={largeScreen ? 'xl' : 'md'} className={classes.controls} type="submit" >Login</Button>
                        {error && <ErrorPopup error={error.message}></ErrorPopup>}
                    </Paper>
                </form>
            </Center>

    );
}

export default Login;