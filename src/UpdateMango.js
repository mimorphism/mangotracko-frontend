
import { TextInput, Button, SimpleGrid, Space, Group, Notification } from '@mantine/core';
import { Image as MantineImage } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createStyles } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react';
import MangoLatestStatus from './MangoLatestStatus';
import { formatISO, isBefore, isEqual, add } from 'date-fns';
import dayjs from 'dayjs';
import parseIso from 'date-fns/parseISO';
import { axiosInstance } from './axiosInstance';
import { useHistory } from 'react-router-dom';
import {FaCheck} from 'react-icons/fa';


const UpdateMango = () => {
  const mango = useLocation().state.mango;
  const mangoTitle =  mango.mangoTitle;
  const mangoStatus = mango.mangoStatus;
  const lastChapterRead = mango.ongoingMango.lastChapterRead;
  const lastReadTime =  mango.ongoingMango.lastReadTime;
  const bannerImg = mango.bannerImg;

  const [time, setTime] = useState(new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }));
  const [imgHeight, setImgHeight] = useState(0);
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingFinished, setSubmittingFinished] = useState(false);
  const history = useHistory();


  const getImageMeta = (url) => {
    var img = new Image();
    img.onload = function () {
      setImgHeight(this.height < 580 ? this.height : 580);
    };
    img.src = url;
  }

  const form = useForm({
    initialValues: {
      title: mangoTitle,
      status: mangoStatus,
      lastChapterRead: lastChapterRead,
      lastReadTime:lastReadTime
    },
    validate: {
      lastChapterRead: (value) => (isNaN(value)?'Please input only numbers': value <=  lastChapterRead ? 
      'Chapter must be greater than current chapter read' : null),
    },
  });


  const useStyles = createStyles((theme) => ({
    div: {
      padding: '5px 47px'
    },

    Form:
    {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
      border: 'none',
      padding: '1em',
      color: theme.colors.dark[0],
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizes.lg,
      borderRadius: theme.radius.lg
    },

    notification:
    {
      color: theme.colors.dark[0],
      margin: '0 auto',
      display:'flex', 
      justifyContent:'center', 
      borderRadius:'0'
    }

  }));
  const { classes } = useStyles();

  useEffect(() => {
    if (submittingFinished) {
      // 1000 for 1 second
      setTimeout(() => history.push('/currentlyreading')
      , 2000);
    }
  }, [submittingFinished])


  const submitMangoUpdate = (values) =>
  {
    setIsSubmitting(true);

    const lastReadTimeDate = formatISO(parseIso(lastReadTime, new Date()), { representation: 'date' });
    const newLastReadTimeDate = formatISO(date, { representation: 'date' });
    let newLastReadTime = formatISO(date, { representation: 'date' })+'T'+time;

    console.log(lastReadTime);
    console.log(lastReadTimeDate);
    console.log(newLastReadTimeDate);
    console.log(newLastReadTime);

    if(isEqual(new Date(lastReadTimeDate), new Date(newLastReadTimeDate)))
    {
      if(isEqual(new Date(lastReadTime), new Date(newLastReadTime)) || 
        isBefore(new Date(newLastReadTime), new Date(lastReadTime)) )
      {
        newLastReadTime = add(new Date(parseIso(newLastReadTime)), {hours: 2});
        // console.log("KLAU TARIKH SAMA WAKTU PON SAMA: "+formatISO(newLastReadTime).split(':')[0]+':'+formatISO(newLastReadTime).split(':')[1]);
        newLastReadTime = formatISO(newLastReadTime).split(':')[0]+':'+formatISO(newLastReadTime).split(':')[1];
      }
    }

    const mangoTitleForm = values.title;
    const lastChapterReadForm = values.lastChapterRead;

    const mango = 
    {
      'mangoTitle': mangoTitleForm,
      'lastChapterRead': lastChapterReadForm,
      'lastReadTime':newLastReadTime
    }
    console.log(mango);

    setTimeout(() => {
      axiosInstance.put('/updateBacklog', mango)
    .then((response) => {
      console.log(response);
      setIsSubmitting(false);
      setSubmittingFinished(true);
    }, (error) => {
      console.log(error);
    });
   }, 4000)

  }
  return (
    <div>
      <div>
        <h1>UPDATE MANGOES</h1></div>
      <div className={classes.div}>
        {getImageMeta(bannerImg)}{ }
        <MantineImage src={bannerImg} radius="xl" mt="101" height={imgHeight}></MantineImage>
      </div>
      <Group mt='md' position='center' direction='column'>
        <MangoLatestStatus title={mangoTitle} currentChapter={lastChapterRead} lastReadTime={lastReadTime}></MangoLatestStatus>
        <form style={{ width: '50%', margin: '0 auto' }} onSubmit={form.onSubmit((values) => submitMangoUpdate(values))}>
          {!isSubmitting && !submittingFinished && <SimpleGrid cols={3} grow spacing="sm" className={classes.Form} >
            <TextInput
              required
              label="Last chapter read" mb="20" size="lg"
              {...form.getInputProps('lastChapterRead')} />
            <DatePicker label="Last read date/time" size="lg" required mb="20" value={date} onChange={setDate} 
            minDate={dayjs(lastReadTime).toDate()} 
            maxDate={dayjs().toDate()}/>
            <Form.Control className={classes.Form} type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
            <Space></Space>
            <Button mt='-30' type="submit" >Save</Button>
          </SimpleGrid>}
        </form>
        {isSubmitting && <Notification className={classes.notification} loading styles={{title:{fontSize: '30'}}}
          title="UPDATING MANGO..." disallowClose >
      </Notification>}
      {submittingFinished && <Notification className={classes.notification} color='dark' icon={<FaCheck size={60}/>}  styles={{title:{fontSize: '30'}}}  disallowClose title="UPDATE SUCCESS">
      </Notification>}
      </Group>
    </div>
  );
}
export default UpdateMango;