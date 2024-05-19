import { useState } from 'react';
import dayjs from 'dayjs';
import { createStyles, UnstyledButton, Text, Paper, Stack } from '@mantine/core';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { formatISO } from 'date-fns';


const useStyles = createStyles((theme) => ({
  root: {
    backgroundImage: `linear-gradient(-60deg, ${theme.colors.dark[4]} 0%, ${theme.colors.dark[7]
      } 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    flexDirection: 'column',
    flexGrow: 1
  },

  icon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.lg,
    color: theme.colors[theme.primaryColor][6],
  },

  stat: {
    minWidth: 98,
    paddingTop: theme.spacing.xl,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.white,
  },

  label: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colors.gray[6],
    lineHeight: 1.2,
  },

  value: {
    fontSize: 32,
    fontWeight: 700,
    color: theme.black,
  },

  count: {
    color: theme.colors.gray[6],
  },

  day: {
    fontSize: 44,
    fontWeight: 700,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  greetLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: 700,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  month: {
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center',
  },

  controls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
    marginBottom: theme.spacing.xl,
  },

  date: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  control: {
    color: theme.colors[theme.primaryColor][2],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    transition: 'background-color 50ms ease',
    height: 34,
    width: 34,

    '&:hover': {
      backgroundColor: theme.colors[theme.primaryColor][5],
      color: theme.white,
    },
  },

  controlIcon: {
    transform: 'rotate(-90deg)',
  },
}));


export function DailyStats({stats}) {
  const { classes } = useStyles();
  const currentDate = new Date();
  const [date, setDate] = useState(new Date());

  function IndividualStat({ stat,label }) {
    return (
      <Paper className={classes.stat} radius="md" shadow="md" p="xs">
        <div>
          <Text align="center" className={classes.label}>{label}</Text>
          <Text size="sm" className={classes.count} align="center">
            <span className={classes.value}>{stat} </span> {stat > 1 ? 'updates' : 'update'}
          </Text>
        </div>
      </Paper>);
  }

  return (
    <div className={classes.root}>
      <Text pb='10' align="center" className={classes.greetLabel}>Your activities this past week</Text>
      <div className={classes.controls}>
        <UnstyledButton
          className={classes.control}
          disabled={date < dayjs(currentDate).subtract(6, 'day').toDate()}
          onClick={() => setDate((current) => dayjs(current).subtract(1, 'day').toDate())}
        >
          <FaSortUp className={classes.controlIcon} stroke={1.5} />
        </UnstyledButton>

        <div className={classes.date}>
          <Text className={classes.day}>{dayjs(date).format('DD')}</Text>
          <Text className={classes.month}>{dayjs(date).format('MMMM')}</Text>
        </div>

        <UnstyledButton
          className={classes.control}
          disabled={date > dayjs(currentDate).toDate()}
          onClick={() => setDate((current) => dayjs(current).add(1, 'day').toDate())}
        >
          <FaSortDown className={classes.controlIcon} stroke={1.5} />
        </UnstyledButton>
      </div>
      <Stack>
        {stats[formatISO(date,{representation:'date'})] && <IndividualStat stat={stats[formatISO(date,{representation:'date'})].backlog} label='Backlog'></IndividualStat>}
        {stats[formatISO(date,{representation:'date'})] && <IndividualStat stat={stats[formatISO(date,{representation:'date'})].ctlyReading} label='Currently reading'></IndividualStat>}
        {stats[formatISO(date,{representation:'date'})] && <IndividualStat stat={stats[formatISO(date,{representation:'date'})].finished} label='Finished'></IndividualStat>}
      </Stack>
    </div>
  );
}