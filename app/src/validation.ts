import * as Joi from 'joi'
import { User } from './types' 

const passwordSchema: any = Joi.object().keys({
	password: Joi.string().min(6).max(25).required(),
})

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

export function userPassesConstraintValidation (user: User, needsPasswordCheck: boolean) {
	const checkVal = {...user};
	delete checkVal.password;
	const result = Joi.validate({...checkVal}, userSchema);
	if (needsPasswordCheck) {
		const passwordResult: any = Joi.validate({password: user.password}, passwordSchema);
		console.log(passwordResult);
		return passwordResult.error === null && result.error === null
	}
	else
		return result.error === null;
}
