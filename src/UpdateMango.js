
import { TextInput, Button, SimpleGrid, Space, Group, Badge } from '@mantine/core';
import {Image as MantineImage} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createStyles } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import {useState} from 'react';

const UpdateMango = () => {
    const mango = useLocation();
    const [time, setTime] = useState(new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12:false}));
    const [imgHeight, setImgHeight] = useState(580);

    function getImageMeta(url) {   
      var img = new Image();
      img.src = url;
      img.onload = function() {
           setImgHeight(this.height<580?this.height:580);
      };
    }
    
    
    const form = useForm({
        initialValues: {
          title: mango.state.mango.mangoTitle,
          status: mango.state.mango.mangoStatus,
          lastChapterRead: mango.state.mango.ongoingMango.lastChapterRead,
          lastReadTime: mango.state.mango.ongoingMango.lastReadTime
        }
      });
      
      const useStyles = createStyles((theme) => ({
        div: {
            padding:'5px 47px'
        },

        Form:
        {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            border: 'none',
            padding: '5',
            color: theme.colors.dark[0],
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizes.lg,
            borderRadius:theme.radius.lg
            
        },

      }));
      const { classes } = useStyles();

      return (
          <div>
        <div>
        <h1>UPDATE MANGOES</h1></div>
        <div className={classes.div}>
        {getImageMeta(mango.state.mango.bannerImg)}
        <MantineImage src={mango.state.mango.bannerImg} radius="xl" mt="101" height={imgHeight}></MantineImage>
        </div>
        <Group mt='md' position='center' direction='column'>
        <Group position='left 'style={{display:'inline-flex'}}><Badge style={{display:'inline-table'}}size="xl" radius="xs">{mango.state.mango.mangoStatus}</Badge>
        <Badge style={{display:'inline-table'}}size="xl" radius="xs">{mango.state.mango.mangoStatus}</Badge>
        </Group>     
              <form style={{width:'50%',margin:'0 auto'}} onSubmit={form.onSubmit((values) => console.log(values))}> 
              <SimpleGrid cols={3} grow spacing="sm" className={classes.Form} >
              <TextInput
              required
              label="Last chapter read" mb="20"  size="lg" 
              {...form.getInputProps('lastChapterRead')} />
              <DatePicker label="Last read date/time"  size="lg" required mb="20"  defaultValue={new Date()}/>
              <Form.Control className ={classes.Form} type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
              <Space></Space>
              <Button mt='-30' type="submit" >Save</Button>
              </SimpleGrid>
              </form>
              </Group>
        </div>
      );
}
export default UpdateMango;