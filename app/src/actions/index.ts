import { SortDescriptor, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { User } from '../types'
import HttpClient from '../client'
import * as Types from './types'


const client = new HttpClient({baseURL: 'http://localhost:5000'});
client.createEntity({name: 'users'});

/* Action Creators */


/** Actions that change editor data only*/
export const cancelChanges = (backupUserData: User) => ({
    type: 'users/CANCEL_CHANGES',
    payload: backupUserData,
});

export const changeFilter = (filter: CompositeFilterDescriptor): Types.ChangeFilter => ({
    type: 'users/CHANGE_FILTER',
    payload: filter,
});

export const changeSort = (sort: SortDescriptor[]): Types.ChangeSort => ({
    type: 'users/CHANGE_SORT',
    payload: sort
});

export const changeUserData = (id: string, field: any, value: any): Types.ChangeUserData => ({
    type: 'users/CHANGE_DATA',
    payload: {id, field, value}
});

export const enterCreateMode = (): Types.EnterCreateMode => ({
    type: 'users/ENTER_CREATE_MODE',
})

export const selectRow = (dataItem: any): Types.ChangeUserInEdit => ({
    type: 'users/CHANGE_USER_IN_EDIT',
    payload: dataItem,
});

export const syncData = (data: User[]): Types.SyncData => ({
    type: 'users/SYNC_DATA',
    payload: data,
})

export const reactivateUser = (id: string) => ({
    type: 'users/REACTIVATE_USER',
    payload: client.endpoints.users.update({id: id, isActive: true})
})


/** Actions that change collection data only */

export const getAllUsers = (): Types.GetAllUsers => ({
    type: 'users/GET_ALL',
    payload: client.endpoints.users.getAll(),

});

export const createUser = (newUser: User): Types.CreateUser => ({
    type: 'users/CREATE',
    payload: client.endpoints.users.create({...newUser, id: ""}),
});

export const softDeleteUser = (id: string): Types.SoftDeleteUser => ({
    type: 'users/SOFT_DELETE',
    payload: client.endpoints.users.update({id: id, isActive: false}),
})

export const updateUser = (toUpdate: Partial<Pick<User, 'id'>>): Types.UpdateUser => ({
    type: 'users/UPDATE',
    payload: client.endpoints.users.update(toUpdate)
});


/**
 * Actions that show and hide ui widgets
 */

 export const closeAlertDialog = (): Types.CloseAlertDialog => ({
    type: 'CLOSE_ALERT_DIALOG',
});

export const toggleDeleteConfirmation = (): Types.ToggleDeleteConfirmation => ({
    type: 'users/TOGGLE_DELETE_CONFIRMATION',
})

export const togglePasswordModal = (): Types.TogglePasswordModal => ({
    type: 'users/TOGGLE_PASSWORD_MODAL'
})


/**
 * 
 * Dev Actions
 */
export const logAction = (payload: any) => ({
    type: "LOG_ACTION",
    payload: payload,

})