import GeneralStats from "./GeneralStats";
import { Text, Stack, LoadingOverlay } from "@mantine/core";
import TokenService from "./services/TokenService";
import useAxios from './useAxios';
import MostRecentUpdatesAndDailyStats from "./MostRecentUpdatesAndDailyStats";


const Home = () => {

     const { data: stats, isPending } = useAxios('/userstats');
     return (
          <Stack spacing={10}>
          <Text weight={700} size="xl">{isPending ? `Populating your stats...`:`Hey there ${TokenService.getUsername()}!`}</Text>
               <LoadingOverlay
                    loaderProps={{
                         size: '200', variant: 'bars'

                    }} visible={isPending}/>
               
               {stats && <GeneralStats stats={stats.generalStats}/>}
               {stats &&<MostRecentUpdatesAndDailyStats mostRecentUpdateStats={stats.mostRecentUpdateStats} dailyStats={stats.dailyStats}></MostRecentUpdatesAndDailyStats>}
          </Stack>
     );
}

export default Home;