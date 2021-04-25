import styled from 'styled-components'
import { Avatar, Button, IconButton } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import ChatIcon from '@material-ui/icons/Chat'
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat'
import { useState } from 'react'

export default function Sidebar({ menu, MenuHandler }) {
	const [user] = useAuthState(auth)
	const userChatRef = db
		.collection('chats')
		.where('users', 'array-contains', user.email)
	const [chatSnapshot] = useCollection(userChatRef)

	const createChat = () => {
		const input = prompt(
			'please enter an email address for the user you wish to chat with'
		)
		if (!input) return null

		if (
			EmailValidator.validate(input) &&
			!chatAlreadyExists(input) &&
			input !== user.email
		) {
			//add chat into chats in db if it doesn't exist already
			db.collection('chats').add({
				users: [user.email, input],
			})
		}
	}
	const chatAlreadyExists = (recipientEmail) =>
		!!chatSnapshot?.docs.find(
			(chat) =>
				chat.data().users.find((user) => user === recipientEmail)?.length > 0
		)
	const [logoutMenu, SetlogoutMenu] = useState(false)
	const showMenu = () => {
		SetlogoutMenu(!logoutMenu)
	}
	return (
		<Container menu={menu}>
			<Header>
				<IconButton>
					<UserAvatar src={user.photoURL} />
				</IconButton>

				<IconContainer>
					<IconButton>
						<ChatIcon />
					</IconButton>
					<IconButton>
						<MoreVertIcon onClick={showMenu} />
					</IconButton>
				</IconContainer>
				{logoutMenu && (
					<MenuBar onClick={() => auth.signOut()}>
						<p>LOGOUT</p>
					</MenuBar>
				)}
			</Header>
			<Search>
				<SearchIcon />
				<SearchInput placeholder='search in chats' />
			</Search>
			<SidebarButton onClick={createChat}>start a new intro</SidebarButton>
			{/*list of chats*/}
			{chatSnapshot?.docs.map((chat) => (
				<Chat
					key={chat.id}
					id={chat.id}
					users={chat.data().users}
					MenuHandler={MenuHandler}
				/>
			))}
		</Container>
	)
}

const Container = styled.div`
	flex: 0.45;
	border-right: 1px solid whitesmoke;
	height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;

	::-webkit-scrollbar {
		display: none;
	}
	scrollbar-width: none;

	@media screen and (max-width: 420px) {
		display: ${(props) => (props.menu ? 'inline' : 'none')};
	}
`
const Header = styled.div`
	display: flex;
	position: sticky;
	top: 0;
	background-color: white;
	z-index: 1;
	justify-content: space-between;
	align-items: center;
	padding: 15px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`
const UserAvatar = styled(Avatar)`
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`
const IconContainer = styled.div``
const Search = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;
	border-radius: 20px;
`
const SearchInput = styled.input`
	outline: none;
	border: none;
	flex: 1;
`
const SidebarButton = styled(Button)`
	width: 100%;
	border-top: 1px solid whitesmoke;
	border-bottom: 1px solid whitesmoke;
`
const MenuBar = styled.div`
	height: 30px;
	width: 100px;
	border: 5px solid whitesmoke;
	border-radius: 10px;
	background-color: white;
	position: absolute;
	z-index: 1;
	top: 60px;
	left: 180px;
	padding: 5px;
	margin-top: 5px;
	text-align: center;
	font-size: 1rem;
	> p {
		position: relative;
		top: -23px;
		font-weight: bold;
	}
	transition: all 300 ease-in-out;
`
