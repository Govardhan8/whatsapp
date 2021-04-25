import firebase from 'firebase'

const firebaseConfig = {
	apiKey: 'AIzaSyA4uZEW5N7N79mouuLgjNA4Bcz-SnT4IkM',
	authDomain: 'whatsapp-81d0f.firebaseapp.com',
	projectId: 'whatsapp-81d0f',
	storageBucket: 'whatsapp-81d0f.appspot.com',
	messagingSenderId: '807287298705',
	appId: '1:807287298705:web:c4920749ca12c7528a3d30',
}

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }
