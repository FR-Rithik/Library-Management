
// Registration form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const roll = document.getElementById('roll').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roll, email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        document.getElementById('output').innerHTML = 'Registration successful!';
      } else {
        console.log('checked');
        document.getElementById('output').innerHTML = result.error || 'Registration failed!';
      }
    } catch (error) {
      console.error(error);
      document.getElementById('output').innerHTML = 'Error occurred during registration.';
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    // Select back button
    const backButton = document.getElementById('backButton');
    
    // Add click event listener
    backButton.addEventListener('click', () => {
        // Redirect to home page
        window.location.href = '/';
    });
  });
   