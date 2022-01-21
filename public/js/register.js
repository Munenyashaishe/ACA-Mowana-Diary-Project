const regForm = document.querySelector('#formReg');
const nameReg = document.querySelector('#inputName');
const emailReg = document.querySelector('#inputEmailReg');
const passwordReg = document.querySelector('#inputPasswordReg');
const regBtn = document.querySelector('#btnReg');

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
  const nameValue = nameReg.value.trim();
  const emailValue = emailReg.value.trim();
  const passwordValue = passwordReg.value.trim();

  if (nameValue === '') {
    triggerError(nameReg, 'Name cannot be empty');
  } else {
    triggerSuccess(nameReg);
  }

  if (emailValue === '') {
    triggerError(emailReg, 'Email cannot be empty');
  } else {
    triggerSuccess(emailReg);
  }

  if (passwordValue === '') {
    triggerError(passwordReg, 'Password cannot be empty');
  } else {
    triggerSuccess(passwordReg);
  }
};


// REGISTERS A NEW USER AND SUBMITS THEM TO THE BACKEND, REROUTES TO DASHBOARD ON SUCCESS

regForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(e);

  checkInputs();

  try {
    const nameValue = nameReg.value;
    const emailValue = emailReg.value;
    const passwordValue = passwordReg.value;

    const request = await axios
      .post('/api/v1/auth/register', {
        name: nameValue,
        email: emailValue,
        password: passwordValue,
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.status);
        }
      });
    console.log(request);

    const { user, token } = request.data;


    if (user) {
      localStorage.setItem('diary_user', user.name);
      localStorage.setItem('token', token);
      window.location.replace('/dashboard.html');
    }
  } catch (error) {
    console.error(error);
  }
});
