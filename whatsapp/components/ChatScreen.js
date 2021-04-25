import { Avatar, IconButton } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { useState, useRef } from 'react'
import { auth, db } from '../firebase'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import { useCollection } from 'react-firebase-hooks/firestore'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import Message from './Message'
import MicIcon from '@material-ui/icons/Mic'
import firebase from 'firebase'
import TimeAgo from 'timeago-react'
import MenuIcon from '@material-ui/icons/Menu'
import SendIcon from '@material-ui/icons/Send'
export default function ChatScreen({
	chat,
	messages,
	recipientEmail,
	MenuHandler,
}) {
	const endOfMessagesRef = useRef(null)
	const [user] = useAuthState(auth)
	const [input, setInput] = useState('')
	const router = useRouter()

	const [recipientSnapshot] = useCollection(
		db.collection('users').where('email', '==', recipientEmail)
	)
	const recipient = recipientSnapshot?.docs?.[0]?.data()

	const [messagesSnapshot] = useCollection(
		db
			.collection('chats')
			.doc(router.query.id)
			.collection('messages')
			.orderBy('timestamp', 'asc')
	)
	const showMessages = () => {
		if (messagesSnapshot) {
			return messagesSnapshot.docs.map((message) => (
				<Message
					key={message.id}
					user={message.data().user}
					message={{
						...message.data(),
						timestamp: message.data().timestamp?.toDate().getTime(),
					}}
				/>
			))
		} else {
			return JSON.parse(messages).map((message) => (
				<Message key={message.id} user={user} message={message} />
			))
		}
	}

	const scrollToBottom = () => {
		endOfMessagesRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	}

	const sendMessage = (e) => {
		e.preventDefault()

		//update last seen
		db.collection('users').doc(user.uid).set(
			{
				lastseen: firebase.firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		)

		db.collection('chats').doc(router.query.id).collection('messages').add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			message: input,
			user: user.email,
			photoURL: user.photoURL,
		})
		setInput('')
		scrollToBottom()
	}

	return (
		<Container>
			<Header>
				<MenuContainer>
					<IconButton>
						<MenuIcon onClick={MenuHandler} style={{ fontSize: 40 }} />
					</IconButton>
				</MenuContainer>
				{recipient ? (
					<Avatar src={recipient?.photoURL} />
				) : (
					<Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
				)}

				<HeaderInformation>
					<h3>
						{recipientEmail.length > 23
							? recipientEmail.slice(0, 13) + '...'
							: recipientEmail}
					</h3>
					{recipientSnapshot ? (
						<p>
							Last active:{' '}
							{recipient?.lastseen?.toDate() ? (
								<TimeAgo datetime={recipient?.lastseen?.toDate()} />
							) : (
								'Unavailable'
							)}
						</p>
					) : (
						<p>Loading...</p>
					)}
				</HeaderInformation>
				<HeaderIcons>
					<IconButton>
						<AttachFileIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</HeaderIcons>
			</Header>
			<MessageContainer>
				{showMessages()}
				<EndOfMessage ref={endOfMessagesRef} />
			</MessageContainer>

			<InputContainer>
				<InsertEmoticonIcon />
				<Input value={input} onChange={(e) => setInput(e.target.value)} />
				<MicIcon />
				<button
					style={{ backgroundColor: 'white', border: 'none' }}
					disabled={!input}
					type='submit'
					onClick={sendMessage}
				>
					<SendIcon style={{ color: 'black', fontSize: 25 }} />
				</button>
			</InputContainer>
		</Container>
	)
}
const Container = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
`
const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	align-items: center;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`
const MenuContainer = styled.div`
	@media screen and (max-width: 420px) {
		display: inline;
	}
	@media screen and (min-width: 450px) {
		display: none;
	}
`

const HeaderInformation = styled.div`
	margin-left: 15px;
	flex: 1;
	> h3 {
		margin-bottom: 3px;
	}
	> p {
		font-size: 14px;
		color: grey;
	}
`
const HeaderIcons = styled.div``
const MessageContainer = styled.div`
	background-color: #e5ded8;
	height: 78vh;
	flex-grow: 1;
	overflow-y: scroll;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
`

const InputContainer = styled.form`
	display: flex;
	align-items: center;
	position: sticky;
	bottom: 0;
	padding: 10px;
	z-index: 100;
	background-color: white;
`
const Input = styled.input`
	flex: 1;
	outline: 0;
	border: none;
	border-radius: 10px;
	padding: 20px;
	position: sticky;
	margin-left: 15px;
	margin-right: 15px;
	background-color: whitesmoke;
`
const EndOfMessage = styled.div`
	margin-bottom: 100px;
`
