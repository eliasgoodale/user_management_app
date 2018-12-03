import  { syncData, toggleDeleteConfirmation} from '../actions';
import { combineEpics } from 'redux-observable';
import { map, filter, withLatestFrom} from 'rxjs/operators';
import { User } from '../types';
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

const getProcessedData = (data: any) => ({
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
const processData = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => 
        type === 'users/REACTIVATE_USER_FULFILLED' ||
        type === 'users/SOFT_DELETE_FULFILLED' ||
        type === 'users/GET_ALL_FULFILLED' || 
        type === 'users/CHANGE_FILTER' || 
        type === 'users/CHANGE_SORT'),
    withLatestFrom(state$),
    map(() => {
        const { validation, editor, collection, filter, sort } = state$.value;
        const { inEdit } = validation;
        const processedData = filterBy(orderBy(collection.data, sort), filter);
        /**
         * If nothing is in edit we dont need to do anything 
         * we can just returned the processed data
         */
        if (inEdit !== null) {
        /**
         * Else we have an inEdit user so we search through the filtered/sorted data
         * for that index.
         */
            /**
             * Index we were at before the data processing
             */
            const lockedIndex = editor.editIndex;
            /**
             * Index our where current user in edit currently resides after processing
             */
            const currentIndex = processedData.findIndex((u: any) => u.id === inEdit)
            /**
             * The most up to date copy of the the data of that user in edit
             */
            const userInEdit = validation.userInEdit;
            /**
             * If we dont find the index in the processed data, we need to find where to
             * add in the current userInEdit into the array.
             */
            if (currentIndex === -1) {
                /**
                 * If the locked index is greater than or equal to the length of the processedData
                 * array, we need to push the edit user to the back.
                 */
                if (lockedIndex >= processedData.length) {
                    processedData.push(userInEdit);
                } else {
                    /**
                     * Else we splice it into the array at the lockedIndex
                     */
                    processedData.splice(lockedIndex, 0, userInEdit);
                }

                /**
                 * Else if we do find the index but have changed the position of the user 
                 * through processing
                 *  Our locked index is too large for the current size of the array
                 *      Solution: push the user to the back of the array
                 *  Our user now has a different position in the array than before
                 *      Solution: splice out the user from their current position,
                 *      and splice in the user at the previous index
                 *  
                 */
           
            } else if (currentIndex != lockedIndex) {
                /**
                 * if the lockedIndex is greater than or equal to 
                 * the current length of the processedData we need to take the current
                 * index and push it to the back of the array
                 * 
                 */
                if (lockedIndex >= processedData.length) {
                    processedData.splice(currentIndex, 1);
                    processedData.push(userInEdit);
                }
                /**
                 * Else we need to splice out the element at the currentIndex,
                 * and splice in the most recent version of userInEdit at the lockedIndex.
                 */
                else {
                    processedData.splice(currentIndex, 1)
                    processedData.splice(lockedIndex, 0, userInEdit);
                }
                /**
                 * Finally if the indexes are the same, we just update the data.
                 */
            } else {
                processedData[lockedIndex] = {...userInEdit}
            }
        }
            return getProcessedData(processedData);
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
    filter(({ type }: any) => type === 'users/CHANGE_USER_IN_EDIT'),
    map(({ payload }: any) =>  
        loadBackup(state$.value.collection.data.filter(
            (u: User) => u.id === payload.id)))
)

export default combineEpics(
    handleRequestError,
    handleValidationStateReset,
    handleSoftDelete,
    loadEditUserBackup,
    processData, 
)