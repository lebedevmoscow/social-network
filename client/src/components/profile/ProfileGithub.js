import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getGithubRepos } from './../../actions/profile'
import Spinner from './../layout/Spinner'

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
	useEffect(() => {
		getGithubRepos(username)
	}, [getGithubRepos])

	return (
		<div className='profile-github'>
			<h2 className='text-primary my-1'>Github Repos</h2>
			{repos === null ? (
				<Spinner />
			) : (
				repos.map((repo) => {
					return (
						<div className='repo bg-white p-1 my-1' key={repo._id}>
							<div>
								<h4>
									<a
										href={repo.html_url}
										target='_blank'
										rel='noopener norefferer'
									>
										{repo.name}
									</a>
								</h4>
								<p>{repo.description}</p>
							</div>
							<div>
								<ul>
									<li className='badge badge-primary'>
										Stars: {repo.stargazers_count}
									</li>
									<li className='badge badge-primary'>
										Watchers: {repo.watchers_count}
									</li>
									<li className='badge badge-primary'>
										Forks: {repo.forks_count}
									</li>
								</ul>
							</div>
						</div>
					)
				})
			)}
		</div>
	)
}

ProfileGithub.propTypes = {
	repos: PropTypes.array.isRequired,
	username: PropTypes.string.isRequired,
	getGithubRepos: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	repos: state.profile.repos,
})

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub)