document.addEventListener('DOMContentLoaded', function () {
    const openModalBtn = document.getElementById('add');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('myModal');
    const submitBtn = document.getElementById('submitBtn');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const modalForm = document.getElementById('modalForm');
    const notesContainer = document.getElementById('notesContainer');

    let editTarget = null; // Variable to store the card being edited

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
      notesContainer.appendChild(noteCard);
    }

    openModalBtn.addEventListener('click', function () {
      modal.style.display = 'block';
      modal.style.backdropFilter =' blur(10px)';
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
          // If there's an edit target, update the existing card
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

    notesContainer.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      const targetCard = event.target.closest('.card');

      if (targetCard) {
        // Show a context menu for the card
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
            // Edit card - Open edit modal
            modal.style.display = 'block';
            titleInput.value = targetCard.querySelector('h2').innerText;
            descriptionInput.value = targetCard.querySelector('p').innerText;
            editTarget = targetCard; // Set the edit target
          } else if (menuItemId === 'delete') {
            // Delete card - Ask for confirmation
            const isConfirmed = window.confirm('Are you sure you want to delete this card?');

            if (isConfirmed) {
              // Delete the card
              notesContainer.removeChild(targetCard);
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
    });
    const searchInput = document.getElementById('search');

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
