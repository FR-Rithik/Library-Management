document.addEventListener('DOMContentLoaded', () => {
    const bookTableBody = document.getElementById('bookTableBody');

    // Function to fetch and display books
    async function fetchBooks() {
        try {
            const response = await fetch('/api/books', {
                method: 'GET'  // Explicitly specifying GET method
            });
            const books = await response.json();
            console.log(books);
            console.log('receiving script');
            
            // Clear existing table rows
            bookTableBody.innerHTML = '';

            // Populate table with books
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.ISBN || 'N/A'}</td>
                    <td>${book.edition || 'N/A'}</td>
                    <td>${book.copiesAvailable || 0}</td>
                `;
                bookTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
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
                    row.setAttribute('style', 'background-color:rgb(175, 141, 146);');
                
                    row.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.ISBN}</td>
                        <td>${book.edition || 'N/A'}</td>
                        <td>${book.copiesAvailable}</td>
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

    //calling a button

    const button = document.getElementById("search-button");
    button.addEventListener("click",
        searchBook
    )

    fetchBooks();
});