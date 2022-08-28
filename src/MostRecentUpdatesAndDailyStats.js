import { createStyles, Card, Image, Text, Group, Space, Stack } from '@mantine/core';
import { DailyStats } from './DailyStats';
import { getPrettifiedDate } from './util/utils';

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    title: {
        fontWeight: 700,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1.2,
    },

    body: {
        padding: theme.spacing.md,
    },
    container:{
        display:'flex',
    },
    statsCard:{
        flex:'1 1 auto'
    },
    mostRecentContainer:{
        backgroundImage: `linear-gradient(-60deg, ${theme.colors.dark[4]} 0%, ${theme.colors.dark[7]
      } 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    }

}));




const MostRecentUpdatesAndDailyStats = ({mostRecentUpdateStats, dailyStats}) => {
    const { classes } = useStyles();

    function StatsCard({ data,title,date }) {
        return (
            <Card withBorder radius="md" className={classes.card}>
                <Group noWrap spacing={0}>
                    <Image src={data.mango.img} width={190} height={180} />
                    <div className={classes.body}>
                        <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                            {title}
                        </Text>
                        <Text className={classes.title} mt="xs" mb="md">
                            {data.mango.mangoTitle}
                        </Text>
                        <Group noWrap spacing="xs">
                            <Text size="xs" color="dimmed">
                                {getPrettifiedDate(date)}
                            </Text>
                        </Group>
                    </div>
                </Group>
            </Card>);
            }
    function NoDataStatsCard({title}) {
        return (
            <Card withBorder radius="md" className={classes.card}>
                <Group noWrap spacing={0}>
                    <Image withPlaceholder src={null} width={140} />
                    <div className={classes.body}>
                        <Text align="left" transform="uppercase" color="dimmed" weight={700} size="xs">
                            {title}
                        </Text>
                        <Text transform="uppercase" color="dimmed" weight={700} size="xs">
                            NO DATA
                        </Text>
                    </div>
                </Group>
            </Card>);
            }


    return (
        <div className={classes.container}>
        <Stack justify="space-between" pr={10} className={classes.mostRecentContainer}>
        <Text  weight={700} size="md">Your recent updates</Text>
            {mostRecentUpdateStats.mostRecentBacklog ? <StatsCard data={mostRecentUpdateStats.mostRecentBacklog} title='Backlog' date={mostRecentUpdateStats.mostRecentBacklog.addedDateTime}/>:<NoDataStatsCard title='Backlog'/>}
            {mostRecentUpdateStats.mostRecentCurrentlyReading ? <StatsCard data={mostRecentUpdateStats.mostRecentCurrentlyReading} title='Currently reading' date={mostRecentUpdateStats.mostRecentCurrentlyReading.lastReadTime} />:<NoDataStatsCard title='Currently reading'/>}
            {mostRecentUpdateStats.mostRecentFinished ? <StatsCard data={mostRecentUpdateStats.mostRecentFinished} title=' Finished' date={mostRecentUpdateStats.mostRecentFinished.completionDateTime} />:<NoDataStatsCard title='Finished'/>}
        </Stack>
        <Space w="md" />
        <DailyStats stats={dailyStats}></DailyStats>
        </div>

    );
}


export default MostRecentUpdatesAndDailyStats;