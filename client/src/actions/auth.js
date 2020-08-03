import axios from 'axios'
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
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
		console.log('res', response)
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

		dispatch({
			type: REGISTER_SUCCESS,
			payload: response.data,
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

		console.log('res', response)
		dispatch({
			type: LOGIN_SUCCESS,
			payload: response.data,
		})

		dispatch(loadUser())
	} catch (e) {
		console.log('e', e.response.data.errors)
		e.response.data.errors.forEach((err) =>
			dispatch(setAlert(err.msg, 'danger'))
		)
		return dispatch({
			type: LOGIN_FAIL,
		})
	}
}
