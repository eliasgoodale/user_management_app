import * as Joi from 'joi'
import { User } from './types' 


/** 
 * User constraint validation with separate password validation
 */
export const userSchema: any = Joi.object().keys({
	id: Joi.string(),
	firstName: Joi.string().min(2).max(20).required(),
	lastName: Joi.string().min(2).max(20).required(),
	username: Joi.string().min(5).max(20).required(),
	isActive: Joi.boolean().required(),
	isEntryAdmin: Joi.boolean().required(),
	isListAdmin: Joi.boolean().required(),
	isLocationManager: Joi.boolean().required(),
	isOperatorAdmin: Joi.boolean().required(),
	isUserAdmin: Joi.boolean().required(),
})

export function userPassesConstraintValidation (user: User) {
	const result: any = Joi.validate({ ...user }, userSchema)
	console.log(result);
	return result.error === null;
}

export function passwordPassesConstraintValidation (password: string): boolean {
	return password.length > 6
}

/**
 * Editor Data Pre Processing Procedure based on current state
 */

export function processData(operations: any, state: any, STABLE_INDEX: boolean) {
	const { validation, editor, collection, filter, sort } = state;
	const { userInEdit } = validation;
	const { editIndex, inEdit, inCreateMode } = editor.present;
	const { sortFn, filterFn } = operations;
	const processedData = filterFn(sortFn(collection.data, sort), filter);

	if(inCreateMode) {
		return [userInEdit, ...processedData];
	}
	/**
	 * If nothing is in edit we dont need to do anything 
	 * we can just returned the processed data
	 */
	if (inEdit !== null && STABLE_INDEX) {
	/**
	 * Else we have an inEdit user so we search through the filtered/sorted data
	 * for that index.
	 */
		/**
		 * Index we were at before the data processing
		 */
		const lockedIndex = editIndex;
		/**
		 * Index our where current user in edit currently resides after processing
		 */
		const currentIndex = processedData.findIndex((u: any) => u.id === inEdit)
		/**
		 * The most up to date copy of the the data of that user in edit
		 */
		const user = userInEdit;
		/**
		 * If we dont find the index in the processed data, we need to find where to
		 * add in the current user into the array.
		 */
		if (currentIndex === -1) {
			/**
			 * If the locked index is greater than or equal to the length of the processedData
			 * array, we need to push the edit user to the back.
			 */
			if (lockedIndex >= processedData.length) {
				processedData.push(user);
			} else {
				/**
				 * Else we splice it into the array at the lockedIndex
				 */
				processedData.splice(lockedIndex, 0, user);
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
				processedData.push(user);
			}
			/**
			 * Else we need to splice out the element at the currentIndex,
			 * and splice in the most recent version of user at the lockedIndex.
			 */
			else {
				processedData.splice(currentIndex, 1)
				processedData.splice(lockedIndex, 0, user);
			}
			/**
			 * Finally if the indexes are the same, we just update the data.
			 */
		} else {
			processedData[lockedIndex] = {...user}
		}
	}
		return processedData;
}

