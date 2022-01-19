const welcomeText = document.querySelector('#welcome-text');
const entriesDOM = document.querySelector('.entries');
const logoutBtn = document.querySelector('#btnLogout');
const createNewEntryForm = document.querySelector('#formCreate');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
};

const showEntries = async () => {
  'show entries running';

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
            <button class='delete-btn' data-id=${id}><i>Delete</i></button>
            <a href='entry.html?id=${id}' class='bookmark-btn'>Edit</a>
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

// entriesDOM.addEventListener('click', async (e) => {
//   const element = e.target;
//   if (element.parentElement.classList.contains('edit-btn')) {
//     console.log(true);
//   }
// });

entriesDOM.addEventListener('click', async (e) => {
  const element = e.target;
  if (element.parentElement.classList.contains('delete-btn')) {
    const id = element.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/entries/${id}`, config);
      showEntries();
    } catch (error) {
      console.log(error);
    }
  }
});

createNewEntryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const body = bodyInput.value;

  try {
    e.preventDefault();
    await axios.post('/api/v1/entries', { title, body }, config);
    showEntries();
  } catch (error) {
    console.log(error);
  }
});
