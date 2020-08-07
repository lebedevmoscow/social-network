import axios from 'axios'
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_PROFILE,
	SET_INITIAL_PROFILE,
} from './../actions/types'
import { setAlert } from './alert'
import setAuthToken from './../utils/setAuthToken'

// Load user
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token)
	}
	try {
		const response = await axios.get('/api/auth')
		dispatch({ type: USER_LOADED, payload: response.data })
	} catch (e) {
		dispatch({ type: AUTH_ERROR })
	}
}

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}

	const body = JSON.stringify({ name, email, password })

	try {
		const response = await axios.post('/api/users', body, config)
		console.log('Register response', response)

		dispatch({
			type: REGISTER_SUCCESS,
			payload: response.data,
		})
		dispatch({
			type: SET_INITIAL_PROFILE,
		})
		dispatch(loadUser())
	} catch (e) {
		console.log('e', e.response.data.errors)
		e.response.data.errors.forEach((err) =>
			dispatch(setAlert(err.msg, 'danger'))
		)
		return dispatch({
			type: REGISTER_FAIL,
		})
	}
}

// Login User
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	}

	const body = JSON.stringify({ email, password })

	try {
		const response = await axios.post('/api/auth', body, config)

		dispatch({
			type: LOGIN_SUCCESS,
			payload: response.data,
		})

		dispatch(loadUser())
	} catch (e) {
		e.response.data.errors.forEach((err) =>
			dispatch(setAlert(err.msg, 'danger'))
		)
		return dispatch({
			type: LOGIN_FAIL,
		})
	}
}

// Logout

export const logout = () => (dispatch) => {
	dispatch({ type: LOGOUT })
	dispatch({ type: CLEAR_PROFILE })
}
