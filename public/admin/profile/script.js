document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("search").addEventListener("submit", async function (e) {
        e.preventDefault();
        
        // Get the form values
        const studentRoll = document.getElementById("roll").value;
        const bookIsbn = document.getElementById("isbn").value;
    
        console.log('Search Values:', { studentRoll, bookIsbn });
    
        try {
            // Make the API call
            const response = await fetch('/api/returnBookSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    studentRoll, 
                    bookIsbn 
                }) // Send as an object
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Parse and log the response
            const data = await response.json();
            console.log('Search Result:', data);

            if (data) {
                // Update the table row
                const row = document.getElementById("searchResult");
                row.innerHTML = `
                    <td>${data.name || ''}</td>
                    <td>${data.roll || ''}</td>
                    <td>${data.title || ''}</td>
                    <td>${data.ISBN || ''}</td>
                    <td>
                        <button 
                            class='return-btn' 
                            onclick="returnBook('${data.id}')"
                        >
                            Return
                        </button>
                    </td>
                `;
            } else {
                // Handle no results
                const row = document.getElementById("searchResult");
                row.innerHTML = '<td colspan="5">No results found</td>';
            }
        } catch (error) {
            console.error("Error during book search:", error);
            // Show error to user
            const row = document.getElementById("searchResult");
            row.innerHTML = '<td colspan="5">Error searching for book</td>';
        }
    });

    // Define returnBook function in global scope
    window.returnBook = async function(bookId) {
        try {
            const response = await fetch(`/api/returnBook/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Book returned successfully');
            // Clear the search result
            document.getElementById("searchResult").innerHTML = '';
            // Clear the form
            document.getElementById("search").reset();
        } catch (error) {
            console.error("Error returning book:", error);
            alert('Error returning book');
        }
    };
});