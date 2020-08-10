import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Spinner from './../layout/Spinner'

// Redux
import { connect } from 'react-redux'

const Landing = ({ isAuthenticated, loading }) => {
	const [content, setContent] = useState(null)

	console.log('loading', loading)
	useEffect(() => {
		if (isAuthenticated && !loading) {
			setContent(<Redirect to='/dashboard' />)
		}

		if (!isAuthenticated && !loading) {
			setContent(
				<section className='landing'>
					<div className='dark-overlay'>
						<div className='landing-inner'>
							<h1 className='x-large'>
								Developer Social Network
							</h1>
							<p className='lead'>
								Create a developer profile/portfolio, share
								posts and get help from other developers
							</p>
							<div className='buttons'>
								<Link
									to='/register'
									className='btn btn-primary'
								>
									Sign Up
								</Link>
								<Link to='/login' className='btn btn-light'>
									Login
								</Link>
							</div>
						</div>
					</div>
				</section>
			)

			if (loading) {
				setContent(<Spinner />)
			}
		}
	}, [loading, isAuthenticated])

	// if (isAuthenticated) {
	// 	return <Redirect to='/dashboard' />
	// }

	// <section className='landing'>
	// 				<div className='dark-overlay'>
	// 					<div className='landing-inner'>
	// 						<h1 className='x-large'>
	// 							Developer Social Network
	// 						</h1>
	// 						<p className='lead'>
	// 							Create a developer profile/portfolio, share
	// 							posts and get help from other developers
	// 						</p>
	// 						<div className='buttons'>
	// 							<Link
	// 								to='/register'
	// 								className='btn btn-primary'
	// 							>
	// 								Sign Up
	// 							</Link>
	// 							<Link to='/login' className='btn btn-light'>
	// 								Login
	// 							</Link>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</section>
	return content
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading,
})

export default connect(mapStateToProps)(Landing)
