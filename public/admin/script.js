document.addEventListener('DOMContentLoaded', () => {
    const bookTableBody = document.getElementById('bookTableBody');
    const bookForm = document.getElementById('bookForm');

    window.editBook = async function(bookId) {
        console.log(bookId);
        //Navigate to edit page with book ID
        window.location.href = `/admin/edit/index.html?id=${bookId}`;
    }
    //Fetch and display books
    async function fetchBooks() {
        try {
            const response = await fetch('/api/books');
            const books = await response.json();
            
            // Clear existing table rows
            bookTableBody.innerHTML = '';

            // Populate table with books
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.ISBN}</td>
                    <td>${book.edition || 'N/A'}</td>
                    <td>${book.copiesAvailable}</td>
                    <td>
                        <button id='edit' class ='edit-btn' onclick="editBook('${book._id}')">Edit</button>
                    </td>
                `;
                bookTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
    // Add Book Form Submission
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            ISBN: document.getElementById('isbn').value,
            edition: document.getElementById('edition').value,
            copiesAvailable: document.getElementById('copiesAvailable').value
        };

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                // Reset form
                bookForm.reset();
                
                // Refresh book list
                fetchBooks();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to add book. Please try again.');
        }
    });

    async function searchBook() {
        console.log("Inside SearchBook");
        try {
            // Remove old search results from the table
            const oldSearchRows = document.querySelectorAll('.search-row');
            oldSearchRows.forEach((row) => row.remove());
    
            // Get search input
            const searchTerm = document.getElementById("search-input").value.toLowerCase();
            
            // Fetch all books
            const response = await fetch('/api/books');
            const books = await response.json();
    
            // Filter books based on search term
            const filteredBooks = books.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.ISBN.includes(searchTerm)
            );
    
            // Get table body reference
            const bookTableBody = document.getElementById('bookTableBody');
    
            if (filteredBooks.length > 0) {
                console.log("Books found:", filteredBooks);
                
                // Add filtered books to table
                filteredBooks.forEach((book) => {
                    const row = document.createElement('tr');
                    row.classList.add('search-row');
                    // Add inline style for background color
                    //row.style.backgroundColor = '#ffebee'; // Light red color
                    // OR
                    row.setAttribute('style', 'background-color:rgb(142, 146, 144);');
                
                    row.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.ISBN}</td>
                        <td>${book.edition || 'N/A'}</td>
                        <td>${book.copiesAvailable}</td>
                        <button id='edit' class ='edit-btn' onclick="editBook('${book._id}')">Edit</button>
                    `;
                    bookTableBody.prepend(row);
                });
            } else {
                console.log("No books found.");
                // Optionally display "No results found" message
                const row = document.createElement('tr');
                row.classList.add('search-row');
                row.innerHTML = `
                    <td colspan="6" style="text-align: center;">No books found</td>
                `;
                bookTableBody.prepend(row);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            document.getElementById('output').innerText = 'Error occurred during search.';
        }
    }

    //calling profile button
    const profileButton = document.getElementById("profileButton");
    profileButton.addEventListener("click", ()=>{
        window.location.href = `/admin/profile/index.html`;
    })

    //calling a button

    const button = document.getElementById("search-button");
    button.addEventListener("click",
        searchBook)

    
   

    // Initial fetch of books
    fetchBooks();
});