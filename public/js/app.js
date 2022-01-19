const welcomeText = document.querySelector('#welcome-text');
const entriesDOM = document.querySelector('.entries');
const logoutBtn = document.querySelector('#btnLogout');

const showEntries = async () => {
  'show entries running';
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  };

  try {
    const {
      data: { nbHits, entries },
    } = await axios.get('/api/v1/entries', config);

    console.log(typeof nbHits);

    if (nbHits < 1) {
      entriesDOM.innerHTML = `
        <h5>You've made no entries. Go on, add one.</h5>
      `;
    }

    const allEntries = entries
      .map((entry) => {
        const { createdAt, isFavorite, title, _id: id, body } = entry;

        return `
        <article>
          <header>
            <h4>${title}</h4>
            <p>${createdAt}</p>
            <p>Bookmarked: ${isFavorite}</p>
            <button class='edit-btn'><i>Edit/Confirm</i></button>
            <button class='delete-btn'><i>Delete</i></button>
          </header>
          <footer>
          
            <p>${body}</p>
          </footer>
          
        </article>
      `;
      })
      .join('');
    entriesDOM.innerHTML = allEntries;
  } catch (error) {
    console.log(error);
    entriesDOM.innerHTML = `
    '<h5>There was an error, please try later....</h5>';
    `;
  }
};

window.onload = function () {
  const user = localStorage.getItem('diary_user');
  const token = localStorage.getItem('token');
  if (!user || !token) {
    // alert('forbidden');
    window.location.replace('/forbidden.html');
  }

  welcomeText.textContent = `Welcome to your diary, ${localStorage.getItem(
    'diary_user'
  )}`;
  showEntries();
};

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('diary_user');
  window.location.replace('/');
});

entriesDOM.addEventListener('click', async (e) => {
  const element = e.target;
  console.log(element);
});
