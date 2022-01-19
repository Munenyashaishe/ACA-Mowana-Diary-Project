const newTitle = document.querySelector('#new-title');
const newBody = document.querySelector('#new-body');
const bookmarkBtn = document.querySelector('#btn-bookmark');
const updateBtn = document.querySelector('#submit-edit-btn');
const updateForm = document.querySelector('#edit-form');
// THE TOKEN IN LOCAL STORAGE USED TO BUILD THE AUTH HEADER TO ALLOW US TO SEND REQUESTS
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
};
// THE ID OF THE CURRENT ENTRY, GRABBED FROM THE URL.
const entryId = new URLSearchParams(window.location.search).get('id');

// GRABS ENTRY FROM LOCAL STORAGE AND POPULATES INPUTS WITH DATA FROM IT
window.onload = function () {
  const task = JSON.parse(localStorage.getItem('entry_to_edit'));
  newTitle.value = task.title;
  newBody.value = task.body;
  bookmarkBtn.checked = task.isFavorite;
};

// ON SUBMIT, EDITS THE CURRENT ENTRY
updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(e);

  try {
    const entryTitle = newTitle.value;
    const entryBody = newBody.value;
    const entryBookmarked = bookmarkBtn.checked;

    const {
      data: { entry },
    } = await axios.patch(
      `/api/v1/entries/${entryId}`,
      {
        title: entryTitle,
        body: entryBody,
        isFavorite: entryBookmarked,
      },
      config
    );

    newTitle.value = '';
    newBody.value = '';
    bookmarkBtn.value = false;

    window.location.replace('/dashboard.html');
  } catch (error) {
    console.log(error);
  }
});

// ! INITIALLY WANTED TO MAKE A CALL TO THE BACKED TO GRAB THE INDIVIDUAL DATA BEFORE DECIDING AGAINST IT.
// ! WILL DELETE DURING REFACTOR
// const getTask = async () => {
//   try {
//     const { data } = await axios.get(`/api/v1/entries/${entryId}`, config);
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

// getTask();
