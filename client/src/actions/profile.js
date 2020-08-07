import axios from 'axios'
import { setAlert } from './alert'

import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from './types'

// Get current users profiles
export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/profile/me')

		console.log('res', res)
		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		})
	} catch (e) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: e.response.statusText, status: e.response.status },
		})
	}
}

// Create or update profile
export const createProfile = (formData, history, edit = false) => async (
	dispatch
) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const response = await axios.post('/api/profile', formData, config)
		dispatch({
			type: GET_PROFILE,
			payload: response.data,
		})

		// LEGACY

		// dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'))

		// if (!edit) {
		// 	history.push('/dashboard')
		// }

		history.push('/dashboard')
		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'))
	} catch (e) {
		const errors = e.response.data.errors
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: e.response.statusText, status: e.response.status },
		})
	}
}

// Add Experience

export const addExperience = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const response = await axios.put(
			'/api/profile/experience',
			formData,
			config
		)
		dispatch({
			type: UPDATE_PROFILE,
			payload: response.data,
		})

		// LEGACY

		// dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'))

		// if (!edit) {
		// 	history.push('/dashboard')
		// }

		history.push('/dashboard')
		dispatch(setAlert('Experience Added', 'success'))
	} catch (e) {
		const errors = e.response.data.errors
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: e.response.statusText, status: e.response.status },
		})
	}
}

// Add Education

export const addEducation = (formData, history) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const response = await axios.put(
			'/api/profile/education',
			formData,
			config
		)
		console.log('response', response)
		dispatch({
			type: UPDATE_PROFILE,
			payload: response.data,
		})

		history.push('/dashboard')
		dispatch(setAlert('Education Added', 'success'))
	} catch (e) {
		const errors = e.response.data.errors
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
		}

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: e.response.statusText, status: e.response.status },
		})
	}
}
