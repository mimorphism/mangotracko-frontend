import { Card, Image, Text,Modal, Space } from '@mantine/core';
import { Indicator } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { FaStar } from 'react-icons/fa';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteRecordDialog from './DeleteRecordDialog';
import {RecordType} from './util/utils';
import { useMediaQuery } from '@mantine/hooks';
import UpdateMango from './UpdateMango';
import { useReducer } from 'react';
import { getPrettifiedDate } from './util/utils';



const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';

function searchMango(mangoTitle, lastChapter) {

  var link = `${GOOGLE_SEARCH_URL} read ${mangoTitle} ${lastChapter + 1}`;
  window.open(link, '_blank');
}


const CurrentlyReadingMango = ({ mango }) => {
  const useStyles = createStyles((theme) => ({
    standardFont: {
      // fontFamily: "'Quicksand', sans-serif",
      textTransform: 'uppercase'
    },
    indicator:{
      color: theme.colors.dark[0],
      fontSize:'20',
      fontWeight:'700',
      cursor:'pointer'
    },
    optionBtn:{
      fontSize:theme.fontSizes.xs,
      width:'100%'
    },
    
    btnGroup:{
      [`@media (max-width: 1024px)`]: {
          flexDirection:'column'

      },
    }

  }));

  const { classes } = useStyles();
  const [value, setToggle] = useToggle(['gray', 'dark']);
  const [isDeleteRecordDiagOpen, setDeleteRecordDiagOpen] = useState(false);
  const [isUpdateMangoDiagOpen, setUpdateMangoDiagOpen] =useState(false);
  const matchesSmallMobileView = useMediaQuery('(max-width: 500px)');

  return (

      <div>
          <Indicator label ="X"
      classNames={{indicator:classes.indicator}}
      onClick={()=> setDeleteRecordDiagOpen(true)} color="dark" size={20} withBorder>
      </Indicator>
      <Card
            shadow="sm">
            <Card.Section>
              <Image width="100%" src={mango.mango.img} withPlaceholder
                   />
            </Card.Section>
            {value === 'gray' ?
              <Fragment>
              <Space h="xs"></Space>
                <Text
                  weight={800}
                  size="sm"
                  align="center">
                  {mango.mango.mangoTitle}
                </Text>
              </Fragment>
              :
              <Fragment>
              <Space h="xs"></Space>
              <Text
                className={classes.standardFont}
                weight={800}
                size="sm"
                align="left">
                LAST READ:<Space></Space>{getPrettifiedDate(mango.lastReadTime)}
              </Text>
              <Space h="xs"></Space>
                <Text
                  className={classes.standardFont}
                  weight={800}
                  size="sm"
                  align="left">
                  LAST CHAPTER:<Space></Space>{mango.lastChapterRead}
                </Text>
                <Space h="xs"></Space>
                <Text className={classes.standardFont}
                  size="sm"
                  align="left"
                   weight={800}
                  >
                  {/* <FaStar style={{ fontSize: 'xs' }} /> {mango.mango.author} <FaStar style={{ fontSize: 'xs' }} /> */}
                 AUTHOR:<Space></Space>{mango.mango.author}
                </Text>
              </Fragment>
            }
            <Space h="xs"></Space>
            <Card.Section>
                <Group className={classes.btnGroup} position='center' spacing='0' noWrap='true' width='100%'>
                <Button size="xs" color={value} radius="0" className={classes.optionBtn} onClick={() => setToggle()}>INFO</Button>
                <Button size="xs" color="gray" radius="0" className={classes.optionBtn} onClick={() => setUpdateMangoDiagOpen(true)}>UPDATE</Button>
                <Button size="xs" color="gray" radius="0"  className={classes.optionBtn} onClick={() => searchMango(mango.mango.mangoTitle, mango.lastChapterRead)}>READ</Button>
                </Group>
              </Card.Section >

          </Card>
          <Modal withCloseButton={false} centered opened={isDeleteRecordDiagOpen} onClose={()=> setDeleteRecordDiagOpen(false)} closeOnClickOutside>
          <DeleteRecordDialog recordType={RecordType.CURRENTLY_READING}  recordId={mango.currentlyReadingId}></DeleteRecordDialog> 
          </Modal>
          <Modal
                size={matchesSmallMobileView ? "100%" : "undefined"}
                padding={0} withCloseButton={false} centered opened={isUpdateMangoDiagOpen}
                onClose={() => setUpdateMangoDiagOpen(false)}
                closeOnClickOutside>
                <UpdateMango mango={mango}/>
            </Modal>
        </div>
  );

}
export default CurrentlyReadingMango;