import { showNotification } from '@mantine/notifications';
import parseIso from 'date-fns/parseISO';
import format from 'date-fns/format';




export const getCurrentTime = (date) => 
{
    return date.toLocaleString('en-US', { hourCycle: 'h23', hour: 'numeric', minute: 'numeric'});
}

export const RecordType = Object.freeze({
	BACKLOG: Symbol("BACKLOG"),
    CURRENTLY_READING: Symbol("CURRENTLY_READING"),
	FINISHED: Symbol("FINISHED"),
})

export const notifyOK = () => {
    return showNotification({ title: 'Success!' , message: 'Record has been updated', });

}

export const notifyKO = (message) => {
    return showNotification({ color: 'red', title: 'Oops, something went wrong!' , message: message});

}

export const notifyAlert = (message) => {
    return showNotification({ color: 'yellow', title: 'Alert!' , message: message});

}

export function getPrettifiedDate(date) {
  const newDate = parseIso(date, new Date());
  return format(newDate, 'LLL d yyyy p');
}