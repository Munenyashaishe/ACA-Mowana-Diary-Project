const regForm = document.querySelector('#formReg');
const nameReg = document.querySelector('#inputName');
const emailReg = document.querySelector('#inputEmailReg');
const passwordReg = document.querySelector('#inputPasswordReg');
const regBtn = document.querySelector('#btnReg');


// REGISTERS A NEW USER AND SUBMITS THEM TO THE BACKEND, REROUTES TO DASHBOARD ON SUCCESS

regForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(e);

  try {
    const nameValue = nameReg.value;
    const emailValue = emailReg.value;
    const passwordValue = passwordReg.value;

    const { data } = await axios.post('/api/v1/auth/register', {
      name: nameValue,
      email: emailValue,
      password: passwordValue,
    });

    const { user, token } = data;
    console.log(user , token);

    if (user) {
      localStorage.setItem('diary_user', user.name);
      localStorage.setItem('token', token);
      window.location.replace('/dashboard.html');
    }
  } catch (error) {
    console.error(error);
  }
});
