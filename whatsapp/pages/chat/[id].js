import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import { auth, db } from '../../firebase'
import getRecipientEmail from '../../utils/getRecipientEmail'
import { useState } from 'react'
export default function Chat({ messages, chat }) {
	const [user] = useAuthState(auth)
	const recipientEmail = getRecipientEmail(chat.users, user)
	const [menu, setMenu] = useState(true)
	const MenuHandler = () => {
		setMenu(!menu)
		
	}

	return (
		<Container>
			<Head>
				<title>Chat with {recipientEmail}</title>
			</Head>

			<Sidebar menu={menu} MenuHandler={MenuHandler} />
			<ChatContainer menu>
				<ChatScreen
					chat={chat}
					messages={messages}
					recipientEmail={recipientEmail}
					MenuHandler={MenuHandler}
				/>
			</ChatContainer>
		</Container>
	)
}

export async function getServerSideProps(context) {
	const ref = db.collection('chats').doc(context.query.id)
	const messagesRef = await ref
		.collection('messages')
		.orderBy('timestamp', 'asc')
		.get()

	const messages = messagesRef.docs
		.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))
		.map((messages) => ({
			...messages,
			timestamp: messages.timestamp.toDate().getTime(),
		}))

	//prep chat
	const chatRes = await ref.get()
	const chat = {
		id: chatRes.id,
		...chatRes.data(),
	}

	return {
		props: {
			messages: JSON.stringify(messages),
			chat: chat,
		},
	}
}

const Container = styled.div`
	display: flex;
`
const ChatContainer = styled.div`
	flex: 1;
	overflow: scroll;
	height: 100hv;
	::-webkit-scrollbar {
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
`
