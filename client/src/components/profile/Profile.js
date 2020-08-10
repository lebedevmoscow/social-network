import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from './../layout/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import { getProfileById } from './../../actions/profile'

const Profile = ({
	getProfileById,
	match,
	profile: { profile, loading },
	auth,
}) => {
	useEffect(() => {
		getProfileById(match.params.id)
		console.log('auth', auth)
	}, [getProfileById])

	return (
		<Fragment>
			{(profile === null || loading) && <Spinner />}
			{profile !== null && !loading && (
				<Fragment>
					<Link to='/profiles' className='btn btn-light'>
						Back to Profiles
					</Link>
					{auth.isAuthenticated &&
						!auth.loading &&
						auth.user._id === profile.user._id && (
							<Link to='/edit-profile' className='btn btn-dark'>
								Edit Profile
							</Link>
						)}
					<div className='profile-grid my-1'>
						<ProfileTop profile={profile} />
						<ProfileAbout profile={profile} />
					</div>
				</Fragment>
			)}
		</Fragment>
	)
}

// <Fragment>
// 					<Link to='/profiles' className='btn btn-light'>
// 						Back to Profiles
// 					</Link>
// 					{auth.isAuthenticated &&
// 						!auth.loading &&
// 						auth.user_id === profile.user._id && (
// 							<Link to='/edit-profile' className='btn btn-dark'>
// 								Edit Profile
// 							</Link>
// 						)}
// 				</Fragment>

// {auth.isAuthenticated &&
//     !auth.loading &&
//     auth.user._id === profile.user._id && (
//         <Link to='/edit-profile' className='btn btn-dark'>
//             Edit profile
//         </Link>
//     )}

Profile.propTypes = {
	getProfileById: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	profile: state.profile,
	auth: state.auth,
})

export default connect(mapStateToProps, { getProfileById })(Profile)
