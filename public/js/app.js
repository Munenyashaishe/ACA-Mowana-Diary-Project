const welcomeText = document.querySelector('#welcome-text');
const entriesDOM = document.querySelector('.entries');
const logoutBtn = document.querySelector('#btnLogout');
const createNewEntryForm = document.querySelector('#formCreate');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const banner = document.querySelector('.banner');

const searchInput = document.querySelector('#search');
const bookmarkFilter = document.querySelector('#bookmarked');

const dateElement = document.querySelector('.date');

//SETTING THE CURRENT DAY ON THE DASHBOARD
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
let today = new Date();

dateElement.innerHTML = today.toLocaleDateString('en-US', options);

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
};

const showEntries = async () => {
  // GETS DATA FROM BACKEND

  try {
    const {
      data: { nbHits, entries },
    } = await axios.get('/api/v1/entries', config);

    if (!entries) {
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
            <h3>${title}</h3>
            <p>Written: ${new Intl.DateTimeFormat('en-UK').format(
              new Date(createdAt)
            )}</p>
          </header>
          <div class='content'>
              ${
                body.length < 120
                  ? `<p>${body}</p>`
                  : `<p>${body.substring(
                      0,
                      120
                    )}...<strong>Click edit to view more</strong></p>`
              }
          </div>
          <footer>
            <div>
              <label for="favorite">Bookmarked</label>
              <input type="checkbox" disabled name="favorite" ${
                isFavorite ? 'checked' : ''
              } />
            </div>
            <button class='btn edit-btn' data-id=${id}>Edit</button>
          </footer>    
        </article>
      `;
      })
      .reverse()
      .join('');

    {
      /* <button class='btn delete-btn' data-id=${id}>Delete</button> */
    }

    entriesDOM.innerHTML = allEntries;
  } catch (error) {
    // IF FETCH WAS UNSUCCESSFUL, SHOW AN ERROR

    entriesDOM.innerHTML = `
    '<h5>There was an error, please try later....</h5>';
    `;
  }
};

// FILTER SEARCH
searchInput.addEventListener('keyup', (e) => {
  const filterVal = e.target.value.toLocaleLowerCase();
  const entries = document.querySelectorAll('.entry');

  const entriesArray = Array.apply(null, entries);

  entriesArray.filter((entry, index) => {
    let title = entries[index].getElementsByTagName('h3')[0];
    if (title.innerHTML.toLocaleLowerCase().indexOf(filterVal) > -1) {
      console.log(entries);
      entries[index].style.display = '';
    } else {
      entries[index].style.display = 'none';
    }
  });
});

// FILTER BOOKMARKED
bookmarkFilter.addEventListener('change', (e) => {
  const isFilterChecked = e.target.checked;
  const entries = document.querySelectorAll('.entry');

  const entriesArray = Array.apply(null, entries);

  entriesArray.filter((entry, index) => {
    let bookmarkToggle = entries[index].getElementsByTagName('input')[0];
    if (isFilterChecked === bookmarkToggle.checked) {
      console.log(entries);
      entries[index].style.display = '';
    } else {
      entries[index].style.display = 'none';
    }
  });
});

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
    console.log('edit btn clciked');
    const id = element.dataset.id;

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
    await axios
      .post('/api/v1/entries', { title, body }, config)
      .catch(function (error) {
        if (error.response.status === 400) {
          banner.classList = 'banner error';
          banner.textContent = 'Fields cannot be empty';

          setTimeout(() => {
            banner.classList = 'banner';
          }, 3000);
        }
      });
    titleInput.value = '';
    bodyInput.value = '';
    showEntries();
  } catch (error) {
    console.log(error);
  }
});
