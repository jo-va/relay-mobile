import { Actions } from 'react-native-router-flux';
import {
	IDENTIFIER_CHANGED,
	PASSWORD_CHANGED
} from './types';

export const identifierChanged = (text) => {
	return {
		type: IDENTIFIER_CHANGED,
		payload: text
	};
};

export const passwordChanged = (text) => {
	return {
		type: PASSWORD_CHANGED,
		payload: text
	};
};

export const loginUser = ({ identifier, password }) => {
	return (dispatch) => {

	};
};
