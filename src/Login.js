import {
    Text, Group, Stack, TextInput, Button, Paper, Space,
    createStyles, LoadingOverlay, Anchor, PasswordInput,
} from '@mantine/core';
import { useMediaQuery, useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useContext } from 'react';
import AuthService from './services/AuthService';
import { UserContext } from './services/UserContext';
import { useState, useEffect } from 'react';





const Login = () => {

    const { state, dispatch } = useContext(UserContext);
    const largeScreen = useMediaQuery('(min-width: 900px)');
    const [error, setError] = useState("");
    const [type, toggle] = useToggle(['login', 'register']);


    const useStyles = createStyles((theme, _params, getRef) => ({
        div: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            msTransform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap'
        },
        controls:
        {
            width: '100%'
        },
        paper:
        {
            maxWidth: '500px',
            width: `calc(100vw - 20vw)`,
        }
    }));

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            username: (value) => (value.length <= 2 ? 'Username length must be longer than 3 characters' : null),
            password: (value) => (value.length <= 3 ? 'Password should include at least 6 characters' : null),
            confirmPassword: (value, values) => type === 'register' &&
                value !== values.password ? 'Passwords did not match' : null,
        },
    });


    const { classes } = useStyles();

    const authenticate = (values) => {
        console.log(values);
        if (type !== 'register') {
            AuthService.login(values.username, values.password).then((userData) => {
                dispatch({ type: 'LOGGED_IN', value: userData.user });
            });
        } else {
            AuthService.register(values.username, values.password);
        }
    }

    return (
        <Paper radius="md" p="xl" withBorder className={classes.div}>
            <Text size="lg" weight={500}>
                Welcome to MangoTracko, {type} with
            </Text>
            <Space h="md" />

            <form onSubmit={form.onSubmit((values) => authenticate(values))}>
                <Stack>
                    <TextInput
                        required
                        label="Username"
                        {...form.getInputProps('username')}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        {...form.getInputProps('password')}
                    />

                    {type === 'register' && (
                        <PasswordInput
                            required
                            label="Confirm password"
                            {...form.getInputProps('confirmPassword')}
                        />
                    )}
                </Stack>

                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => {toggle();form.reset()}}
                        size="xs"
                    >
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>
                    <Button type="submit">{upperFirst(type)}</Button>
                </Group>
            </form>
        </Paper>
        // <Center className={classes.div}>
        //     <form onSubmit={form.onSubmit((values) => tryLogin(values))}>
        //         <Paper className={classes.paper} p='xl' pt={0} size={largeScreen ? 'xl' : 'md'}>
        //             <Center><h2>LOGIN</h2></Center>
        //             <TextInput {...form.getInputProps('username')} className={classes.controls} size={largeScreen ? 'xl' : 'md'} label="Username"/>
        //             <Space h="md" />
        //             <PasswordInput  {...form.getInputProps('password')} className={classes.controls} size={largeScreen ? 'xl' : 'md'} label="Password"/>
        //             <Space h="xl" />
        //             <Button size={largeScreen ? 'xl' : 'md'} className={classes.controls} type="submit" >Login</Button>
        //             {error && <ErrorPopup error={error.message}></ErrorPopup>}
        //         </Paper>
        //     </form>
        // </Center>

    );
}

export default Login;