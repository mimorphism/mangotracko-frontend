import CurrentlyReadingMango from './CurrentlyReadingMango';
import { createStyles, LoadingOverlay } from '@mantine/core';
import useFetch from './useFetch';


const useStyles = createStyles(() => ({
    div: {
        display:'grid',
        gridTemplateColumns: '300px 300px 300px 300px 300px 300px',
        padding:'5px 47px',
    },

        loader:
        {
            size:'xl',
            variant:'bars'
        }
    

  }));

const CurrentlyReading  = () => {

    const { classes } = useStyles();
    const { data: mangoes, error, isPending } = useFetch('http://localhost:8080/ongoingMangoes');
    return (
        <div>
            <h1>CURRENTLY READING</h1>
        <div className={classes.div}>
            { error && <div>{ error }</div> }
            <LoadingOverlay 
            loaderProps={{
                size:'200', variant:'bars'

            }} visible={isPending}/>
            { mangoes && 
            mangoes.map(mango => (
                <CurrentlyReadingMango key={mango.mangoId} mango={mango}/>
      ))}
      </div>
      </div>
      );
   
}
 
export default CurrentlyReading;