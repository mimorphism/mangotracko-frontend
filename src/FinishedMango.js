import { Card, Image, Text, Modal, Indicator, Space } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { Fragment } from 'react';
import { useState } from 'react';
import DeleteRecordDialog from './DeleteRecordDialog';
import { RecordType } from './util/utils';
import { getPrettifiedDate } from './util/utils';
import { useMediaQuery } from '@mantine/hooks';
import UpdateMango from './UpdateMango';



const FinishedMango = ({ mango }) => {
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
    btnGroup: {
      [`@media (max-width: 1024px)`]: {
        flexDirection: 'column'

      },
    },
    optionBtn: {
      fontSize: theme.fontSizes.xs,
      width: '100%'
    },

  }
  ));

  const { classes } = useStyles();
  const [isDeleteRecordDiagOpen, setDeleteRecordDiagOpen] = useState(false);
  const [isUpdateMangoDiagOpen, setUpdateMangoDiagOpen] = useState(false);
  const matchesSmallMobileView = useMediaQuery('(max-width: 500px)');



  return (

    <div className='mainDiv'>
      <Indicator label="X"
        classNames={{ indicator: classes.indicator }}
        onClick={() => setDeleteRecordDiagOpen(true)}
        color="dark" size={20} withBorder>
      </Indicator>
      <Card
        shadow="sm">
        <Card.Section onClick={() => setUpdateMangoDiagOpen(true)}>
          <Image src={mango.mango.img} withPlaceholder />
        </Card.Section>
        <Space h="xs"></Space>
        <Text
          weight={800}
          size="sm"
          align="center">
          {mango.mango.mangoTitle}
        </Text>
        <Space h="xs="></Space>
      </Card>
      <Modal
        size={matchesSmallMobileView ? "100%" : "undefined"}
        padding={0} withCloseButton={false} centered opened={isUpdateMangoDiagOpen}
        onClose={() => setUpdateMangoDiagOpen(false)}
        closeOnClickOutside>
        <UpdateMango mango={mango} />
      </Modal>
      <Modal withCloseButton={false} centered opened={isDeleteRecordDiagOpen} onClose={() => setDeleteRecordDiagOpen(false)} closeOnClickOutside>
        <DeleteRecordDialog recordType={RecordType.FINISHED} recordId={mango.finishedId}></DeleteRecordDialog>
      </Modal>
    </div>
  );

}
export default FinishedMango;