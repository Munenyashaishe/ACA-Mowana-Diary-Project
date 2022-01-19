const newTitle = document.querySelector('#new-title');
const newBody = document.querySelector('#new-body');
const bookmarkBtn = document.querySelector('#btn-bookmark');
const updateBtn = document.querySelector('#submit-edit-btn');
const updateForm = document.querySelector('#edit-form');
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
};
const entryId = new URLSearchParams(window.location.search).get('id');

window.onload = function () {
  const task = JSON.parse(localStorage.getItem('entry_to_edit'));
  newTitle.value = task.title;
  newBody.value = task.body;
  bookmarkBtn.checked = task.isFavorite;
};

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

    console.log(entry);
  } catch (error) {
    console.log(error);
  }
});

// const getTask = async () => {
//   try {
//     const { data } = await axios.get(`/api/v1/entries/${entryId}`, config);
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

// getTask();
