import { createStyles, Text,stac } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundImage: `linear-gradient(-60deg, ${theme.colors.dark[4]} 0%, ${theme.colors.dark[7]
            } 100%)`,
        padding: theme.spacing.xl * 1.5,
        borderRadius: theme.radius.md,

        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
        },
    },
    customRoot:{
        flexWrap: 'wrap',
          flexDirection: 'row',
    },

    title: {
        color: theme.white,
        textTransform: 'uppercase',
        fontWeight: 700,
        fontSize: theme.fontSizes.sm,
    },

    generalStatsTitle:{
        order: '-1',
        flex: '1 0 100%',
        fontSize: theme.fontSizes.xl

    },
    count: {
        color: theme.white,
        fontSize: 32,
        lineHeight: 1,
        fontWeight: 700,
        marginBottom: theme.spacing.md,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    description: {
        color: theme.colors.dark[0],
        fontSize: theme.fontSizes.sm,
        marginTop: 5,
    },

    stat: {
        flex: 1,

        '& + &': {
            paddingLeft: theme.spacing.xl,
            marginLeft: theme.spacing.xl,
            borderLeft: `1px solid ${theme.colors.dark[3]}`,

            [theme.fn.smallerThan('sm')]: {
                paddingLeft: 0,
                marginLeft: 0,
                borderLeft: 0,
                paddingTop: theme.spacing.xl,
                marginTop: theme.spacing.xl,
                borderTop: `1px solid ${theme.colors.dark[3]}`,
            },
        },
    },
}));

const data = [
    {
        "title": "Days spent",
        "stats": "456133",
    },
    {
        "title": "Total mangoes",
        "stats": "2175",
    },
    {
        "title": "Total chapters",
        "stats": "1994",
    },
    {
        "title": "Total backlog",
        "stats": "1994",
    },
    {
        "title": "Total currently reading",
        "stats": "1994",
    },
    {
        "title": "Total finished",
        "stats": "1994",
    }
]



const GeneralStats = ({stats}) => {
    const { classes,cx } = useStyles();
    console.log(stats);

    function IndividualGroup({ title, stat }) {
        return (
            <div key={title+stat} className={classes.stat}>
                <Text align="center"className={classes.count}>{stat}</Text>
                <Text align="center" className={classes.title}>{title}</Text>
            </div>

        );
    }

    return (
        <>
            <div className={cx(classes.root, classes.customRoot)}>
            <Text pb={30} align="center" className={cx(classes.count,classes.generalStatsTitle)}>Your all time stats</Text>
            <IndividualGroup title="Days spent" stat={stats.days} />
            <IndividualGroup title="Total mangoes" stat={stats.totalMangoes} />
            <IndividualGroup title="Total chapters" stat={stats.totalChapters} />
            </div>
            <div className={cx(classes.root, classes.customRoot)}>            <IndividualGroup title="Total backlog" stat={stats.totalBacklog} />
            <IndividualGroup title="Total currently reading" stat={stats.totalCurrentlyReading} />
            <IndividualGroup title="Total finished" stat={stats.totalFinished} />
            </div>
        </>
    );
}

export default GeneralStats;