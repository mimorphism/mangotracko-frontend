import {
  Center, Space, LoadingOverlay, SegmentedControl, TextInput, createStyles,
  Grid, UnstyledButton, Modal
} from "@mantine/core";
import { useState, useEffect, useRef } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useDebouncedValue } from '@mantine/hooks';
import SearchResult from "./SearchResult";
import AddNewMango from "./AddNewMango";
import { useToggle } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';
import useAxios from './useAxios';
import { SearchRecordTable } from "./SearchRecordTable";
import {FaCog} from 'react-icons/fa';
import SearchSettings from "./SearchSettings";








const SearchMango = () => {

  const [mangoSuggestions, setMangoSuggestions] = useState([]);
  const [mango, setMango] = useState('');
  const [input, setInput] = useState('');
  const [debounced] = useDebouncedValue(input, 500);
  const isMounted = useRef(false);
  const [formVisible, setFormVisible] = useState(false);
  const resultAvailableRef = useRef(false);
  const [recordsLength, setRecordsLength] = useState(0);
  const [queryError, setQueryError] = useState('');
  const { data: existingRecords, isPending } = useAxios('/existingmangorecords');
  const RECORDS = 'RECORDS';
  const NEW_MANGO = 'NEW MANGO';
  const [searchType, setSearchType] = useToggle([RECORDS, NEW_MANGO]);
  const [isAdult, setIsAdult] = useState(false);
  const [searchSettingsVisible, setSearchSettingsVisible] = useState(false);



  const useStyles = createStyles(((theme, _params) => ({

    newMangoContent: {
      display: 'grid',
      justifyContent: 'center',
      gridTemplateColumns: 'repeat(auto-fit, 190px)',
      padding: '5rem 2rem',//to accomodate searchbar
      gap: '5%',
      [`@media (max-width: 1024px)`]: {
        padding: '7rem 2rem',
        top: '10px',
        gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr));',

      }
    },
    recordContent: {
      display: 'flex',
      justifyContent: 'center',
      padding: '5rem 2rem',//to accomodate searchbar
      gap: '5%',
      [`@media (max-width: 1024px)`]: {
        padding: '7rem 2rem',
        top: '10px',
      },
    },

    loader:
    {
      size: 'xl',
      variant: 'bars'
    },

    searchBarContainer: {
      position: `fixed`,
      // top:'14%',
      top: '5em',
      left: `0`,
      right: `0`,
      zIndex: '2',
      // background: 'rgba(255, 255, 255, 0.07)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8.3px)',
      maxWidth:'1440px',
      margin:'0 auto',
      border:'none',
      // border: '1px solid rgba(255, 255, 255, 0.3)',

 
  [`@media (max-width: 1024px)`]: {
    background:theme.colors.dark[4],
    top: '44px',
    boxShadow:'none',
    backdropFilter: 'none',
  }
},
  searchBar: {
    maxWidth: '450px',
    width: '70%',
    input: {
      height: '55px'
    }
  }


  })));

const { classes } = useStyles();

const setFormVisibleAndSetMangoState = (mangoID) => {
  setFormVisible(true);
  setMango(mangoID);
}

const getMangoFromSearchResults = (mangoID) => {
  return mangoSuggestions.find(mang => mang.id === mangoID);
}

const matchesMobileView = useMediaQuery('(min-width: 1024px)');


function destructureSearchResult(searchResult) {
  // return searchResult.Page.media.map(({title}) => [title['romaji']]);
  return searchResult.Page.media.map(mango =>
  ({
    id: mango.title['romaji'] + mango.startDate['year'],
    title: mango.title['romaji'],
    published: mango.startDate['year'],
    img: mango.coverImage['large'],
    status: mango.status,
    chapters: mango.chapters,
    anilistId: mango.id,
    description: mango.description
  }));
}

function destructureExistingRecordsToAnilistId(searchResult) {
  return searchResult.map(mango =>{
    return mango.mango.anilistId;
  });
}





