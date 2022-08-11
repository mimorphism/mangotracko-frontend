import { useState, useEffect } from 'react';
import AuthHeader from './util/authHeaderHelper';
import { resourceAxiosInstance } from './services/ResourceAxiosInstance';
import { notifyKO, notifyAlert } from './util/utils';


/**
 * Custom hook for getting resources using axios
 * @param {*} url 
 * @returns 
 */

const useAxios = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const abortCont = new AbortController();

    resourceAxiosInstance.get(url, {
      signal: abortCont.signal,
      headers: AuthHeader.getAuthHeader()
    })
      .then(res => {
        if (!res.status == 200) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        }
        return res.data;
      })
      .then(data => {
        setIsPending(false);
        if (data.currentPage == 1 && 
            data.totalRecords == 0) {
          const error = new Error('No records found');
          error.name = 'EmptyDataError';
          throw error;
        }
        setData(data);
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        }
        if (err.name === 'EmptyDataError') {
          notifyAlert(err.message);
        } else {
          // auto catches network / connection error
          setIsPending(false);
          if (err.response) {
            notifyKO(err.response.data.message);
          } else {
            notifyKO("Server cannot be reached!");
          }

        }
      })
    // abort the fetch
    return () => abortCont.abort();
  }, [url])

  return { data, isPending };
}

export default useAxios;