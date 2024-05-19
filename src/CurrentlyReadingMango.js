import { Card, Image, Text, Modal, Space, CloseButton } from '@mantine/core';
import { Indicator } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { FaStar } from 'react-icons/fa';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteRecordDialog from './DeleteRecordDialog';
import { RecordType } from './util/utils';
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
    indicator: {
      color: theme.colors.dark[0],
      fontSize: '20',
      fontWeight: '700',
      cursor: 'pointer'
    },
    optionBtn: {
      fontSize: theme.fontSizes.xs,
      width: '100%'
    },

    btnGroup: {
      [`@media (max-width: 1024px)`]: {
        flexDirection: 'column'

      },
    }

  }));

  const { classes } = useStyles();
  const [isDeleteRecordDiagOpen, setDeleteRecordDiagOpen] = useState(false);
  const [isUpdateMangoDiagOpen, setUpdateMangoDiagOpen] = useState(false);
  const matchesSmallMobileView = useMediaQuery('(max-width: 500px)');

  return (

    <div className='mainDiv'>
      <Indicator 
      label="X"
        classNames={{ indicator: classes.indicator }}
        onClick={() => setDeleteRecordDiagOpen(true)} color="dark" size={20} withBorder>
      </Indicator>
      <Card
        shadow="sm">
        <Card.Section onClick={() => setUpdateMangoDiagOpen(true)}>
          <Image width="100%" src={mango.mango.img} withPlaceholder
          />
        </Card.Section>

        <Space h="xs"></Space>
        <Text
          weight={800}
          size="sm"
          align="center">
          {mango.mango.mangoTitle}
        </Text>
      </Card>
      <Modal withCloseButton={false} centered opened={isDeleteRecordDiagOpen} onClose={() => setDeleteRecordDiagOpen(false)} closeOnClickOutside>
        <DeleteRecordDialog recordType={RecordType.CURRENTLY_READING} recordId={mango.currentlyReadingId}></DeleteRecordDialog>
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
export default CurrentlyReadingMango;