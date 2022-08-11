import CurrentlyReadingMango from './CurrentlyReadingMango';
import { createStyles, LoadingOverlay, Pagination} from '@mantine/core';
import useAxios from './useAxios';
import { useState, useEffect, useReducer } from 'react';
import { useMediaQuery } from '@mantine/hooks';




const DEFAULT_RECORDS_PER_PAGE = 20;

const useStyles = createStyles(() => ({

    content: {
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fill, 190px)',
        padding: '2rem 2rem',
        gap: '5em 5em',
        overflow:'auto',
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
    overlayBackground: {

    }


}));

const CurrentlyReading = () => {

    const { classes } = useStyles();
    const matchesSmallMobileView = useMediaQuery('(max-width: 500px)');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { data: mangoes, isPending } = useAxios(`/currentlyReading?page=${currentPage}&size=${DEFAULT_RECORDS_PER_PAGE}`);

    useEffect(() => {
        if (mangoes) {
            if (mangoes.currentPage == 1) {
                setTotalPages(mangoes.totalPages);
            }
            setCurrentPage(mangoes.currentPage);
        }
    }, [mangoes]);

    return (
        <div>
            <LoadingOverlay
                loaderProps={{
                    size: '200', variant: 'bars'

                }} visible={isPending} />
            <div className={classes.content}>

                {mangoes &&
                    mangoes.content.map(mango => (
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