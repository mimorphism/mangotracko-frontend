import {
    Text, Textarea, NumberInput, TextInput, Button, Group, Center, Chip, Space,
    createStyles, LoadingOverlay, Tooltip, Blockquote, Spoiler, Modal
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FaDatabase, FaCheck, FaGrimace } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { DatePicker, TimeInput } from '@mantine/dates';
import { formatISO } from 'date-fns';
import { useForm } from '@mantine/form';
import { resourceAxiosInstance } from './services/ResourceAxiosInstance'
import { useHistory } from 'react-router-dom';
import AuthHeader from './util/authHeaderHelper';
import TokenService from './services/TokenService';
import { getCurrentTime, notifyOK, notifyKO } from './util/utils';





const AddMangoForm = ({ mango, setFormVisible }) => {

    const useStyles = createStyles((theme) => ({

        spoiler: {
            width: '100%'
        },
    }));

    const { classes } = useStyles();
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingFinished, setSubmittingFinished] = useState(false);
    const [remarksModalVisible, setRemarksModalVisible] = useState(false);

    const history = useHistory();


    const BACKLOG = 'backlog';
    const FINISHED = 'finished';
    const CURRENTLY_READING = 'currently-reading';
    const anilistId = mango.anilistId;
    // const description = mango.description;
    const description = mango.description && mango.description.replace(/<[^>]*>?/gm, '');


    const form = useForm({
        initialValues: {
            title: mango.title,
            lastChapterRead: 1,
            lastReadTime: ''
        },
    });


    const submitMango = (values) => {
        setIsSubmitting(true);
        setFormVisible(true);

        let mango, endpoint;

        if (value === CURRENTLY_READING) {
            mango =
            {
                'mangoTitle': values.title,
                'lastChapterRead': values.lastChapterRead,
                'lastReadTime': formatISO(date, { representation: 'date' }) + 'T' + getCurrentTime(time),
                'user': TokenService.getUsername(),
                'anilistId': anilistId
            }

            endpoint = '/newMango/currentlyReading';


        } else if (value === BACKLOG) {
            mango =
            {
                'mangoTitle': values.title,
                'lastChapterRead': 0,
                'addedDateTime': formatISO(date, { representation: 'date' }) + 'T' + getCurrentTime(time),
                'user': TokenService.getUsername(),
                'anilistId': anilistId
            }

            endpoint = '/newMango/backlog';

        }
        else if (value === FINISHED) {
            mango =
            {
                'mangoTitle': values.title,
                'completionDateTime': formatISO(date, { representation: 'date' }) + 'T' + getCurrentTime(time),
                'remarks': remarks,
                'user': TokenService.getUsername(),
                'anilistId': anilistId
            }

            endpoint = '/finishMango';

        }

        setTimeout(() => {
            resourceAxiosInstance.post(endpoint, mango,
                {
                    headers: AuthHeader.getAuthHeader()
                })
                .then((response) => {
                    console.log(response);
                    setIsSubmitting(false);
                    setSubmittingFinished(true);
                }, (error) => {
                    notifyKO(error.message);
                    setIsSubmitting(false);
                    setFormVisible(false);

                });
        }, 1000)
    }

    useEffect(() => {
        if (submittingFinished) {
            notifyOK();
            setTimeout(() => history.go(0)
                , 1000);
            setFormVisible(false);

        }
    }, [submittingFinished])


    return (
        <>
            <LoadingOverlay visible={isSubmitting} />
            {!submittingFinished &&
                <form onSubmit={form.onSubmit((values) => submitMango(values))}>
                    <Center><Text position="center" size="lg"
                    >{mango.title}</Text></Center>
                    <Space h="xl" />
                    <Spoiler
                        classNames={{ control: classes.spoiler, }}
                        maxHeight={100} showLabel="SHOW MORE" hideLabel="HIDE">
                        <Center><Blockquote>
                            {description ? description : 'No description'}
                        </Blockquote></Center>
                    </Spoiler>
                    <Space h="xl" />
                    <Chip.Group position="center" size='md' value={value} onChange={setValue}>
                        <Chip value={BACKLOG}>BACKLOG</Chip>
                        <Chip value={CURRENTLY_READING}>CURRENTLY READING</Chip>
                        {mango.status === 'FINISHED' && <Chip value={FINISHED}>FINISHED</Chip>}
                    </Chip.Group>
                    <Space h="xl" />
                    {value === BACKLOG && <>
                        <Group noWrap="true" grow spacing={0}></Group>
                        <Space h="xl" />
                        <Center><Button type="submit" radius={0} rightIcon={<FaDatabase size={15} />}>SAVE</Button></Center>
                    </>
                    }
                    {value === CURRENTLY_READING && <>
                        <Group className='btnGroup' grow={!isMobile} position='center' noWrap="true" spacing={0}>
                            <Tooltip label="Last chapter read" position="bottom" placement="center" gutter={10}>
                                <NumberInput {...form.getInputProps('lastChapterRead')}
                                    placeholder="Chapter" radius={0} required size='md' min={1} />
                            </Tooltip>
                            <Tooltip label="Last read date" position="bottom" placement="center" gutter={10}>
                                <DatePicker clearable={false} radius={0} value={date} placeholder='Last read date' size="md" required onChange={setDate} />
                            </Tooltip>
                            <TimeInput value={time} onChange={setTime} size="md" radius={0} format="12" defaultValue={new Date()} />
                        </Group>
                        <Space h="xl" />
                        <Center><Button type="submit" radius={0} rightIcon={<FaDatabase size={15} />}>SAVE</Button></Center>
                    </>}
                    {value === FINISHED && <>
                        <Group className='btnGroup' grow={!isMobile} position='center' noWrap="true" spacing={0}>
                            <TextInput placeholder="Remarks" size="md" value={remarks} onClick={() => setRemarksModalVisible(true)}></TextInput>
                            <Tooltip label="Finished date" position="bottom" placement="center" gutter={10}>
                                <DatePicker clearable={false} radius={0} value={date} placeholder='Finished date' size="md" required
                                    onChange={setDate} />
                            </Tooltip>
                            <TimeInput value={time} onChange={setTime} size="md" radius={0} format="12" defaultValue={new Date()} />
                        </Group>
                        <Modal size="lg" withCloseButton={false} centered opened={remarksModalVisible} onClose={() => setRemarksModalVisible(false)}>
                                <Textarea
                                    placeholder="Remarks"
                                    autosize
                                    value={remarks}
                                    // maxRows={4}
                                    radius={0}
                                    size='md'
                                    onChange={(event) => setRemarks(event.currentTarget.value)}
                                    required
                                />
                            </Modal>
                        <Space h="xl" />
                        <Center><Button type="submit" radius={0} rightIcon={<FaDatabase size={15} />}>SAVE</Button></Center>
                    </>
                    }

                </form>}
        </>
    );
}

export default AddMangoForm;