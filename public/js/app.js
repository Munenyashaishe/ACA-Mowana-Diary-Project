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
  // GETS DATA FROM BACKEND
  try {
    const {
      data: { nbHits, entries },
    } = await axios.get('/api/v1/entries', config);

    if (nbHits < 1) {
      entriesDOM.innerHTML = `
        <h5>You've made no entries. Go on, add one.</h5>
      `;
    }

    // CREATES INDIVIDUAL ENTRIES FROM THE BACKEND DATA
    const allEntries = entries
      .map((entry) => {
        const { createdAt, isFavorite, title, _id: id, body } = entry;

        return `
        <article class='entry'>
          <header>
            <div>
              <h4>${title}</h4>
              <label for="favorite">Bookmarked</label>
              <input type="checkbox" name="favorite" ${
                isFavorite ? 'checked' : ''
              } />
              </div>
            <div> 
              <p>Date: ${new Intl.DateTimeFormat('en-UK').format(
                new Date(createdAt)
              )}</p>
            </div>
            </header>
            <footer>
            <p>${body}</p>
            <button class='btn edit-btn' data-id=${id}>Edit</button>
            <button class='btn delete-btn' data-id=${id}>Delete</button>
          </footer>
          
        </article>
      `;
      })
      .join('');
    entriesDOM.innerHTML = allEntries;
  } catch (error) {
    // IF FETCH WAS UNSUCCESSFUL, SHOW AN ERROR
    entriesDOM.innerHTML = `
    '<h5>There was an error, please try later....</h5>';
    `;
  }
};

// CHECKS TO SEE IF TOKEN IS VALID AND USER EXISTS BEFORE LOADING THEIR ENTRIES
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

// LOGS USER OUT, REMOVES THEIR TOKEN FROM LOCAL STORAGE AND REROUTES BACK TO index.html
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('diary_user');
  window.location.replace('/');
});

// FOR EDITING AN ENTRY, CLICKING THE BUTTON REROUTES TO entry.html AND ALLOWS US TO EDIT IT FROM THERE
entriesDOM.addEventListener('click', async (e) => {
  const element = e.target;
  console.log(element);
  if (element.classList.contains('edit-btn')) {
    const id = element.dataset.id; // ATTACHED DURING THE MAPPING (IS THE ID OF THE ENTRY)
    try {
      const {
        data: { entry },
      } = await axios.get(`api/v1/entries/${id}`, config);

      // PLACES THE ENTRY IN LOCAL STORAGE SO THAT WE CAN GRAB IT FROM entry.html
      localStorage.setItem('entry_to_edit', JSON.stringify(entry));
      window.location.replace(`/entry.html?id=${id}`);
    } catch (error) {}
  }
});

// DELETE AN ENTRY FROM THE MAIN LIST
entriesDOM.addEventListener('click', async (e) => {
  const element = e.target;
  if (element.classList.contains('delete-btn')) {
    console.log(element);
    const id = element.dataset.id;
    try {
      await axios.delete(`/api/v1/entries/${id}`, config);
      showEntries();
    } catch (error) {
      console.log(error);
    }
  }
});

// POSTING A NEW ENTRY
createNewEntryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const body = bodyInput.value;

  try {
    e.preventDefault();
    await axios.post('/api/v1/entries', { title, body }, config);
    titleInput.value = '';
    bodyInput.value = '';
    showEntries();
  } catch (error) {
    console.log(error);
  }
});
