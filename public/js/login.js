const loginForm = document.querySelector('#form');
const email = document.querySelector('#inputEmail');
const password = document.querySelector('#inputPassword');
const loginBtn = document.querySelector('#btnLogin');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const emailValue = email.value;
    const passwordValue = password.value;

    const { data } = await axios.post('/api/v1/auth/login', {
      email: emailValue,
      password: passwordValue,
    });
    const { user, token } = data;
    console.log(user, token);

    if (user) {
      localStorage.setItem('diary_user', user.name);
      localStorage.setItem('token', token);
      window.location.replace('/dashboard.html');
    } else {
      alert('Credentials must be wrong');
    }
  } catch (error) {
    console.error(error);
  }
});
