
import { Badge, Group} from '@mantine/core';
import { gql, useQuery } from '@apollo/client';
import { LoadingOverlay } from '@mantine/core';
import { formatDistance, subDays } from 'date-fns'
import parseIso from 'date-fns/parseISO';



const MangoLatestStatus = ({title, currentChapter, lastReadTime}) => {


    const readingProgress = (totalChapters, currentChapter) =>
  {

      return totalChapters>0?`${totalChapters - currentChapter} chapters behind`:currentChapter;
  }

  const mangoStatus = (status) =>
  {
      if(status.toUpperCase() === 'FINISHED')
      {
          return 'COMPLETED';
      }else if(status.toUpperCase() === 'RELEASING')
      {
          return 'ONGOING';
      }
      else
      {
          return status;
      }
  }

  const lastReadInfo = (lastReadTime) =>
  {
     return `LAST READ: ${formatDistance(subDays(parseIso(lastReadTime, new Date()), 3), new Date(), { addSuffix: true })}`;
  }


    const GET_MANGO_LATEST_STATUS = gql`
    query ($title: String!) {
      Media(search: $title, format: MANGA) {
        title {
          romaji
        }
        status
        chapters
        
      }
    }
    `;
    const { loading, error, data } = useQuery(GET_MANGO_LATEST_STATUS, {
        variables: { title},
      });

    //   if (loading) return null;
      if (error) return `Error! ${error}`;
      
    return (
        <div>
        <LoadingOverlay 
        loaderProps={{size:'200', variant:'bars'}} visible={loading}/>
        {
        !loading && <Group position='left 'style={{display:'inline-flex'}}>
        <Badge style={{display:'inline-table'}}size="xl" radius="xs">{mangoStatus(data.Media.status)}</Badge>
        <Badge style={{display:'inline-table'}}size="xl" radius="xs">{lastReadInfo(lastReadTime)}</Badge>
        {
            readingProgress(data.Media.chapters, currentChapter) != currentChapter &&
            <Badge style={{display:'inline-table'}}size="xl" radius="xs">{readingProgress(data.Media.chapters, currentChapter)}</Badge>
        }
        </Group>     
        }
        </div>
      );
}
 
export default MangoLatestStatus;