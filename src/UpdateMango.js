
import {
  NumberInput, Button, Space, Paper, Center, LoadingOverlay,
  Textarea, SegmentedControl, Divider, Text, Checkbox
} from '@mantine/core';
import { Image as MantineImage } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createStyles } from '@mantine/core';
import { useState, useEffect } from 'react';
import MangoLatestStatus from './MangoLatestStatus';
import { formatISO } from 'date-fns';
import { resourceAxiosInstance } from './services/AxiosService';
import { useHistory } from 'react-router-dom';
import { FaDatabase } from 'react-icons/fa';
import AuthHeader from './util/authHeaderHelper';
import TokenService from './services/TokenService';
import { getCurrentTime, notifyOK, notifyKO } from './util/utils';
import { useMediaQuery } from '@mantine/hooks';



const UpdateMango = ({ mango }) => {
  const mangoTitle = mango.mango.mangoTitle;
  const mangoStatus = mango.mango.status;
  const lastChapterRead = mango.lastChapterRead;
  const lastReadTime = mango.lastReadTime;
  const bannerImg = mango.mango.bannerImg;
  const anilistId = mango.mango.anilistId;
  const remarks = mango.remarks;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingFinished, setSubmittingFinished] = useState(false);
  const history = useHistory();
  const [finalChapter, setFinalChapter] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const INFO = "INFO";
  const UPDATE = "UPDATE";
  const [tab, setTab] = useState(INFO);
  
  const [markAsFinished, setMarkAsFinished] = useState(false);
  const [markAsCurrentlyReading, setMarkAsCurrentlyReading] = useState(false);

  const [isBacklogPage, setIsBacklogPage] = useState(false);
  const [isCtlyReadingPage, setIsCtlyReadingPage] = useState(false);
  const [isFinishedPage, setIsFinishedPage] = useState(false);
  


  const form = useForm({
    initialValues: {
      title: mangoTitle,
      status: mangoStatus,
      lastChapterRead: lastChapterRead,
      lastReadTime: lastReadTime,
      remarks: remarks ? remarks : ""
    },
    validate: {
      lastChapterRead: (value) => (value <= lastChapterRead ?
        'Chapter must be greater than current chapter read' : null),

      remarks: (value) => (value === remarks ?
        'New remarks must not be the same as previous' : null),
    },
  });


  const useStyles = createStyles((theme) => ({

    Form:
    {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
      color: theme.colors.dark[0],
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizes.lg,
      // position:'absolute',
      // top: '50%',
      // left: '50%',
      // transform: 'translate(-50%, -50%)',
      // msTransform: 'translate(-50%, -50%)',
      [`@media (min-width: 500px)`]: {
        // display:'flex'

      },

    },
    inputs: {
      maxWidth: '500px',
      width: '100%',
      input: {
        height: 'auto',
      },

      label: {
        fontSize: theme.fontSizes.sm,
      },
    }


  }));
  const { classes } = useStyles();

  useEffect(() => {
    if (submittingFinished) {
      notifyOK();
      setTimeout(() =>

        history.go(0)
        , 1000);
    }
  }, [submittingFinished])

  useEffect(() => {
    if (mango.completionDateTime) {
      setIsFinishedPage(true);
      setMarkAsFinished(true);
    }
    else if (mango.addedDateTime) {
      setIsBacklogPage(true);
    }
    else if (mango.lastReadTime) {
      setIsCtlyReadingPage(true);
    }
  }, [])

  const getUpdateEndpoint = () => {
    if (markAsFinished && mango.lastReadTime) {
      return '/updateMangoFinish';
    } else if (markAsFinished && mango.completionDateTime) {
      return '/updateFinishedRemarks';
    } else {
      return 'updateMango';

    }
  }

  const getUpdatePayload = (values) => {
    if (markAsFinished && mango.completionDateTime) {
      return {
        'remarks': values.remarks,
        'anilistId': anilistId
      }
    }
    else {
      const mangoTitleForm = values.title;
      const lastChapterReadForm = values.lastChapterRead;
      const currentDate = new Date();
      const newLastReadTime = formatISO(currentDate, { representation: 'date' }) + 'T' + getCurrentTime(currentDate);
      const mango =
      {
        'mangoTitle': mangoTitleForm,
        'lastChapterRead': lastChapterReadForm,
        'lastReadTime': newLastReadTime,
        'user': TokenService.getUsername(),
        'anilistId': anilistId
      }
      if (values.remarks) {
        mango.remarks = values.remarks;
      }
      if(isBacklogPage){
        mango.lastChapterRead = 1;
      }
      return mango;
    }
  }


  const submitMangoUpdate = (values) => {
    setIsSubmitting(true);
    const mango = getUpdatePayload(values);

    setTimeout(() => {
      resourceAxiosInstance.service.put(getUpdateEndpoint(), mango,
        {
          headers: AuthHeader.getAuthHeader()
        })
        .then((response) => {
          console.log(response);
          setIsSubmitting(false);
          setSubmittingFinished(true);
        }, (error) => {
          notifyKO(error.message);
          console.log(error);
          setIsSubmitting(false);
          setSubmittingFinished(false);
        });
    }, 1000)

  }

  return (
    <div
      style={{
        maxWidth: '700px',
      }}
    >
      {/*position relative for form to enable LoadingOverlay to work nicely*/}
      <form style={{ position: 'relative', margin: 0 }} onSubmit={form.onSubmit((values) => submitMangoUpdate(values))}>
        <LoadingOverlay visible={isSubmitting} />
        {bannerImg && !isMobile &&
          <MantineImage withPlaceholder src={bannerImg} />}
        {!submittingFinished &&
          <Paper p={bannerImg && !isMobile ? 0 : "sm"} className={classes.Form}>
            <Center>
              <Text
                weight={900}
                size="lg">
                {mangoTitle}
              </Text>
            </Center>
            <Space h="sm" />
            <Center>
              <SegmentedControl
                radius='xs'
                color='blue'
                value={tab}
                onChange={setTab}
                size="sm"
                data={[
                  {
                    label: (<Text
                      weight={800}
                      size="xs">
                      INFO
                    </Text>), value: INFO
                  },
                  {
                    label: (<Text
                      weight={800}
                      size="xs">
                      UPDATE
                    </Text>),
                    value: UPDATE,
                  }
                ]}
              />
            </Center>
            <Divider my="sm" />
            {/* CURRENTLY READING */}
            {tab === UPDATE && isCtlyReadingPage &&
              <>
                <Center>
                  <NumberInput className={classes.inputs} min={lastChapterRead} max={!finalChapter ? lastChapterRead + 1000 : finalChapter} required variant='default' label="Last chapter read" mb="20" size={isTablet?"lg":"md"}
                    {...form.getInputProps('lastChapterRead')} />
                </Center>
              </>
            }
            {/* REUSED FOR FINISHED */}
            {tab === UPDATE && markAsFinished && !isMobile &&
              <Center>
                <Textarea
                  className={classes.inputs}
                  label="Remarks"
                  maxRows={5}
                  size='md'
                  variant='default'
                  placeholder={mango.remarks ? mango.remarks : ''}
                  {...form.getInputProps('remarks')}
                />
              </Center>
            }
            {/* REUSED FOR FINISHED */}
            {tab === UPDATE && isCtlyReadingPage &&
              <>
                <Space h="md" />

                <Center>
                  <Checkbox
                    checked={markAsFinished}
                    onChange={(event) => setMarkAsFinished(event.currentTarget.checked)}
                    label="Mark as finished"
                  /></Center>
              </>
            }
            {tab === UPDATE && isBacklogPage &&
              <>
                <Space h="md" />
                <Center>
                  <Checkbox
                    checked={markAsCurrentlyReading}
                    onChange={(event) => setMarkAsCurrentlyReading(event.currentTarget.checked)}
                    label="Mark as currently reading at chapter 1"
                  /></Center>
              </>
            }
            {tab === INFO &&
              <>
                <MangoLatestStatus mango={mango} setFinalChapter={setFinalChapter} />
                <Space h="md" />
              </>
            }
            {tab !== INFO &&
              <>
                <Space h="md" />
                <Center><Button disabled={isBacklogPage && !markAsCurrentlyReading} size="sm" type="submit" rightIcon={<FaDatabase size={15} />}>SAVE</Button></Center>
              </>
            }
          </Paper>
        }
      </form>
    </div>
  );
}
export default UpdateMango;