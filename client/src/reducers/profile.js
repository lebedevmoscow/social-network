import {
	GET_PROFILE,
	PROFILE_ERROR,
	CLEAR_PROFILE,
	UPDATE_PROFILE,
	SET_INITIAL_PROFILE,
	GET_PROFILES,
	GET_REPOS,
	LOAD_PROFILE,
	LOAD_PROFILES,
	LOAD_DEV_PROFILE,
} from '../actions/types'

const initialState = {
	profile: null,
	profiles: [],
	repos: [],
	loading: true,
	error: {},
}

export default function (state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case LOAD_DEV_PROFILE:
			return {
				...state,
				loading: true,
			}

		case LOAD_PROFILES:
			return {
				...state,
				loading: true,
			}

		case LOAD_PROFILE:
			return {
				...state,
				loading: true,
			}

		case GET_REPOS:
			return {
				...state,
				loading: false,
				repos: payload,
			}

		case GET_PROFILES:
			return {
				...state,
				profiles: payload,
				loading: false,
			}

		case SET_INITIAL_PROFILE:
			return {
				...state,
				profile: null,
				profiles: [],
				repos: [],
				loading: true,
				error: {},
			}

		case CLEAR_PROFILE:
			return {
				...state,
				profile: null,
				repos: [],
			}
		case UPDATE_PROFILE:
			return {
				...state,
				profile: payload,
				repos: [],
			}

		case GET_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false,
			}
		case PROFILE_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			}
		default:
			return state
	}
}
