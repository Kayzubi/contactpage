import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAL8VWK-nLSmMqHXaVEBcCpGj79YgJGBtY',
  authDomain: 'zavier-contact-app.firebaseapp.com',
  projectId: 'zavier-contact-app',
  storageBucket: 'zavier-contact-app.appspot.com',
  messagingSenderId: '923525411936',
  appId: '1:923525411936:web:f0637d738f4ac9e3f73f05',
}

const tablebody = document.getElementById('tbody')
const messageCount = document.querySelector('.message-count')

// init firebase
initializeApp(firebaseConfig)

// init firestore
const database = getFirestore()

// Reference collection from firestore
const colReference = collection(database, 'messages')

// get documents in collection when ever change is appllied
onSnapshot(colReference, (snapshot) => {
  tablebody.innerHTML = ''
  let messages = []

  // add documents to messages array
  for (const doc of snapshot.docs) {
    messages.push({ ...doc.data(), id: doc.id })
  }
  messageCount.innerHTML = '(' + messages.length + ')'

  // create row for each document and append to table
  messages.forEach((message) => {
    const row = document.createElement('tr')

    row.innerHTML = `
    <td>${message.name}</td>
    <td>${message.email}</td>
    <td>${message.phone}</td>
    <td>${message.message}</td>`

    tablebody.append(row)
  })
})

// add messages from form to firestore.
const contactForm = document.querySelector('.contact-form')
contactForm.addEventListener('submit', (e) => {
  e.preventDefault()
  addDoc(colReference, {
    name: `${contactForm.firstname.value} ${contactForm.lastname.value}`,
    email: contactForm.email.value,
    phone: contactForm.phone.value,
    message: contactForm.message.value,
  }).then(() => {
    contactForm.reset()
  })
})
