document.addEventListener('DOMContentLoaded', () => {
    // Get book ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    console.log('Book ID:', bookId);
  
    //back to index function

    async function backPage(){
      console.log('Welcome to backPage');
      window.location.href = '/admin/index.html';
    }

    // Function to fetch books and prefill the form
    async function fetchBooks() {
      try {
        const response = await fetch(`/api/books`);
        const books = await response.json();
        const book = books.find((b) => b._id === bookId);
  
        if (!book) {
          console.error('Book not found');
          document.getElementById('output').innerText = 'Book not found!';
          return;
        }
  
        console.log(book);
  
        const inputs = document.querySelectorAll('input');
  
        // Prefill form inputs with book data
        inputs.forEach((input) => {
          let originalValue;
          switch (input.id) {
            case 'title':
              originalValue = book.title;
              break;
            case 'author':
              originalValue = book.author;
              break;
            case 'isbn':
              originalValue = book.ISBN;
              break;
            case 'edition':
              originalValue = book.edition;
              break;
            case 'copiesAvailable':
              originalValue = book.copiesAvailable;
              break;
            default:
              originalValue = '';
              break;
          }
  
          // Set placeholder and data attribute
          input.placeholder = originalValue;
          input.dataset.originalValue = originalValue;
  
          // Add event listeners for interaction
          if (input.id !== 'isbn') {
            input.addEventListener('focus', function () {
              // Clear placeholder when focused
              this.placeholder = '';
  
              // Set value to original value if empty
              if (!this.value) {
                this.value = this.dataset.originalValue;
                this.select(); // Select all text
              }
            });
  
            input.addEventListener('blur', function () {
              // Restore placeholder if no value entered
              if (!this.value) {
                this.placeholder = this.dataset.originalValue;
              }
            });
          }
        });
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
  
    // Get form element
    const bookForm = document.getElementById('bookForm');
  
    // Submit edit form
    bookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      // Prepare updated book data
      const updatedBook = {
        title: document.getElementById('title').value || document.getElementById('title').dataset.originalValue,
        author: document.getElementById('author').value || document.getElementById('author').dataset.originalValue,
        ISBN: document.getElementById('isbn').value || document.getElementById('isbn').dataset.originalValue,
        edition: document.getElementById('edition').value || document.getElementById('edition').dataset.originalValue,
        copiesAvailable: document.getElementById('copiesAvailable').value || document.getElementById('copiesAvailable').dataset.originalValue
      };
  
      console.log('Updated Book Data:', updatedBook);
  
      // Confirmation before updating
      const ifConfirm = confirm("Are you sure? Changes are not reversible.");
      if (ifConfirm) {
        try {
          // Send update request
          const response = await fetch(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBook)
          });
  
          if (response.ok) {
            // Parse the updated book data from response
            const updatedBookResponse = await response.json();
  
            // Show success message
            alert('Book updated successfully');
  
            // Redirect to book list or details page
            window.location.href = '/admin/index.html';
          } else {
            // Handle error response
            const errorData = await response.json();
            throw new Error(errorData.message || 'Update failed');
          }
        } catch (error) {
          console.error('Update error:', error);
          alert(`Failed to update book: ${error.message}`);
        }
      } else {
        // User canceled the confirmation
        console.log('Update canceled by user.');
      }
    });
  
    // Delete Book Function
    async function deleteBook() {
      // Native browser confirm
      const isConfirmed = confirm('Are you sure you want to delete this book?');
  
      if (isConfirmed) {
        try {
          const response = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE'
          });
  
          if (response.ok) {
            // Success message
            alert('Book deleted successfully');
  
            // Redirect to book list
            window.location.href = '/admin/index.html';
          } else {
            // Error handling
            const errorData = await response.json();
            alert(errorData.message || 'Failed to delete book');
          }
        } catch (error) {
          console.error('Delete error:', error);
          alert('An error occurred while deleting the book');
        }
      } else {
        // User canceled the confirmation
        console.log('Deletion canceled by user.');
      }
    }
  
    // Add event listener to delete button
    const deleteButton = document.getElementById('delete');
    if (deleteButton) {
      deleteButton.addEventListener('click', deleteBook);
    }

    // add eventListener for back button

    const backButton = document.getElementById('back');
    if(backButton){
      backButton.addEventListener('click',
        backPage
        //window.location.href = '/admin/index.html'
      );
    }

     // Initial fetch of books
     fetchBooks();
  });