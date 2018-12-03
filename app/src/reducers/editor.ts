import { newUserTemplate, User, EditorState } from '../types'
import { filterBy } from '@progress/kendo-data-query'

const initialState: any = {
    editIndex: -1,
    inEdit: null,
    inCreateMode: false,
    data: [],
}

/**
 *  As the user types, the editor actively changes to present the data
 *  in the most usable way to the user. One of the tricky parts, is trying
 *  to maintain the row the user is typing in as the data pool that row
 *  is in changes around it. It needs to stay in the same place, regardless
 *  of what the user types in the filter fields, if the user changes the value
 *  of a cell that it is filtering by, or if the user changes data sets(active 
 *  vs inactive) 
 * 
 *  Solution for the data pool changing in size:
 *  
 * Each time the data pool changes size, there is a previous length, and a new length.
 * CASE: LEN > PREVLEN 
 * If the length of the pool increased, We want the users edit row to
 *  stay in the same place so we add the new data in, remembering the
 *  index the edit user was at previously. And then insert them at that index.
 * 
 *  PREV:           NEXT 
 *       BOB            BOB
 *  ---> DAN       ---> DAN  
 *       SUE            GEORGE 
 *                      SUE
 *   
 * CASE: LEN < PREVLEN
 * 
 * If the length of the pool decreasted, we want the same result, this time though,
 * we need to think a bit more carefully. In the case that the users id is no longer
 * in the filtered results for now, we will just remove it from the array. 
 * 
 * If the user is still in the filtered result, AND the previous index > total length of the
 * array the new index is pushed onto the end of the array
 * 
 * if the user is still in the filtered result, AND the previous index < total len of 
 * the array then the index remains the same.
 * 
 * 
 * SOLUTION:
 *  On every selection, slice out the in edit user, save the index of that user as editIndex. re sort, re filter the data.
 *  insert the data back at the index pushing everything else down.
 *   
 *  
 * 
 */

export default (state: any = initialState, action: any) => {
    switch(action.type) {
        case 'users/CHANGE_USER_IN_EDIT':
            const index = state.data.findIndex((u: User) => u.id === action.payload.id);

            return {
                ...state,
                inEdit: action.payload.id,
                editIndex: state.data.findIndex((u: User) => u.id === action.payload.id)
            }
        case 'users/CHANGE_USER_DATA':
            const { id, field, value } = action.payload
            return {
                ...state,
                data: state.data.map((u: User) => {
                    return u.id === id ? { ...u, [field]: value } : u;
                }),
            }
        case 'users/RESET_VALIDATION_STATE':
            return {
                ...state,
                inEdit: null,
                editIndex: -1,
            }
        case 'users/CANCEL_CHANGES':
            return {
                ...state,
                inCreateMode: false,
                editIndex: -1,
                inEdit: null,
                data: action.payload
            }
            /**
             * Each time the collection changes from a GET_ALL_FULFILLED during initial startup or a CREATE_FULFILLED 
             * when getting a new user ID back from the server to replace the temp ID in the table.
             * Each time data is retreived in this way from the collection the inEdit property is added
             * to each user object.
             */
        case 'users/SYNC_DATA':
            return {
                ...state, 
                inCreateMode: false,
                editIndex: -1,
                inEdit: null,
                data: action.payload.map((u: User) => {
                    return { ...u, inEdit: false }
                }),
            };
        case 'users/REACTIVATE_USER_FULFILLED':
            return {
                ...state,
                inCreateMode: false,
                editIndex: -1,
                inEdit: null,
                data: state.data.map((u: User) => {
                        return u.id === action.payload.data.id ? 
                        { ...u, isActive: true, } : u
                })
            }
        case 'users/SOFT_DELETE_FULFILLED':
            return {
                ...state,
                editIndex: -1,
                data: state.data.map((u: User) => {
                    return u.id === action.payload.data.id ? 
                    { ...u, isActive: false, } : u
                })
            }
            /**
             * 
             * RXJS chain with sync data to get first default filter
             */
        case 'users/CHANGE_FILTER':
            const { inEdit, editIndex} = state;
            if (inEdit === null && editIndex === -1)
            {
                return {
                    ...state,
                    data: filterby

                }
            }
            const filtered = filterBy(state.data, action.payload)
            const filteredIndex = filtered.findIndex((u: any) => u.id === inEdit)
            if (inEdit !== null && filteredIndex === -1)
            console.table(filtered);
            return {
                ...state,
                data: filtered,
                
            }
        case 'users/ENTER_CREATE_MODE':
            const newData = [...state.data];
            newData.unshift(newUserTemplate);
            return {
                ...state,
                data: newData,
                inCreateMode: true,
                editIndex: 0,
            };
        default:
            return state;
    }
}