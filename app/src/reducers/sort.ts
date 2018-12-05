import { SortDescriptor } from "@progress/kendo-data-query";

const initialState: SortDescriptor[] =[
    { field: "username", dir: "asc"},
]

export default (state: SortDescriptor[] = initialState, action: any) => {
    switch(action.type) {
        case 'users/CHANGE_SORT':
            return action.payload;
        case 'users/CHANGE_DATA':
            return [];
        default:
            return state;
    }
}