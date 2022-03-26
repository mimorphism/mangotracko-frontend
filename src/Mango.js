import { Card, Image, Text } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Group, Button } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import format from 'date-fns/format';
import parseIso from 'date-fns/parseISO';
import { FaStar } from 'react-icons/fa';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';

function searchMango(mangoTitle, lastChapter) {

  var link = `${GOOGLE_SEARCH_URL} read ${mangoTitle} ${lastChapter}`;
  window.open(link, '_blank');
}

function getPrettifiedDate(date) {
  const newDate = parseIso(date, new Date());
  return format(newDate, 'LLL d yyyy p');
}

const Mango = ({ mango }) => {
  const useStyles = createStyles(() => ({
    standardFont: {
      // fontFamily: "'Quicksand', sans-serif",
      textTransform: 'uppercase'
    }
  }));

  const { classes } = useStyles();
  // const [value, setToggle] = useToggle({value:'default',color:'gray'}, [{value:'default',color:'gray'}, {value:'filled',color:'blue'}]);
  const [value, setToggle] = useToggle('gray', ['gray', 'dark']);


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
                left: '12%',
                // width: 'auto',
                bottom: 0
              }}>
                <Group position='center' spacing='0' noWrap='true'>
                <Button color={value} radius="xs" onClick={() => setToggle()}>INFO</Button>
                <Button color="gray" radius="xs" style={{marginRight: '-1px'}} component={Link} to={{ pathname: "/updatemango", state: { mango }}}>UPDATE</Button>
                <Button color="gray" radius="xs" style={{marginRight: '-1px'}} onClick={() => searchMango(mango.mangoTitle, mango.ongoingMango.lastChapterRead)}>READ</Button>
                </Group>
              </Card.Section >

              <Image src={mango.img} withPlaceholder
                style={{ padding: '1em' }} />
            </Card.Section>

            {value === 'gray' ?
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
                LAST READ: {getPrettifiedDate(mango.ongoingMango.lastReadTime)}
              </Text>
                <Text style={{
                  padding: '5px 10px'
                }}
                  className={classes.standardFont}
                  weight={500}
                  size="md"
                  align="center">
                  LAST CHAPTER: {mango.ongoingMango.lastChapterRead}
                </Text>
              </Fragment>
            }
          </Card>
        </div>
      </div>
    </div>
  );

}
export default Mango;