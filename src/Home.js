import GeneralStats from "./GeneralStats";
import { Text, Space, Stack, LoadingOverlay } from "@mantine/core";
import TokenService from "./services/TokenService";
import useAxios from './useAxios';
import { notifyLoading } from "./util/utils";
import { hideNotification } from "@mantine/notifications";
import MostRecentUpdatesAndDailyStats from "./MostRecentUpdatesAndDailyStats";


const Home = () => {

     const { data: stats, isPending } = useAxios('/userstats');
     return (
          <Stack spacing={10}>
               <LoadingOverlay
                    loaderProps={{
                         size: '200', variant: 'bars'

                    }} visible={isPending}/>
               
               {isPending && notifyLoading('Populating your stats...', 'user-stats')}
               {!isPending && hideNotification('user-stats')}
               <Text weight={700} size="xl">Hey there {TokenService.getUsername()}!</Text>
               {stats && <GeneralStats stats={stats.generalStats}/>}
               {stats &&<MostRecentUpdatesAndDailyStats mostRecentUpdateStats={stats.mostRecentUpdateStats} dailyStats={stats.dailyStats}></MostRecentUpdatesAndDailyStats>}
          </Stack>
     );
}

export default Home;