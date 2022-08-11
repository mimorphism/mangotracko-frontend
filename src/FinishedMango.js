import { Card, Image, Text, Modal, Indicator, Space } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { Fragment } from 'react';
import { useState } from 'react';
import DeleteRecordDialog from './DeleteRecordDialog';
import { RecordType } from './util/utils';
import { getPrettifiedDate } from './util/utils';


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
    btnGroup:{
      [`@media (max-width: 1024px)`]: {
          flexDirection:'column'

      },
    },
    optionBtn:{
      fontSize:theme.fontSizes.xs,
      width:'100%'
    },
    
  }
  ));

  const { classes } = useStyles();
  const [valueInfo, setToggleInfo] = useToggle(['gray', 'dark']);
  const [valueRemarks, setToggleRemarks] = useToggle(['gray', 'dark']);
  const [isDeleteRecordDiagOpen, setDeleteRecordDiagOpen] = useState(false);



  return (

    <div>
      <Indicator label="X"
        classNames={{ indicator: classes.indicator }}
        onClick={()=> setDeleteRecordDiagOpen(true)}
        color="dark" size={20} withBorder>
      </Indicator>
      <Card
        shadow="sm">
        <Card.Section>
          <Image src={mango.mango.img} withPlaceholder />
        </Card.Section>
        <Space h="xs"></Space>
        {valueInfo === 'gray' ?
          <Fragment>
            <Text
              weight={800}
              size="sm"
              align="center">
              {mango.mango.mangoTitle}
            </Text>
          </Fragment>
          :
          
          <Fragment>
            <Text className={classes.standardFont}
              size="sm"
              align="left"
              weight={800}>
              AUTHOR:<Space/>{mango.mango.author}
            </Text>
            <Space h="xs"></Space>
            <Text
              className={classes.standardFont}
              weight={800}
              size="sm"
              align="left">
              FINISHED ON:<Space/>{getPrettifiedDate(mango.completionDateTime)}
            </Text>
          </Fragment>
        }
        {valueRemarks === 'dark' &&
          <Modal opened={valueRemarks} size="xl" onClose={() => setToggleRemarks('gray')} centered withCloseButton={false}>
            {mango.remarks ? mango.remarks : 'No remarks'}
        </Modal>}
        <Space h="xs="></Space>
        <Card.Section>
          <Group className={classes.btnGroup} position='center' spacing='0' noWrap='true' width='100%'>
            <Button className={classes.optionBtn} color={valueInfo} radius={0} onClick={() => setToggleInfo()}>INFO</Button>
            <Button className={classes.optionBtn} color={valueRemarks} radius={0} onClick={() => setToggleRemarks()}>REMARKS</Button>
          </Group>
        </Card.Section >
      </Card>
      <Modal withCloseButton={false} centered opened={isDeleteRecordDiagOpen} onClose={()=> setDeleteRecordDiagOpen(false)} closeOnClickOutside>
          <DeleteRecordDialog recordType={RecordType.FINISHED}  recordId={mango.finishedId}></DeleteRecordDialog> 
          </Modal>
    </div>
  );

}
export default FinishedMango;