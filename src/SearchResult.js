import { Card, Image, Text, Space } from '@mantine/core';
import { createStyles } from '@mantine/core';



const SearchResult = ({ mango }) => {
  const useStyles = createStyles((theme, _params, getRef) => ({
    mangoImg:
    {
      ref: getRef('mangoImg'),
    },
    card:
    {
      [`&:hover .${getRef('mangoImg')}`]: {
        opacity: 0.3,
      },

      [`&:hover .${getRef('imgHover')}`]: {
        opacity: 1,
      },
    },
    imgHover:
    {
      ref: getRef('imgHover'),
      transition: '.5s ease',
      opacity: 0,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      msTransform: 'translate(-50%, -50%)'
    },
  }));

  const { classes } = useStyles();



  return (

   <div>
        <Card className={classes.card}
          shadow="sm"
          style={{paddingBottom:0}}>
          <Card.Section 
          //so that ADD text can be centered on the image and not the whole Paper
          style={{position:'relative'}}
          >
            <Image className={classes.mangoImg}
              src={mango.img} withPlaceholder
             />
             <div className={classes.imgHover}>
              <Text
                style={{ fontSize: '2.5em', cursor: 'pointer' }}
                weight={800}
                align="center"
              >
                ADD
              </Text></div>
            
          </Card.Section>
          <Space h="xs"></Space>
          <Text
            weight={800}
            size="sm"
            align="center">
            {mango.title}
          </Text>
          <Text
            size="sm"
            align="center"
            weight={800}
          >
            {mango.published}
          </Text>
          <Text
            size="sm"
            align="center"
            weight={800}
          >
            {mango.status}
          </Text>
        </Card>
      </div>
  );

}
export default SearchResult;