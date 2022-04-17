import FinishedMango from './FinishedMango';
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

const FinishedReading  = () => {

    const { classes } = useStyles();
    const { data: mangoes, error, isPending } = useFetch('http://localhost:8080/completedMangoes');
    console.log(mangoes);
    return (
        <div>
            <h1>FINISHED READING</h1>
        <div className={classes.div}>
            { error && <div>{ error }</div> }
            <LoadingOverlay 
            loaderProps={{
                size:'200', variant:'bars'

            }} visible={isPending}/>
            { mangoes && 
            mangoes.map(mango => (
                <FinishedMango key={mango.mangoId} mango={mango}/>
      ))}
      </div>
      </div>
      );
   
}
 
export default FinishedReading;