import { Card, Image, Text, Modal, Indicator, Center, Space, LoadingOverlay } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { FaStar } from 'react-icons/fa';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { formatISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { resourceAxiosInstance } from './services/AxiosService';
import AuthHeader from './util/authHeaderHelper';
import TokenService from './services/TokenService';
import { FaCheck } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { notifyOK, notifyKO } from './util/utils';
import DeleteRecordDialog from './DeleteRecordDialog';
import { RecordType } from './util/utils';
import UpdateMango from './UpdateMango';
import { useMediaQuery } from '@mantine/hooks';






const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';

function searchMango(mangoTitle) {

    var link = `${GOOGLE_SEARCH_URL} read ${mangoTitle}`;
    window.open(link, '_blank');
}



const BacklogMango = ({ mango }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingFinished, setSubmittingFinished] = useState(false);
    const history = useHistory();
    const [isDeleteRecordDiagOpen, setDeleteRecordDiagOpen] = useState(false);
    const [isUpdateMangoDiagOpen, setUpdateMangoDiagOpen] = useState(false);
    const matchesSmallMobileView = useMediaQuery('(max-width: 500px)');




    const useStyles = createStyles((theme, _params, getRef) => ({
        standardFont: {
            // fontFamily: "'Quicksand', sans-serif",
            textTransform: 'uppercase'
        },
        notification:
        {
            color: theme.colors.dark[0],
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '0'
        },
        indicator: {
            color: theme.colors.dark[0],
            fontSize: '20',
            fontWeight: '700',
            cursor: 'pointer'
        }
    }));

    const { classes } = useStyles();


    const submitMangoUpdate = (mangoTitle, anilistId) => {
        setIsSubmitting(true);
        let date = formatISO(new Date(), { representation: 'date' });
        let time = new Date().toLocaleString('en-US', { hourCycle: 'h23', hour: 'numeric', minute: 'numeric' });

        const mango =
        {
            'mangoTitle': mangoTitle,
            'lastChapterRead': 1,
            'lastReadTime': date + 'T' + time,
            'user': TokenService.getUsername(),
            'anilistId': anilistId
        }

        console.log(mango);

        setTimeout(() => {
            resourceAxiosInstance.service.put('/updateMango', mango,
                {
                    headers: AuthHeader.getAuthHeader()
                })
                .then((response) => {
                    console.log(response);
                    setIsSubmitting(false);
                    setSubmittingFinished(true);
                    searchMango(mangoTitle);

                }, (error) => {
                    notifyKO(error.message);
                    console.log(error);
                });
        }, 1000)

    }

    useEffect(() => {
        if (submittingFinished) {
            // 1000 for 1 second
            notifyOK();
            setTimeout(() => history.go(0)
                , 1000);
        }
    }, [submittingFinished])



    return (
        <div className='mainDiv'>
            <div style={{
                position: 'relative'//to contain loading overlay
            }}>
                <LoadingOverlay visible={isSubmitting} />
                {!submittingFinished &&
                    <>
                        <Indicator label="X"
                            classNames={{ indicator: classes.indicator }}
                            onClick={() => setDeleteRecordDiagOpen(true)}
                            color="dark" size={20} withBorder>
                        </Indicator>

                        <Card className={classes.card}
                            shadow="sm">
                            <Card.Section>
                                <Image className={classes.mangoImg} src={mango.mango.img} withPlaceholder
                                    // onClick={() => submitMangoUpdate(mango.mango.mangoTitle, mango.mango.anilistId)}
                                    onClick={() => setUpdateMangoDiagOpen(true)}

                                />
                            </Card.Section>
                            <Fragment>
                                <Space h="xs"></Space>
                                <Text
                                    weight={800}
                                    size="sm"
                                    align="center">
                                    {mango.mango.mangoTitle}
                                </Text>
                            </Fragment>
                        </Card>
                    </>
                }
            </div>
            <Modal withCloseButton={false} centered opened={isDeleteRecordDiagOpen} onClose={() => setDeleteRecordDiagOpen(false)} closeOnClickOutside>
                <DeleteRecordDialog recordType={RecordType.BACKLOG} recordId={mango.backlogId}></DeleteRecordDialog>
            </Modal>
            <Modal
                size={matchesSmallMobileView ? "100%" : "undefined"}
                padding={0} withCloseButton={false} centered opened={isUpdateMangoDiagOpen}
                onClose={() => setUpdateMangoDiagOpen(false)}
                closeOnClickOutside>
                <UpdateMango mango={mango} />
            </Modal>
        </div>
    );
}

export default BacklogMango;