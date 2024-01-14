document.addEventListener('DOMContentLoaded', function () {
  const openModalBtn = document.getElementById('add');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('myModal');
  const submitBtn = document.getElementById('submitBtn');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const modalForm = document.getElementById('modalForm');
  const notesContainer = document.getElementById('notesContainer');
  const searchInput = document.getElementById('search');

  let editTarget = null; // Variable to store the note being edited

  // Load notes from local storage on page load
  function loadNotesFromLocalStorage() {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach((note) => {
      createNoteCard(note.title, note.description);
    });
  }

  // Save notes to local storage
  function saveNotesToLocalStorage() {
    const noteCards = document.querySelectorAll('.card');
    const notes = [];
    noteCards.forEach((card) => {
      const title = card.querySelector('h2').innerText;
      const description = card.querySelector('p').innerText;
      notes.push({ title, description });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  // Create a new note card and append it to the notes container
  function createNoteCard(title, description) {
    const noteCard = document.createElement('div');
    noteCard.classList.add('card');
    noteCard.innerHTML = `<h2>${title}</h2><p>${description}</p>`;
    
    // Check if it's a mobile device
    if (isMobile()) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('buttons-container');
      
      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
      editButton.classList.add('edit-btn');
      
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.classList.add('delete-btn');
      
      buttonsContainer.appendChild(editButton);
      buttonsContainer.appendChild(deleteButton);
      
      noteCard.appendChild(buttonsContainer);
      
      // Add click event listeners to the buttons
      editButton.addEventListener('click', function () {
        openEditModal(title, description);
      });
      
      deleteButton.addEventListener('click', function () {
        deleteNoteCard(noteCard);
      });
    } else {
      // For non-mobile devices, add context menu for right-click
      noteCard.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        showContextMenu(event, noteCard);
      });
    }
    
    notesContainer.appendChild(noteCard);
  }

  // Check if the device is a mobile device
  function isMobile() {
    return window.innerWidth <= 767; // Adjust the breakpoint as needed
  }

  // Open the edit modal with existing data
  function openEditModal(title, description) {
    modal.style.display = 'block';
    titleInput.value = title;
    descriptionInput.value = description;
    editTarget = null; // Reset edit target when opening the modal
  }

  // Delete the note card
  function deleteNoteCard(noteCard) {
    notesContainer.removeChild(noteCard);
    saveNotesToLocalStorage();
  }

  function showContextMenu(event, targetNoteCard) {
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.innerHTML = '<div class="menu-item" id="edit">Edit</div><div class="menu-item" id="delete">Delete</div>';
    document.body.appendChild(contextMenu);

    // Position the context menu
    const { clientX, clientY } = event;
    contextMenu.style.left = `${clientX}px`;
    contextMenu.style.top = `${clientY}px`;

    // Handle menu item clicks
    contextMenu.addEventListener('click', function (menuEvent) {
      const menuItemId = menuEvent.target.id;

      if (menuItemId === 'edit') {
        // Edit note - Open edit modal
        openEditModal(targetNoteCard.querySelector('h2').innerText, targetNoteCard.querySelector('p').innerText);
      } else if (menuItemId === 'delete') {
        // Delete note - Ask for confirmation
        const isConfirmed = window.confirm('Are you sure you want to delete this note?');

        if (isConfirmed) {
          // Delete the note
          notesContainer.removeChild(targetNoteCard);
          // Save notes to local storage after deletion
          saveNotesToLocalStorage();
        }
      }

      // Remove the context menu
      document.body.removeChild(contextMenu);
    });

    // Close the context menu on any click outside the menu
    const closeContextMenu = function (clickEvent) {
      if (!contextMenu.contains(clickEvent.target)) {
        document.body.removeChild(contextMenu);
        window.removeEventListener('click', closeContextMenu);
      }
    };

    window.addEventListener('click', closeContextMenu);
  }

  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
  });

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    editTarget = null; // Reset edit target when closing the modal
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      editTarget = null; // Reset edit target when closing the modal
    }
  });

  submitBtn.addEventListener('click', function () {
    const title = titleInput.value;
    const description = descriptionInput.value;

    if (title && description) {
      if (editTarget) {
        // If there's an edit target, update the existing note
        editTarget.querySelector('h2').innerText = title;
        editTarget.querySelector('p').innerText = description;
        editTarget = null; // Reset edit target after editing
      } else {
        // Otherwise, create a new note card
        createNoteCard(title, description);
      }

      // Save notes to local storage
      saveNotesToLocalStorage();

      // Clear the form after adding/editing a note
      modalForm.reset();
      // Close the modal
      modal.style.display = 'none';
    } else {
      alert('Please enter both title and description.');
    }
  });

  notesContainer.addEventListener('click', function (event) {
    const targetNoteCard = event.target.closest('.card');
    const editButton = event.target.closest('.edit-btn');
    const deleteButton = event.target.closest('.delete-btn');

    if (targetNoteCard && !editButton && !deleteButton) {
      // If a note card is clicked (not the edit or delete buttons), open edit modal
      const title = targetNoteCard.querySelector('h2').innerText;
      const description = targetNoteCard.querySelector('p').innerText;
      openEditModal(title, description);
    }

    if (editButton) {
      // If the edit button is clicked, find the associated note card and open edit modal
      const title = targetNoteCard.querySelector('h2').innerText;
      const description = targetNoteCard.querySelector('p').innerText;
      openEditModal(title, description);
    }

    if (deleteButton) {
      // If the delete button is clicked, find the associated note card and delete it
      deleteNoteCard(targetNoteCard);
    }
  });

  // Search functionality
  searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();
    const noteCards = document.querySelectorAll('.card');

    noteCards.forEach((noteCard) => {
      const title = noteCard.querySelector('h2').innerText.toLowerCase();
      const description = noteCard.querySelector('p').innerText.toLowerCase();
      const isMatch = title.includes(query) || description.includes(query);
      noteCard.style.display = isMatch ? 'block' : 'none';
    });
  });

  // Load notes from local storage on page load
  loadNotesFromLocalStorage();
});
