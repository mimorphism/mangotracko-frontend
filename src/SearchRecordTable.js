import { useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  HoverCard,
  Modal
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useEffect } from 'react';
import { getPrettifiedDate } from './util/utils';
import CurrentlyReadingMango from './CurrentlyReadingMango';
import FinishedMango from './FinishedMango';
import BacklogMango from './BacklogMango';

const BACKLOG = 'Backlog';
const CURRENTLY_READING = 'Currently reading';
const FINISHED = 'Finished';


const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));


function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? FaSortUp : FaSortDown) : FaSort;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={800} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key] != item.id  //exclude id field from the filtering
      && item[key].toLowerCase().includes(query))
  );
}

function sortData(data, payload) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

function destructureRawData(rawData) {
  return rawData.map(mango =>
  ({
    title: mango.mango.mangoTitle,
    status: mango.currentlyReadingId ? CURRENTLY_READING :
      mango.finishedId ? FINISHED :
        mango.backlogId ? BACKLOG :
          'undefined',
    lastActivity: mango.currentlyReadingId ? getPrettifiedDate(mango.lastReadTime) :
      mango.finishedId ? getPrettifiedDate(mango.completionDateTime) :
        mango.backlogId ? getPrettifiedDate(mango.addedDateTime) :
          'undefined',
    id: mango.currentlyReadingId ? mango.currentlyReadingId :
      mango.finishedId ? mango.finishedId :
        mango.backlogId ? mango.backlogId :
          0,
  }));
}





export function SearchRecordTable({ rawData, input }) {

  const data = destructureRawData(rawData);
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  function HoveredMangoCard({ row }) {

    if (row.status === CURRENTLY_READING) {
      return <CurrentlyReadingMango mango={rawData.find(mango => mango.currentlyReadingId === row.id)} />
    }

    if (row.status === FINISHED) {
      return <FinishedMango mango={rawData.find(mango => mango.finishedId === row.id)} />
    }

    if (row.status === BACKLOG) {
      return <BacklogMango mango={rawData.find(mango => mango.backlogId === row.id)} />
    }
  }



  const rows = sortedData.map((row) => (
    <HoverCard key={row.title} width={200} zIndex={1} shadow="md" openDelay={1000}>
      <tr key={row.title}>
        <HoverCard.Target>
          <td style={{cursor:'pointer', fontWeight:'600'}}
          >{row.title}</td>
        </HoverCard.Target>
        <td style={{cursor:'pointer', fontWeight:'600'}}
        >{row.status}</td>
        <td style={{cursor:'pointer', fontWeight:'600'}}>
        {row.lastActivity}</td>
      </tr>
      <HoverCard.Dropdown>
        <HoveredMangoCard row={row} />
      </HoverCard.Dropdown>
    </HoverCard>

  ));


  useEffect(() => {
    if (input) {
      setSearch(input);
      setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: input }));
    }
  }, [input]);


  return (
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: 'fixed', minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === 'title'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('title')}
            >
              Title
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
              Status
            </Th>
            <Th
              sorted={sortBy === 'lastActivity'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('lastActivity')}
            >
              Last activity
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={800} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
  );
}