import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth } from '../firebase'
import moment from 'moment'
export default function Message({ user, message }) {
	const [loggedUser] = useAuthState(auth)
	return (
		<Container>
			{user === loggedUser.email ? (
				<Sender>
					{message.message}
					<TimeStamp>
						{message.timestamp ? moment(message.timestamp).format('LT') : '...'}
					</TimeStamp>{' '}
				</Sender>
			) : (
				<Receiver>
					{message.message}
					<TimeStamp>
						{message.timestamp ? moment(message.timestamp).format('LT') : '...'}
					</TimeStamp>
				</Receiver>
			)}
		</Container>
	)
}
const Container = styled.div``
const MessageElement = styled.p`
	width: fit-content;
	padding: 15px;
	border-radius: 8px;
	min-width: 60px;
	padding-bottom: 26px;
	position: relative;
	text-align: right;
`
const Sender = styled(MessageElement)`
	margin-left: auto;
	background-color: #dcf8c6;
	margin-right: 10px;
`
const Receiver = styled(MessageElement)`
	text-align: left;
	background-color: whitesmoke;
	margin-left: 10px;
`
const TimeStamp = styled.span`
	color: gray;
	padding: 10px;
	font-size: 9px;
	position: absolute;
	bottom: 0;
	text-align: right;
	right: 0;
`
