import { SortDescriptor } from "@progress/kendo-data-query";

const initialState: SortDescriptor[] =[
    { field: "username", dir: "asc"},
]

export default (state: SortDescriptor[] = initialState, action: any) => {
    switch(action.type) {
        case 'users/CHANGE_SORT':
            return action.payload;
        case 'users/ENTER_CREATE_MODE':
            return [];
        case 'users/CHANGE_USER_DATA':
            return state.length > 0 && action.payload.field === state[0].field ? [] : state;
        default:
            return state;
    }
}