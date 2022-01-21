const newTitle = document.querySelector('#new-title');
const newBody = document.querySelector('#new-body');
const bookmarkBtn = document.querySelector('#btn-bookmark');
const updateBtn = document.querySelector('#submit-edit-btn');
const deleteBtn = document.querySelector('.delete-btn');
const updateForm = document.querySelector('#edit-form');

const successBanner = document.querySelector('#successful-operation');
// THE TOKEN IN LOCAL STORAGE USED TO BUILD THE AUTH HEADER TO ALLOW US TO SEND REQUESTS
const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
};
// THE ID OF THE CURRENT ENTRY, GRABBED FROM THE URL.
const entryId = new URLSearchParams(window.location.search).get('id');

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
  const titleValue = newTitle.value.trim();
  const bodyValue = newBody.value.trim();

  if (titleValue === '') {
    triggerError(newTitle, 'Title cannot be empty');
  } else {
    triggerSuccess(newTitle);
  }

  if (bodyValue === '') {
    triggerError(
      newBody,
      'Oops, looks like your forgot to add content your entry.'
    );
  } else {
    triggerSuccess(newBody);
  }
};

const showBanner = (type) => {
  if (type === 'del') {
    successBanner.textContent = 'Successfully deleted';
    successBanner.classList = 'success-banner delete';
  }
  if (type === 'edit') {
    successBanner.textContent = 'Successfully edited';
    successBanner.classList = 'success-banner edit';
  }
  if (type === 'empty') {
    successBanner.textContent = 'Missing values';
    successBanner.classList = 'success-banner delete';
  }
};

const resetInputs = () => {
  newTitle.value = '';
  newBody.value = '';
  bookmarkBtn.value = false;
};

// GRABS ENTRY FROM LOCAL STORAGE AND POPULATES INPUTS WITH DATA FROM IT


const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
};
const entryId = new URLSearchParams(window.location.search).get('id');


window.onload = function () {
  const entry = JSON.parse(localStorage.getItem('entry_to_edit'));
  newTitle.value = entry.title;
  newBody.value = entry.body;
  bookmarkBtn.checked = entry.isFavorite;
};

deleteBtn.addEventListener('click', async (e) => {
  try {
    await axios.delete(`/api/v1/entries/${entryId}`, config);
    showBanner('del');
    resetInputs();
    window.location.replace('/dashboard.html');
  } catch (error) {}
});

// ON SUBMIT, EDITS THE CURRENT ENTRY

updateForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(e);

  checkInputs();

  try {
    const entryTitle = newTitle.value;
    const entryBody = newBody.value;
    const entryBookmarked = bookmarkBtn.checked;

    const request = await axios
      .patch(
        `/api/v1/entries/${entryId}`,
        {
          title: entryTitle,
          body: entryBody,
          isFavorite: entryBookmarked,
        },
        config
      )
      .catch(function (error) {
        if (error.response.status === 400) {
          showBanner('empty');
        }
      });
    if (request.status === 201) {
      resetInputs();
      window.location.replace('/dashboard.html');
    }
  } catch (error) {}

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
