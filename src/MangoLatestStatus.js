
import { Badge, Group, createStyles,Modal } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { gql, useQuery } from '@apollo/client';
import { LoadingOverlay } from '@mantine/core';
import { formatDistance } from 'date-fns'
import parseIso from 'date-fns/parseISO';
import { useState, useEffect,useMemo } from 'react';
import { resourceAxiosInstance } from './services/AxiosService';
import AuthHeader from './util/authHeaderHelper';
import { getPrettifiedDate } from './util/utils';


const MangoLatestStatus = ({ mango, setFinalChapter }) => {

  const title = mango.mango.mangoTitle;
  const anilistId = mango.mango.anilistId;
  const [openRemarks, setOpenRemarks] = useState(false);

  const useStyles = createStyles((theme) => ({

    statusBadgeGroup: {
      [`@media (min-width: 768px) and (max-width: 1024px)`]: {
        justifyContent:'left',
        flexDirection:'column'
      },
    }
  }));

  const { classes } = useStyles();


  const readingProgress = (totalChapters, currentChapter) => {

    return totalChapters && totalChapters > 0 ? `${totalChapters - currentChapter} chapters behind` : currentChapter;
  }

  const mangoStatus = (status) => {
    if (status.toUpperCase() === 'FINISHED') {
      return 'COMPLETED';
    } else if (status.toUpperCase() === 'RELEASING') {
      return 'ONGOING';
    }
    else {
      return status;
    }
  }

  const getPrettyDateInfo = (time, type) => {
    let lastReadTimeISO = parseIso(time, new Date());
    if(type === 'CURRENTLY_READING'){
      return `LAST READ ${formatDistance(lastReadTimeISO, new Date(), { addSuffix: true })}`;
    }
    if(type === 'FINISHED'){
      return `FINISHED ${formatDistance(lastReadTimeISO, new Date(), { addSuffix: true })}`;
    }
    if(type === 'BACKLOG'){
      return `ADDED ${formatDistance(lastReadTimeISO, new Date(), { addSuffix: true })}`;
    }
    
  }


  const GET_MANGO_LATEST_STATUS = gql`
    query ($id: Int!) {
      Media(id: $id, format: MANGA) {
        title {
          romaji
        }
        status
        chapters
      }
    }`;

  const { loading, error, data } = useQuery(GET_MANGO_LATEST_STATUS, {
    variables: { "id": anilistId },
  });

  //   if (loading) return null;
  if (error) return `Opps! ${error}`;

  useEffect(() => {
    if (data) {
      setFinalChapter(data.Media.chapters)
      if (mango.mango.lastChapter == null && data.Media.chapters != null) {
        resourceAxiosInstance.service.put('/updateMangoStatus', anilistId,
          {
            headers: AuthHeader.getAuthHeader()
          })
      }
    }
  }, [data])

  return (
    <div>
      <LoadingOverlay
        loaderProps={{ size: '200', variant: 'bars' }} visible={loading} />
      {
        !loading && <Group position='center' className={classes.statusBadgeGroup} >
          <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{mangoStatus(data.Media.status)}</Badge>
          {mango.lastReadTime && <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{`${getPrettyDateInfo(mango.lastReadTime, 'CURRENTLY_READING')}, ${getPrettifiedDate(mango.lastReadTime)}`}</Badge>}
          {
            mango.lastChapterRead && readingProgress(data.Media.chapters, mango.lastChapterRead) != mango.lastChapterRead ?
            <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{` LAST READ AT CHAPTER ${mango.lastChapterRead}, ${readingProgress(data.Media.chapters, mango.lastChapterRead)}`}</Badge>
            :
            mango.lastChapterRead && <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{` LAST READ AT CHAPTER ${mango.lastChapterRead}`}</Badge>
          }
          
          {mango.completionDateTime && <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{`${getPrettyDateInfo(mango.completionDateTime, 'FINISHED')}, ${getPrettifiedDate(mango.completionDateTime)}`}</Badge>}
          {mango.addedDateTime && <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{`${getPrettyDateInfo(mango.addedDateTime, 'BACKLOG')}, ${getPrettifiedDate(mango.addedDateTime)}`}</Badge>}
          <Badge variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">{`AUTHOR: ${mango.mango.author}`}</Badge>

          {mango.remarks && 
          <Badge onClick={() => setOpenRemarks(true)}variant='filled' style={{ display: 'inline-table' }} size="lg" radius="xs">SHOW REMARKS</Badge>
          }
        </Group>
      }
      
      {<Modal opened={openRemarks} size="xl" onClose={() => setOpenRemarks(false)} centered withCloseButton={false}>
            {mango.remarks ? mango.remarks : 'No remarks'}
        </Modal>}
    </div>
  );
}

export default MangoLatestStatus;