const GET_MANGO_SUGGESTIONS = gql`
    query($title: String!, $mangoFilter:[Int], $isAdult:Boolean){
        Page(perPage: 20) {
          media(search:$title, format: MANGA, isAdult:$isAdult, id_not_in:$mangoFilter) {
            title {
              romaji
            }
            startDate{
              year
            }
            coverImage
            {
              large
            }
            status
            chapters
            id
            description
          }
        }
      }
    `;


const [getSuggestions, { loading, error, data }] = useLazyQuery(GET_MANGO_SUGGESTIONS,
  {
    onCompleted: (data) => {
    },
    onError: (error) => {
      setQueryError(error);
    }
  });


useEffect(() => {
  if (isMounted.current) {
    if (typeof debounced != 'undefined'
      && debounced !== '' && searchType === NEW_MANGO) {
      getSuggestions({ variables: { title: debounced, isAdult:isAdult, mangoFilter: destructureExistingRecordsToAnilistId(existingRecords) } });
    }
    // }
  } else {
    isMounted.current = true;
  }
}, [debounced, searchType, isAdult])



useEffect(() => {
  if (!input && !debounced) {
    setMangoSuggestions(prev => []);
  }
}, [input])


useEffect(() => {
  if (!data) {
    setMangoSuggestions(prev => []);
  } else {
    setMangoSuggestions(prev => [...destructureSearchResult(data)]);
    resultAvailableRef.current = false;
  }
}, [data])

useEffect(() => {
  if (mangoSuggestions) {
    setRecordsLength(mangoSuggestions.length);
  }
}, [mangoSuggestions]);

useEffect(() => {
    setMangoSuggestions(prev => []);
}, [searchType === RECORDS])


return (
  <div className={classes.container}>
  <LoadingOverlay
                loaderProps={{
                    size: '200', variant: 'bars'

                }} visible={isPending} />
    <>
      <div style={{ display: 'sticky' }}>
        <Center className={classes.searchBarContainer}>
          <TextInput className={classes.searchBar}
            radius={0}
            value={input} size={matchesMobileView ? "lg" : "md"}
            placeholder="Search mango"
            onChange={(event) => setInput(event.currentTarget.value)} 
            rightSection={searchType === NEW_MANGO && <UnstyledButton onClick={()=>setSearchSettingsVisible(true)}><FaCog color="white"/></UnstyledButton>}
            />
          <SegmentedControl
            onChange={setSearchType}
            size="sm"
            orientation="vertical"
            data={[RECORDS, NEW_MANGO]}
            radius={0}
            value={searchType}
          />
        </Center>
      </div>
      <>
      {/*Section for new mango search*/}
        {input !== '' && searchType === NEW_MANGO && 
          <div className={classes.newMangoContent}>
                  {isAdult}

            {mangoSuggestions &&
              mangoSuggestions.map(mango => (

                <div key={mango.id} onClick={() => setFormVisibleAndSetMangoState(mango.id) && setMango(mango.id)}>
                  <SearchResult mango={mango} />
                </div>))}
          </div>}
      {/*Section for new mango search*/}
      {/*Section for record search*/}
        {input !== '' && searchType === RECORDS && 
          <div className={classes.recordContent}>
            <SearchRecordTable rawData={existingRecords} input={input}></SearchRecordTable>
          </div>
          }
      {/*Section for record search*/}
      </>
    </>
    <Modal size="lg" withCloseButton={false} centered opened={formVisible} onClose={() => setFormVisible(false)}
      padding={0} closeOnClickOutside>
      <AddNewMango mango={getMangoFromSearchResults(mango)} setFormVisible={setFormVisible}></AddNewMango>
    </Modal>
    <Modal size="lg" withCloseButton={false} centered opened={searchSettingsVisible} onClose={() => setSearchSettingsVisible(false)}
      padding={0} closeOnClickOutside>
      <SearchSettings isAdult={isAdult} setIsAdult={setIsAdult}/>
    </Modal>
  </div>
  // </Stack>
);
}

export default SearchMango;