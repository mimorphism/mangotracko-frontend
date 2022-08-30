
import { Badge, Group, createStyles } from '@mantine/core';
import { gql, useQuery } from '@apollo/client';
import { LoadingOverlay } from '@mantine/core';
import { formatDistance } from 'date-fns'
import parseIso from 'date-fns/parseISO';
import { useState, useEffect } from 'react';
import { resourceAxiosInstance } from './services/AxiosService';
import AuthHeader from './util/authHeaderHelper';






const MangoLatestStatus = ({ mango, setFinalChapter }) => {

  const title = mango.mango.mangoTitle;
  const currentChapter = mango.lastChapterRead;
  const lastReadTime = mango.lastReadTime;
  const anilistId = mango.mango.anilistId;

  const useStyles = createStyles((theme) => ({

    statusBadgeGroup: {
      [`@media (max-width: 1024px)`]: {
        justifyContent:'left',
        // flexWrap:'wrap'
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

  const lastReadInfo = (lastReadTime) => {
    //subDays(parseIso(lastReadTime, new Date()), 3)
    let lastReadTimeISO = parseIso(lastReadTime, new Date());
    return `LAST READ: ${formatDistance(lastReadTimeISO, new Date(), { addSuffix: true })}`;
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
          <Badge style={{ display: 'inline-table' }} size="lg" radius="xs">{mangoStatus(data.Media.status)}</Badge>
          <Badge style={{ display: 'inline-table' }} size="lg" radius="xs">{lastReadInfo(lastReadTime)}</Badge>
          {
            readingProgress(data.Media.chapters, currentChapter) != currentChapter &&
            <Badge style={{ display: 'inline-table' }} size="lg" radius="xs">{readingProgress(data.Media.chapters, currentChapter)}</Badge>
          }
        </Group>
      }
    </div>
  );
}

export default MangoLatestStatus;