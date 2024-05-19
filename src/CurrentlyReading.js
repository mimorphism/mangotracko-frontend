import CurrentlyReadingMango from './CurrentlyReadingMango';
import { createStyles, LoadingOverlay, Pagination, Group, Text, UnstyledButton, Center } from '@mantine/core';
import useAxios from './useAxios';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { FaSortAmountUpAlt, FaSortAmountDownAlt } from 'react-icons/fa';
import { useToggle } from '@mantine/hooks';



const DEFAULT_RECORDS_PER_PAGE = 20;

const useStyles = createStyles((theme) => ({

    content: {
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fit, 190px)',
        padding: '2rem 2rem',
        gap: '5em 5em',
        overflow: 'auto',
        [`@media (max-width: 1024px)`]: {
            gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))',
            rowGap: '3em',

        },
        [`@media (max-width: 395px)`]: {
            gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))',
            rowGap: '3em',
        },

    },

    loader:
    {
        size: 'xl',
        variant: 'bars'
    },
    sortBtn: {
        // border: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        border: `3px solid white`,
        borderRadius: '23px',
        width: '95px',
        cursor: 'pointer'
    }

}));


const CurrentlyReading = () => {

    const { classes } = useStyles();
    const matchesSmallMobileView = useMediaQuery('(max-width: 500px)');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const SORT_BY_TITLE = "TITLE";
    const SORT_BY_LASTACTIVITY = "LAST_ACTIVITY";
    const [sortBy, setSortBy] = useState(SORT_BY_LASTACTIVITY);
    const [sortDir, toggleSortDir] = useToggle(['desc', 'asc']);

    const { data: mangoes, isPending } = useAxios(`/currentlyReading?page=${currentPage}&size=${DEFAULT_RECORDS_PER_PAGE}&sort=${SORT_BY_LASTACTIVITY}&dir=${sortDir}`);

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
                return b.lastReadTime.localeCompare(a.lastReadTime);
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
            <Group pr="sm" pt="sm" position="right" spacing={0}>
                <UnstyledButton pt="3px" onClick={() => toggleSortDir()}>
                    {sortDir === 'asc' ? <FaSortAmountUpAlt size="28px" color="white" /> : <FaSortAmountDownAlt size="28px" color="white" />}
                </UnstyledButton>
                <Center>
                    <div className={classes.sortBtn}
                        onClick={() => sortBy === SORT_BY_LASTACTIVITY ? setSortBy(SORT_BY_TITLE) : setSortBy(SORT_BY_LASTACTIVITY)}>
                        <Text align="center" size="md" weight={800}>{sortBy === SORT_BY_LASTACTIVITY ? 'Last Read' : 'Title'}</Text></div>
                </Center>
            </Group>
            <div className={classes.content}>
                {sortedMangoes &&
                    sortedMangoes.map(mango => (
                        <CurrentlyReadingMango key={mango.mango.mangoId} mango={mango}
                        />
                    ))
                }
            </div>
            {totalPages > 1 && <Pagination position="center" align="center" page={currentPage} onChange={setCurrentPage} total={totalPages} />}
        </div>
    );
}

export default CurrentlyReading;