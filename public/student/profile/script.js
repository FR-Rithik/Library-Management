
document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    console.log('Student ID:', studentId);

    if (!studentId) {
        console.error('No student ID provided in URL');
        return;
    }
    //find borrowed books
    async function borrowedBooks() {
        try{
            const response = await fetch(`/api/borrowed/${studentId}`,{
                method:'GET'
            })

            const books= await response.json();
            const bookTableBody = document.getElementById("borrowTable");
            console.log('here is the books: ',books);

            // Populate table with books
            books.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.bookId.title}</td>
                    <td>${book.bookId.author}</td>
                    <td>${book.bookId.ISBN || 'N/A'}</td>
                    <td>${book.bookId.edition || 'N/A'}</td>
                `;
                bookTableBody.appendChild(row);
            });

        }
        catch(error){

        }
    }
    // Fetching student information
    async function getStudent() {
        try {
            const response = await fetch('/api/allUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Include credentials if needed (e.g., for authentication)
                // credentials: 'include'
            });

            // Check if the response was successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
            }

            const students = await response.json();

            // Ensure that 'students' is an array
            if (!Array.isArray(students)) {
                throw new Error('Expected an array of students');
            }

            // Find the student with the matching ID
            const student = students.find(student => student._id === studentId);
            //console.log('Student:', student);

            const profileTable = document.getElementById('profileTable');

            if (!profileTable) {
                console.error('Element with id "profileTable" not found in the DOM');
                return;
            }

            if (!student) {
                console.error(`Student with ID ${studentId} not found`);
                profileTable.innerHTML = '<tr><td colspan="2">Student not found.</td></tr>';
                return;
            }

            profileTable.innerHTML = `
                <tr>
                    <td class="label">Name</td>
                    <td class="name">${student.name}</td>
                </tr>
                <tr>
                    <td class="label">Roll Number</td>
                    <td class="roll">${student.roll}</td>
                </tr>
                <tr>
                    <td class="label">Email</td>
                    <td class="email">${student.email}</td>
                </tr>
            `;

        } catch (error) {
            console.error('Error fetching student:', error);
        }
    }

    getStudent();
    borrowedBooks();
});