import { newUserTemplate, User, EditorState } from '../types'
import { filterBy } from '@progress/kendo-data-query'

const initialState: any = {
    editIndex: -1,
    inEdit: null,
    inCreateMode: false,
    data: [],
}


export default (state: any = initialState, action: any) => {
    switch(action.type) {
        case 'users/CHANGE_USER_IN_EDIT':
            const newIndex = state.data.findIndex(
                (u: User) => u.id === action.payload.id);
            return state.inCreateMode ? state : {
                ...state,
                inEdit: action.payload.id,
                editIndex: newIndex
            }
        case 'users/CHANGE_DATA':
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
                inCreateMode: false,
                inEdit: null,
                editIndex: -1,
            }
        case 'users/CANCEL_CHANGES':
            const { data, inCreateMode } = state;
            if (inCreateMode) {
                data.shift();
            }
            return {
                data: data,
            }
        case 'users/GET_PROCESSED_DATA':
            return {
                ...state, 
                data: action.payload
            };
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