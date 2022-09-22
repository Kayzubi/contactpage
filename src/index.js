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

const table = document.querySelector('.table')
const tablebody = document.getElementById('tbody')
const messageCount = document.querySelector('.message-count')
const contactForm = document.querySelector('.contact-form')
const firstName = document.getElementById('firstname')
const lastName = document.getElementById('lastname')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const userMessage = document.getElementById('message')
const submitBtn = document.getElementById('submit-btn')
const loader = document.querySelector('.load-spinner')

initializeApp(firebaseConfig)

const database = getFirestore()

const collectionReference = collection(database, 'messages')

onSnapshot(collectionReference, (snapshot) => {
  table.style.visibility = 'hidden'
  loader.style.display = 'block'

  setTimeout(() => {
    tablebody.innerHTML = ''
    let messages = []
    for (const doc of snapshot.docs) {
      messages.push({ ...doc.data(), id: doc.id })
    }
    messageCount.innerHTML = '(' + messages.length + ')'

    messages.forEach((message) => {
      const row = document.createElement('tr')
      row.id = message.id
      row.className = 'received-message'

      row.innerHTML = `
    <td>${message.name}</td>
    <td>${message.email}</td>
    <td>${message.phone}</td>
    <td>${message.message}</td>`

      tablebody.append(row)
    })

    loader.style.display = 'none'
    table.style.visibility = 'visible'
  }, 1500)
})

contactForm.addEventListener('submit', (e) => {
  e.preventDefault()

  let validFirstName = validateFirstName(),
    validLastName = validateLastName(),
    validEmail = validatEmail(),
    validPhone = validatePhone(),
    validMessage = validateMessage()

  let formValid =
    validFirstName && validLastName && validEmail && validPhone && validMessage

  if (formValid) {
    submitBtn.innerText = 'Submiting...'
    submitBtn.disabled = true

    addDoc(colReference, {
      name: `${contactForm.firstname.value} ${contactForm.lastname.value}`,
      email: contactForm.email.value,
      phone: contactForm.phone.value,
      message: contactForm.message.value,
    }).then(() => {
      contactForm.reset()
      submitBtn.innerText = 'Submit'
      submitBtn.disabled = false
    })
  }
})

contactForm.addEventListener('input', (e) => {
  switch (e.target.id) {
    case 'firstname':
      validateFirstName()
      break
    case 'lastname':
      validateLastName()
      break
    case 'email':
      validatEmail()
      break
    case 'phone':
      validatePhone()
      break
    case 'message':
      validateMessage()
      break
  }
})

const showError = (input, message) => {
  const formGroup = input.parentElement.parentElement

  input.classList.add('error')
  input.classList.remove('success')
  input.focus()

  const errorMessage = formGroup.querySelector('.error-message')
  errorMessage.innerHTML = `<span>${message}</span> <i class="fa-solid fa-circle-exclamation"></i>`
}

const showSuccess = (input) => {
  const formGroup = input.parentElement.parentElement

  input.classList.remove('error')
  input.classList.add('success')

  const errorMessage = formGroup.querySelector('.error-message')
  errorMessage.textContent = ''
}

const validateFirstName = () => {
  let valid = false
  const userFirstName = firstName.value

  if (!required(userFirstName)) {
    showError(firstName, 'First name cannot be empty')
  } else {
    showSuccess(firstName)
    valid = true
  }

  return valid
}

const validateLastName = () => {
  let valid = false
  const userLastName = lastName.value

  if (!required(userLastName)) {
    showError(lastName, 'Last name cannot be empty')
  } else {
    showSuccess(lastName)
    valid = true
  }

  return valid
}

const validatEmail = () => {
  let valid = false
  const userEmail = email.value
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z]+)\.([a-zA-Z]{2,5})$/

  if (!required(userEmail)) {
    showError(email, 'Email cannot be empty')
  } else if (!re.test(userEmail)) {
    showError(email, 'Enter a valid Email address')
  } else {
    showSuccess(email)
    valid = true
  }
  return valid
}

const validatePhone = () => {
  let valid = false
  const userPhone = phone.value
  const re = /^0[789][01]\d{8}$/ // Must match a Nigerian phone number

  if (!required(userPhone)) {
    showError(phone, 'Phone number cannot be empty')
  } else if (!re.test(userPhone)) {
    showError(phone, 'Enter a valid Phone number')
  } else {
    showSuccess(phone)
    valid = true
  }
  return valid
}

const validateMessage = () => {
  let valid = false
  const message = userMessage.value

  if (!required(message)) {
    showError(userMessage, 'Message cannot be empty')
  } else {
    showSuccess(userMessage)
    valid = true
  }

  return valid
}

const required = (value) => (value !== '' ? true : false)
