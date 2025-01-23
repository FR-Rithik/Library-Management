// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('studentId');
    const bookId = urlParams.get('bookId');
    const borrowBtn = document.getElementById('borrow-btn');
    const backBtn = document.getElementById('back-btn');
    console.log(studentId, bookId);

    //function to the next borrowConfirm page
    window.studentPage = async function(){
        window.location.href = `/student/index.html?id=${studentId}`
    }

    //fetching book information
    async function getStudentAndBook(){
        try{
            const response = await fetch(
                `/api/borrowed/${studentId}/${bookId}`,{
                    method: 'GET'
                }
            ) 
            const studentAndBook = await response.json();
            console.log(studentAndBook);

            const bookTable= document.getElementById('bookTable');
            console.log(bookTable);
            bookTable.innerHTML = `
                <tr>
                    <td class="label">Title</td>
                    <td class="name">${studentAndBook.book.title}</td>
                </tr>
                <tr>
                    <td class="label">Author</td>
                    <td class="author">${studentAndBook.book.author}</td>
                </tr>
                <tr>
                    <td class="label">Edition</td>
                    <td class="edition">${studentAndBook.book.edition}</td>
                </tr>
                <tr>
                    <td class="label">Available Copies</td>
                    <td class="copiesAvailable">${studentAndBook.book.availableCopies}</td>
                </tr>
            `

        }
        catch(error){
            console.error('Error fetching books:', error);
        }
      }

    async function borrowBook() {
        
        try{
            const response = await fetch(
                '/api/borrow',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId: bookId,
                    studentId: studentId
                })
                }
            )

            if (response.ok) {
                alert('Book borrowed successfully');
                // Redirect or update UI
                setTimeout(() => {
                    studentPage();
                }, 500); // 500ms delay
            } else {
                throw new Error('Failed to borrow book 1');
            }
        }
        catch(error){
            console.error('Error:', error);
            alert('Failed to borrow book 2');
        }
    }

    //adding event listener to borrow and back button
    borrowBtn.addEventListener( 'click', ()=>{
        const userResponse = confirm('Do you want to Borrow?');
        if(userResponse) borrowBook();
        else{

        }
    }
    )
    //
    backBtn.addEventListener( 'click', ()=>{
        //const userResponse = confirm('Do you want to Borrow?');
        studentPage();
    }
    )

    getStudentAndBook();
});