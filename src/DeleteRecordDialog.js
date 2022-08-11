import { Paper, Text, Button, Center, Space, createStyles,LoadingOverlay } from '@mantine/core';
import { FaDatabase, } from 'react-icons/fa';
import { useState, useEffect, Fragment } from 'react';
import TokenService from './services/TokenService';
import { resourceAxiosInstance } from './services/ResourceAxiosInstance'
import AuthHeader from './util/authHeaderHelper';
import { useHistory } from 'react-router-dom';
import { notifyOK, notifyKO} from './util/utils';






const DeleteRecordDialog = ({recordType, recordId}) => {

    const useStyles = createStyles((theme) => ({
        dialog: {
            backgroundColor: theme.colors.red[6]
        },
    }));


    const { classes } = useStyles();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingFinished, setSubmittingFinished] = useState(false);
    const [error, setError] = useState('');

    const history = useHistory();


    const deleteRecord = () =>{
        setIsSubmitting(true);

        const mango = {
            'recordType': recordType.description,
            'recordId': recordId,
            'user': TokenService.getUsername()
        }

        setTimeout(() => {
            resourceAxiosInstance.put('/deleteRecord', mango,
                {
                    headers: AuthHeader.getAuthHeader()
                })
                .then((response) => {
                    console.log(response);
                    setIsSubmitting(false);
                    setSubmittingFinished(true);
                }, (error) => {
                    notifyKO(error.message);
                    console.log(error);
                    setIsSubmitting(false);
                    setSubmittingFinished(false);
                });
        }, 1000)

    }

     useEffect(() => {
        if (submittingFinished) {
            notifyOK();
            setTimeout(() => history.go(0)
                , 1000);
        }
    }, [submittingFinished])


    return (
        <>
            <LoadingOverlay visible={isSubmitting} />
           {!submittingFinished && <Paper shadow="xs" p="xs">
                <Center><Text>
                    Are you sure that you want to delete this record?
                    <br></br>
                    This action is irreversible.
                    <br></br>
                </Text>
                </Center>
                <Space h="xl" />
                <Center>
                    <Button radius={0} onClick={()=>deleteRecord() } rightIcon={<FaDatabase size={15} />}>PROCEED</Button>
                </Center>
            </Paper>
}

        </>

    );
}

export default DeleteRecordDialog;