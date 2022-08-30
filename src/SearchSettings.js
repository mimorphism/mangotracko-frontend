import { createStyles, Card, Group, Switch, Text, Space } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    item: {
        '& + &': {
            paddingTop: theme.spacing.sm,
            marginTop: theme.spacing.sm,
            borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
        },
    },

    titleGroup: {
        paddingBottom: theme.spacing.md,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
            }`,

    },

    switch: {
        '& *': {
            cursor: 'pointer',
        },
    },

    title: {
        lineHeight: 1,
    },
}));




const SearchSettings = ({ isAdult, setIsAdult }) => {

    const { classes } = useStyles();

    return (
        <Card withBorder radius="md" p="xl" className={classes.card}>
            <Group className={classes.titleGroup} >
                <Text size="lg" className={classes.title} weight={800}>
                    Search settings
                </Text>
            </Group>
            <Space h="sm" />
            <Group position="apart" className={classes.item} noWrap spacing="xl">
                <div>
                    <Text>Filter adult content</Text>
                </div>
                <Switch
                    checked={isAdult}
                    onLabel="ON" offLabel="OFF" onChange={(event) => setIsAdult(event.currentTarget.checked)}
                    className={classes.switch} size="lg" />
            </Group>
        </Card>
    );
}

export default SearchSettings;