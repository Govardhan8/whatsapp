import styled from 'styled-components'
import { Circle } from 'better-react-spinkit'

export default function Loading() {
	return (
		<center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
			<div>
				<Image
					src='http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png'
					alt=''
					height={200}
				/>
				<Circle color='#3CBC2B' size={60} />
			</div>
		</center>
	)
}
const Image = styled.img`
	margin-bottom: 10px;
`
