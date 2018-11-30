import { ValidationState, User, newUserTemplate } from '../types';
import { compare } from 'fast-json-patch'
import { 
    userPassesConstraintValidation as constraintValidator,
    passwordPassesConstraintValidation as passwordValidator,
} from '../validation'

const validator = (user: User ): boolean => {
    const toValidate = { ...user };
    delete toValidate.password;
    if (user.id === 'temp')
        return passwordValidator(user.password) && constraintValidator(toValidate);
   return constraintValidator(toValidate); 
}

const initialState: ValidationState = {
    validator: validator,
    generatePatch: compare,
    patch: [],
    inEdit: null,
    userInEdit: {id: ""},
    backupUserData: {id: ""}
}

export default (state: any = initialState, action: any) => {
    switch(action.type) {
        case 'users/CHANGE_USER_DATA':
            const {id, field, value} = action.payload;
            const newData = { ...state.userInEdit, [field]: value };
            return {
                ...state,
                inEdit: id,
                userInEdit: newData,
                patch: id === 'temp' ? [] : compare(state.backupUserData, newData),
            };
        case 'users/CHANGE_USER_IN_EDIT':
            delete action.payload.inEdit;
            return {
                ...state,
                inEdit: action.payload.id,
                userInEdit: {...action.payload, password: ""},
                backupUserData: {id: "loading"},
            };
        case 'users/ENTER_CREATE_MODE':
            return {
                ...state,
                inEdit: "temp",
                userInEdit: newUserTemplate,
                backupUserData: newUserTemplate,
            }
        case 'users/UPDATE_FULFILLED':
            return initialState;
        case 'users/CANCEL_CHANGES':
            return initialState;
        case 'users/CREATE_FULFILLED':
            return initialState;
        case 'users/LOAD_BACKUP':
            return {
                ...state,
                backupUserData: { ...action.payload, password: "" },
            };
        default:
            return state;
        
    }
}