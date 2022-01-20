const loginForm = document.querySelector('#form');
const email = document.querySelector('#inputEmail');
const password = document.querySelector('#inputPassword');
const loginBtn = document.querySelector('#btnLogin');

const triggerError = (input, message) => {
  const formControl = input.parentElement; // grabs the parent div of the current input
  const small = formControl.querySelector('small'); // for the error text

  formControl.className = 'form-control error';

  small.innerText = message;
};

const triggerSuccess = (input) => {
  const formControl = input.parentElement; // grabs the parent div of the current input

  formControl.className = 'form-control success';
};

const checkInputs = () => {
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  if (emailValue === '') {
    triggerError(email, 'Email cannot be empty');
  } else {
    triggerSuccess(email);
  }

  if (passwordValue === '') {
    triggerError(password, 'Password cannot be empty');
  } else {
    triggerSuccess(password);
  }
};

window.onload = function () {
  const user = localStorage.getItem('diary_user');
  const token = localStorage.getItem('token');
  if (user || token) {
    window.location.replace('/dashboard.html');
  }
};

// FACILITATES LOGGING A USER IN
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  checkInputs();

  try {
    const emailValue = email.value;
    const passwordValue = password.value;

    const request = await axios
      .post('/api/v1/auth/login', {
        email: emailValue,
        password: passwordValue,
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          triggerError(email, 'BAD REQUEST: Check fields for empty values');
          triggerError(password, 'BAD REQUEST: Check fields for empty values');
          console.log(error.response.status);
        }

        if (error.response.status === 401) {
          triggerError(email, 'Invalid credentials, check and try again');
          triggerError(password, 'Invalid credentials, check and try again');
        }
      });

    const { user, token } = request.data;
    console.log(user, token);

    if (request.status === 200) {
      triggerSuccess(email);
      triggerSuccess(password);
    }

    // PLACES USER AND THEIR TOKEN IN LOCAL STORAGE
    if (user) {
      localStorage.setItem('diary_user', user.name);
      localStorage.setItem('token', token);
      window.location.replace('/dashboard.html');
    }
  } catch (error) {}
});
