import { createStyles, LoadingOverlay, Pagination } from '@mantine/core';
import useAxios from './useAxios';
import TokenService from './services/TokenService';
import BacklogMango from './BacklogMango';
import { useState, useEffect } from 'react';

const DEFAULT_RECORDS_PER_PAGE = 20;


const useStyles = createStyles(() => ({
    content: {
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(auto-fit, 190px)',
        padding: '2rem 2rem',
         gap: '5em 5em',
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
    }

}));

const Backlog = () => {
    const { classes } = useStyles();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { data: mangoes, isPending } = useAxios(`/backlog?page=${currentPage}&size=${DEFAULT_RECORDS_PER_PAGE}`);

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
                        <BacklogMango key={mango.mangoId} mango={mango} />
                    ))}
            </div>
            {totalPages > 1 && <Pagination position="center" align="center" page={currentPage} onChange={setCurrentPage} total={totalPages} />}

        </div>

    );
}

export default Backlog;