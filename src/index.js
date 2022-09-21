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

// init firebase
initializeApp(firebaseConfig)

// init firestore
const database = getFirestore()

// Reference collection from firestore
const colReference = collection(database, 'messages')

// get documents in collection when ever change is applied
onSnapshot(colReference, (snapshot) => {
  // show loading
  table.style.visibility = 'hidden'
  loader.style.display = 'block'

  // delay table load for 2 seconds
  setTimeout(() => {
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
      row.id = message.id
      row.className = 'received-message'

      row.innerHTML = `
    <td>${message.name}</td>
    <td>${message.email}</td>
    <td>${message.phone}</td>
    <td>${message.message}</td>`

      tablebody.append(row)
    })

    // remove loading state
    loader.style.display = 'none'
    table.style.visibility = 'visible'
  }, 1500)
})

// add messages from form to firestore.
contactForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // // check if all form fields are valid
  let validFirstName = validateFirstName(),
    validLastName = validateLastName(),
    validEmail = validatEmail(),
    validPhone = validatePhone(),
    validMessage = validateMessage()

  let formValid =
    validFirstName && validLastName && validEmail && validPhone && validMessage

  if (formValid) {
    // disable submit button
    submitBtn.innerText = 'Submiting...'
    submitBtn.disabled = true

    // add form values to firstore database
    addDoc(colReference, {
      name: `${contactForm.firstname.value} ${contactForm.lastname.value}`,
      email: contactForm.email.value,
      phone: contactForm.phone.value,
      message: contactForm.message.value,
    }).then(() => {
      // reset form
      contactForm.reset()
      submitBtn.innerText = 'Submit'
      submitBtn.disabled = false
    })
  }
})

// validate input fields on input
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

//show error
const showError = (input, message) => {
  //get the form group element
  const element = input.parentElement.parentElement

  // add error class to input element
  input.classList.add('error')
  input.classList.remove('success')
  input.focus()

  // use parent element to set error message
  const errorMessage = element.querySelector('.error-message')
  errorMessage.innerHTML = `<span>${message}</span> <i class="fa-solid fa-circle-exclamation"></i>`
}

//show success
const showSuccess = (input) => {
  //get the form group element
  const element = input.parentElement.parentElement

  // add success class to input element
  input.classList.remove('error')
  input.classList.add('success')

  // use parent element to clear error message
  const errorMessage = element.querySelector('.error-message')
  errorMessage.textContent = ''
}

// check for valid First name
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

// check for valid Last name
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

// check for valid email address
const validatEmail = () => {
  let valid = false
  const userEmail = email.value
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z]+)\.([a-zA-Z]{2,5})$/ // name@example.com

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

// check for valid phone number
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

// check for valid message
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

// check if input is a required field
const required = (value) => (value !== '' ? true : false)

// console.log(required('ccvv'))
