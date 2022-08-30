
import {
  NumberInput, Button, Space, Group, Paper, Center, LoadingOverlay,
  Textarea, Tooltip, Card, Stack
} from '@mantine/core';
import { Image as MantineImage } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { createStyles } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import MangoLatestStatus from './MangoLatestStatus';
import { formatISO, isBefore, isEqual, add } from 'date-fns';
import { resourceAxiosInstance } from './services/AxiosService';
import { useHistory } from 'react-router-dom';
import { FaCheck, FaDatabase } from 'react-icons/fa';
import AuthHeader from './util/authHeaderHelper';
import TokenService from './services/TokenService';
import { getCurrentTime, notifyOK, notifyKO } from './util/utils';
import { useMediaQuery } from '@mantine/hooks';
import { useElementSize } from '@mantine/hooks';




const UpdateMango = ({ mango }) => {
  const mangoTitle = mango.mango.mangoTitle;
  const mangoStatus = mango.mango.status;
  const lastChapterRead = mango.lastChapterRead;
  const lastReadTime = mango.lastReadTime;
  const bannerImg = mango.mango.bannerImg;
  const anilistId = mango.mango.anilistId;
  const coverImg = mango.mango.img;

  const [imgHeight, setImgHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingFinished, setSubmittingFinished] = useState(false);
  const history = useHistory();
  const [finalChapter, setFinalChapter] = useState(0);
  const [remarksMsg, setRemarksMsg] = useState("");
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { mangoLatestStatusRef, widthMangoLatestStatus, heightMangoLatestStatus } = useElementSize();
  const { paperContainerRef, widthPaperContainer, heightPaperContainer } = useElementSize();





  const form = useForm({
    initialValues: {
      title: mangoTitle,
      status: mangoStatus,
      lastChapterRead: lastChapterRead,
      lastReadTime: lastReadTime,
      remarks: ""
    },
    validate: {
      lastChapterRead: (value) => (value <= lastChapterRead ?
        'Chapter must be greater than current chapter read' : null),
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
      maxWidth: '300px',
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
    if (finalChapter && finalChapter > 0
    ) {
      setRemarksMsg(`Optional: ${finalChapter} is the final chapter of this mango.By saving you will finish this mango.
                You can put remarks if you wish`)
    }
  }, [finalChapter])

  const getUpdateEndpoint = (lastChapterRead, finalChapter) => {
    return lastChapterRead == finalChapter ? '/updateMangoFinish' : 'updateMango'
  }


  const submitMangoUpdate = (values) => {
    setIsSubmitting(true);
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

    setTimeout(() => {
      resourceAxiosInstance.service.put(getUpdateEndpoint(lastChapterReadForm, finalChapter), mango,
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
      {bannerImg && !isMobile && <MantineImage withPlaceholder src={bannerImg} />}
        {!submittingFinished &&
          <Paper p={bannerImg && !isMobile ? 0 : "sm"} className={classes.Form}>
            {bannerImg && !isMobile && <>
              <Space h="md" /></>}
            <MangoLatestStatus mango={mango} setFinalChapter={setFinalChapter} />
            <Space h="md" />

            <Center>{finalChapter != 0 ?
              <NumberInput className={classes.inputs} min={lastChapterRead} max={finalChapter} required variant='default' label="Last chapter read" mb="20" size="lg"
                {...form.getInputProps('lastChapterRead')} />
              :
              <NumberInput
                className={classes.inputs}
                min={lastChapterRead} required variant='default' label="Last chapter read" mb="20" size="lg"
                {...form.getInputProps('lastChapterRead')}
              />
            }</Center>
            <Center>{finalChapter != 0 && form.values['lastChapterRead'] == finalChapter && !isMobile &&
              <Tooltip
                label={remarksMsg}
                position="top" placement="center" gutter={10}>
                <Textarea
                  className={classes.inputs}
                  label="Remarks"
                  maxRows={5}
                  size='lg'
                  variant='default'
                  {...form.getInputProps('remarks')}
                /></Tooltip>}</Center>
            <Center>{finalChapter != 0 && form.values['lastChapterRead'] == finalChapter && isMobile &&
              <Textarea
                className={classes.inputs}
                label="Remarks"
                maxRows={5}
                size='lg'
                variant='default'
                {...form.getInputProps('remarks')}
              />
            }</Center>

            <Space h="md" />
            <Center><Button size="lg" type="submit" rightIcon={<FaDatabase size={15} />}>Save</Button></Center>
          </Paper>
        }
      </form>
    </div>
  );
}
export default UpdateMango;