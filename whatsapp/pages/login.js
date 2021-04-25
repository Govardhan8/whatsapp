import Head from 'next/head'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { auth, provider } from '../firebase'

export default function Login() {
	const signin = () => {
		auth.signInWithPopup(provider).catch(alert)
	}
	return (
		<Container>
			<Head>
				<title>Login</title>
			</Head>
			<LoginContainer>
				<Logo src='http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png' />
				<Button variant='outlined' onClick={signin}>
					SignIn with Google
				</Button>
			</LoginContainer>
		</Container>
	)
}
const Container = styled.div`
	display: grid;
	place-items: center;
	height: 100vh;
	background-color: whitesmoke;

	@media (max-width: 450px) {
		background: whitesmoke;
	}
`
const LoginContainer = styled.div`
	padding: 100px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);

	@media (max-width: 400px) {
		display: flex;
		padding: 50px;
		border-radius: 2px;
	}
`
const Logo = styled.img`
	height: 200px;
	width: 200px;
	margin-bottom: 50px;
`
