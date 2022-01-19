const loginForm = document.querySelector('#form');
const email = document.querySelector('#inputEmail');
const password = document.querySelector('#inputPassword');
const loginBtn = document.querySelector('#btnLogin');

window.onload = function () {
  const user = localStorage.getItem('diary_user');
  const token = localStorage.getItem('token');
  if (user || token) {
    // alert('forbidden');
    window.location.replace('/dashboard.html');
  }
};

// FACILITATES LOGGING A USER IN
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

    // PLACES USER AND THEIR TOKEN IN LOCAL STORAGE
    if (user) {
      localStorage.setItem('diary_user', user.name);
      localStorage.setItem('token', token);
      window.location.replace('/dashboard.html');
    } else {
      alert('Credentials must be wrong'); // TODO: GOING TO CHANGE THIS TO SOMETHING MORE REASONABLE
    }
  } catch (error) {
    console.error(error);
  }
});
