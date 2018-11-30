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

const syncTableWithCollection = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => 
        type === 'users/GET_ALL_FULFILLED' || 
        type === 'users/CREATE_FULFILLED'),
    withLatestFrom(state$),
    map(() => syncData(
        orderBy(
            filterBy(
                state$.value.collection.data, 
                    state$.value.filter), 
                        state$.value.sort)))
)

const handleValidationStateReset = (action$: any, state$: any) => action$.pipe(
    filter(({ type }: any) => 
        type === 'users/UPDATE_FULFILLED' || 
        type === 'users/CANCEL_CHANGES' ||
        type === 'users/CREATED_FULFILLED' ||
        type === 'users/SOFT_DELETE_FULFILLED'),
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
    syncTableWithCollection, 
)