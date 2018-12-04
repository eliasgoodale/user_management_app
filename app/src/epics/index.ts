import  { syncData, toggleDeleteConfirmation} from '../actions';
import { combineEpics } from 'redux-observable';
import { map, filter, withLatestFrom} from 'rxjs/operators';
import { User } from '../types';
import { processData } from '../utils'
import { orderBy, filterBy } from '@progress/kendo-data-query'


const logValue = (payload: any) => ({
    type: "LOG_VALUE",
    payload: payload
})

const displayError = (error: any) => ({
    type: "DISPLAY_ERROR",
    payload: error,
});;

const loadBackup = (backupData: any) => {
    return( 
        backupData.length > 0 ? 
        {
            type: 'users/LOAD_BACKUP',
            payload: backupData[0]
        } : 
        { type: 'users/LOAD_BACKUP_FAILURE' }
    )
};

const resetValidationState = () => ({
    type: 'users/RESET_VALIDATION_STATE',
})

const deliverProcessedData = (data: any) => ({
    type: 'users/GET_PROCESSED_DATA',
    payload: data,
})
/**
 * 
 * Each time we get a GET_ALL_FULFILLED during initial startup
 * or change the sort/filter of the table we need to process the data from the collection to the 
 * editor. Whenever we go to make a change to our collection representing the most up to date
 * version of the data, or when we change our sort and filter parameters with a user in edit,
 * this function reacts by applying the sort and filter functions to the data received from
 * those actions, searching for the index matching the current user in edit if any, and ensuring
 * that the found index matches the index in the new data. Else it will determine if it needs to replace
 * or add in the data, retreive the userInEdit data from the current validation state,
 * and insert that user at the optimal index.
 * 
 */
const reProcessData = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => 
        type === 'users/REACTIVATE_USER_FULFILLED' ||
        type === 'users/SOFT_DELETE_FULFILLED' ||
        type === 'users/GET_ALL_FULFILLED' ||
        type === 'users/CANCEL_CHANGES' ||
        type === 'users/CHANGE_FILTER' || 
        type === 'users/CHANGE_SORT'),
    withLatestFrom(state$),
    map(() => {
        const processedData = 
        processData({
            sortFn: orderBy, 
            filterFn: filterBy }, state$.value, true);
        return deliverProcessedData(processedData);
    })
)

const handleValidationStateReset = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => 
        type === 'users/UPDATE_FULFILLED' || 
        type === 'users/CANCEL_CHANGES' ||
        type === 'users/CREATE_FULFILLED' ||
        type === 'users/SOFT_DELETE_FULFILLED' ||
        type === 'users/REACTIVATE_USER_FULFILLED'),
    map(() => resetValidationState())
)

const handleRequestError = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => type.includes('REJECTED')),
    map(({ payload }: any) => displayError(payload))
)

const handleSoftDelete = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => type === 'users/SOFT_DELETE'),
    map(() => toggleDeleteConfirmation())
)

const loadEditUserBackup = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => 
    type === 'users/CHANGE_USER_IN_EDIT' && 
    state$.value.editor.inCreateMode === false),
    map(({ payload }: any) =>  
        loadBackup(state$.value.collection.data.filter(
            (u: User) => u.id === payload.id)))
)

export default combineEpics(
    handleRequestError,
    handleValidationStateReset,
    handleSoftDelete,
    loadEditUserBackup,
    reProcessData, 
)