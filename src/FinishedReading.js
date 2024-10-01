import FinishedMango from './FinishedMango';
import { createStyles, LoadingOverlay, Pagination, Group, Text, UnstyledButton, SegmentedControl, Space } from '@mantine/core';
import useAxios from './useAxios';
import { useState, useEffect } from 'react';
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from 'react-icons/fa';
import { useToggle } from '@mantine/hooks';

const DEFAULT_RECORDS_PER_PAGE = 20;



const useStyles = createStyles(() => ({
  content: {
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: 'repeat(auto-fit, 191px)',
    padding: '1.5rem 0',
    gap: '6em 5em',
    width: '100%',
    // overflow: 'auto',
    [`@media (max-width: 1440px)`]: {
      gridTemplateColumns: 'repeat(auto-fill,minmax(135px,1fr))',
      // rowGap: '3em',

    },
    [`@media (max-width: 1024px)`]: {
      gridTemplateColumns: 'repeat(auto-fill,minmax(145px,1fr))',
      //  rowGap: '3em',

    },
    [`@media (max-width: 425px)`]: {
      gridTemplateColumns: 'repeat(auto-fill,minmax(135px,1fr))',
      // rowGap: '3em',
    },
  },

  loader:
  {
    size: 'xl',
    variant: 'bars'
  },
  container: {
    padding: '1rem 5rem',
    minHeight: '1600px',
    position: 'relative',
    [`@media (max-width: 1024px)`]: {
      padding: '0',
    },
  },
  sorting: {
    gap: "1em",

  },
  sortBtn: {
    // border: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
    border: `2px solid white`,
    borderRadius: '23px',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    width: 'auto',
    cursor: 'pointer'
  },
  pagination: {
    position: 'relative',
    top: '4em',
  }

}));

const FinishedReading = () => {

  const { classes } = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const SORT_BY_TITLE = "TITLE";
  const SORT_BY_LASTACTIVITY = "LAST_ACTIVITY";
  const [sortBy, setSortBy] = useState(SORT_BY_LASTACTIVITY);
  const [sortDir, toggleSortDir] = useToggle(['desc', 'asc']);

  const { data: mangoes, isPending } = useAxios(`/finished?page=${currentPage}&size=${DEFAULT_RECORDS_PER_PAGE}&sort=${SORT_BY_LASTACTIVITY}&dir=${sortDir}`);
  const [sortedMangoes, setSortedMangoes] = useState([]);


  useEffect(() => {
    if (mangoes) {
      if (mangoes.currentPage == 1) {
        setTotalPages(mangoes.totalPages);
      }
      setCurrentPage(mangoes.currentPage);
      sortMangoes(mangoes.content);

    }
  }, [mangoes]);

  useEffect(() => {
    sortMangoes(sortedMangoes);
  }, [sortBy]);

  const sortMangoes = (unsorted) => {
    const sorted = [...unsorted].sort((a, b) => {
      if (sortBy === SORT_BY_LASTACTIVITY) {
        return b.completionDateTime.localeCompare(a.completionDateTime);
      } else if (sortBy === SORT_BY_TITLE) {
        return a.mango.mangoTitle.localeCompare(b.mango.mangoTitle);
      }
    });
    setSortedMangoes(sorted);
  }


  return (
    <div>
      <LoadingOverlay
        loaderProps={{
          size: '200', variant: 'bars'

        }} visible={isPending} />
      <Space h="xl"></Space>
      <div className={classes.container}>
        <Group className={classes.sorting} position="right" spacing={0}>
          <UnstyledButton pt="3px" onClick={() => toggleSortDir()}>
            {sortDir === 'asc' ? <FaSortAmountUpAlt size="1.5em" color="white" /> : <FaSortAmountDownAlt size="1.5em" color="white" />}
          </UnstyledButton>
          <SegmentedControl
            radius='xs'
            color='gray'
            value={sortBy}
            onChange={setSortBy}
            size="sm"
            data={[
              {
                label: (<Text
                  weight={800}
                  size="xs">
                  DATE FINISHED
                </Text>), value: SORT_BY_LASTACTIVITY
              },
              {
                label: (<Text
                  weight={800}
                  size="xs">
                  TITLE
                </Text>),
                value: SORT_BY_TITLE,
              }
            ]}
          />
        </Group>
        <div className={classes.content}>
          {sortedMangoes &&
            sortedMangoes.map(mango => (
              <FinishedMango key={mango.mango.mangoId} mango={mango} />
            ))}
        </div>
      </div>
      <div className={classes.pagination}>
        {totalPages > 1 && <Pagination position='center' align='center' page={currentPage} onChange={setCurrentPage} total={totalPages} />}

      </div>

    </div>
  );

}

export default FinishedReading;