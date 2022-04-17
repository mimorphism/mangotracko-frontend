import { Card, Image, Text, Modal } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { FaStar } from 'react-icons/fa';
import { Fragment } from 'react';



function getPrettifiedDate(date) {
  const newDate = parseIso(date, new Date());
  return format(newDate, 'LLL d yyyy p');
}

const FinishedMango = ({ mango }) => {
  const useStyles = createStyles(() => ({
    standardFont: {
      // fontFamily: "'Quicksand', sans-serif",
      textTransform: 'uppercase'
    }
  }));

  const { classes } = useStyles();
  // const [value, setToggle] = useToggle({value:'default',color:'gray'}, [{value:'default',color:'gray'}, {value:'filled',color:'blue'}]);
  const [valueInfo, setToggleInfo] = useToggle('gray', ['gray', 'dark']);
  const [valueRemarks, setToggleRemarks] = useToggle('gray', ['gray', 'dark']);



  return (

    <div className="mango-details">
      <div className="container">
        <div className="row">
          <Card
            shadow="sm"
            style={{ padding: 0 }}>
            <Card.Section style={{
              marginBottom: 7,
              position: 'relative'
            }}>
              <Card.Section style={{
                position: 'absolute',
                zIndex: 1,
                // transform: 'translateX(-40%)',
                left: '22%',
                // width: 'auto',
                bottom: 0
              }}>
                <Group position='center' spacing='0' noWrap='true'>
                <Button color={valueInfo} radius="xs" onClick={() => setToggleInfo()}>INFO</Button>
                <Button color={valueRemarks} radius="xs" onClick={() => setToggleRemarks()}>REMARKS</Button>
                </Group>
              </Card.Section >

              <Image src={mango.img} withPlaceholder
                style={{ padding: '1em' }} />
            </Card.Section>

            {valueInfo === 'gray' ?
              <Fragment>
                <Text style={{
                  padding: '5px 10px'
                }}
                  className={classes.standardFont}
                  weight={500}
                  size="xl"
                  align="center">
                  {mango.mangoTitle}
                </Text>
                <Text className={classes.standardFont}
                  size="lg"
                  align="center"
                  style={{ padding: '10px' }}>
                  <FaStar style={{ fontSize: '20px' }} /> {mango.author} <FaStar style={{ fontSize: '20px' }} />
                </Text>
              </Fragment>
              :
              <Fragment><Text style={{
                padding: '5px'
              }}
                className={classes.standardFont}
                weight={500}
                size="md"
                align="center">
               FINISHED ON: {getPrettifiedDate(mango.completionDateTime)}
              </Text>
              </Fragment>
            }
            {valueRemarks === 'dark' &&
             <Modal opened={valueRemarks} onClose={() => setToggleRemarks('gray')} centered withCloseButton={false}>
             {mango.remarks}
           </Modal>}
          </Card>
        </div>
      </div>
    </div>
  );

}
export default FinishedMango;