import { showNotification, updateNotification, hideNotification} from '@mantine/notifications';
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

export const notifyOKCustom = (title, message) => {
    return showNotification({ title: title , message: message });

}

export const notifyKO = (message) => {
    return showNotification({ color: 'red', title: 'Oops, something went wrong!' , message: message});

}

export const notifyKOCustom = (title, message) => {
    return showNotification({ color: 'red', title: title , message: message});

}

export const notifyAlert = (message) => {
    return showNotification({ color: 'yellow', title: 'Alert!' , message: message});

}

export const notifyLoading = (message, id) => {
    return showNotification({ id:id, loading:true, title: 'Please wait' , message: message, autoClose:false});
}

export const notifyLoadingCallback = (message, id, title, isFailed) => {
    return updateNotification({ id:id, title: title , message: message, color:isFailed&&'red' });
}

export const notifyRemove = (id) => {
    return hideNotification(id);
}


export function getPrettifiedDate(date) {
  const newDate = parseIso(date, new Date());
  return format(newDate, 'LLL d yyyy p');
}
