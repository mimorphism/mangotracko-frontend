import {
    Text, Group, Stack, TextInput, Button, Paper, Space,
    createStyles, Anchor, PasswordInput, Alert
} from '@mantine/core';
import { useMediaQuery, useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useContext } from 'react';
import AuthService from './services/AuthService';
import { UserContext } from './services/UserContext';
import { useState} from 'react';





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
        if (type !== 'register') {
            AuthService.login(values.username, values.password).then((userData) => {
                dispatch({ type: 'LOGGED_IN', value: userData.user });
            });
        } else {
            AuthService.register(values.username, values.password);
        }
    }

    return (
        <div className={classes.div}>
    {state.loggedOutByAnotherSession &&<Alert title="Bummer!" color="red">You've been logged out by another session</Alert> }
    {state.loggedOutSessionExpired &&<Alert title="Bummer!" color="red">Your session has expired. Please login again</Alert> }
    {state.loggedOutServerUnreachable &&<Alert title="Sorry!" color="red">MangoTracko is out of service at the moment!</Alert> }
        {!state.loggedOutServerUnreachable && <Paper radius="md" p="xl" withBorder >
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
        </Paper>}
        </div>
    );
}

export default Login;