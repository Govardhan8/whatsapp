import { Avatar } from '@material-ui/core'
import styled from 'styled-components'
import getRecipientEmail from '../utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'

export default function Chat({ id, users, MenuHandler }) {
	const [user] = useAuthState(auth)
	const router = useRouter()
	const recipientEmail = getRecipientEmail(users, user)
	const [recipientSnapshot] = useCollection(
		db.collection('users').where('email', '==', recipientEmail)
	)
	const recipient = recipientSnapshot?.docs?.[0]?.data()
	const enterChat = () => {
		router.push(`/chat/${id}`)
	}
	return (
		<Container onClick={enterChat()}>
			{recipient ? (
				<UserAvatar src={recipient?.photoURL} />
			) : (
				<UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
			)}
			<p>{recipientEmail}</p>
		</Container>
	)
}
const Container = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-word;
	border-bottom: 1px solid whitesmoke;
	:hover {
		background-color: #e9eaeb;
	}
`
const UserAvatar = styled(Avatar)`
	margin: 5px;
	margin-right: 15px;
`
