import { createStyles, Container, Group, ActionIcon, Text, Center, Space } from '@mantine/core';
import { FaGithub } from 'react-icons/fa';

const useStyles = createStyles((theme) => ({
    footer: {
        position:'relative',
        marginTop:'10px',
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xs,
        paddingBottom: theme.spacing.xs,
        maxWidth:'1440',
        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    links: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
}));




const Footer = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <Center>
                    <Text className='logoOnly'>MANGOTRACKO</Text>
                    <Space w="0.3em" />
                    <Text 
                    size="md" weight={550}>powered by</Text>
                    <Space w="0.3em" />
                    <a 
                    href="https://anilist.co"
                        target="_blank"
                    >
                        <img
                            style={{
                                width: '30px',
                                height: 'auto'
                            }}
                            src="https://anilist.co/img/icons/icon.svg"
                        />
                    </a>
                </Center>
                <Group 
                spacing={0} className={classes.links} position="right" noWrap>
                    <ActionIcon component="a" target="_blank"
                     href="https://github.com/mimorphism/mangotracko"
                    size="lg">
                        <FaGithub size={25} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Container>
        </div>

    );
}

export default Footer;