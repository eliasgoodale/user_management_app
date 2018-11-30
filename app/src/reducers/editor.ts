import { newUserTemplate, User, EditorState } from '../types'

const initialState: any = {
    editIndex: -1,
    inCreateMode: false,
    data: [],
}

export default (state: any = initialState, action: any) => {
    switch(action.type) {
        case 'users/CHANGE_USER_IN_EDIT':
            return {
                ...state,
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
        case 'users/CANCEL_CHANGES':
            return {
                ...state,
                inCreateMode: false,
                editIndex: -1,
                data: action.payload
            }
        case 'users/SYNC_DATA':
            return {
                ...state, 
                inCreateMode: false,
                editIndex: -1,
                data: action.payload,
            };
        case 'users/UPDATE_FULFILLED':
            return {
                ...state,
                inCreateMode: false,
                editIndex: -1,
            }
        case 'users/SOFT_DELETE_FULFILLED':
            return {
                ...state,
                editIndex: -1,
                data: state.data.map((u: User) => {
                    return u.id === action.payload.data.id ? {
                         ...u, isActive: false, 
                        } : u
                })
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