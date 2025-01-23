 
  // Login form submission
  console.log('login e esechi ami');
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);
      const result = await response.json();
      if (response.ok) {
        window.location.href = result.redirectUrl;
        //document.getElementById('output').innerHTML = 'Login successful!';
      } else {
        document.getElementById('output').innerHTML = result.message || 'Incorrect Credential';
      }
    } catch (error) {
      console.error(error);
      document.getElementById('output').innerHTML = 'Error occurred during login.';
    }
  });
  // Basic back to home event listener
document.addEventListener('DOMContentLoaded', () => {
  // Select back button
  const backButton = document.getElementById('backButton');
  
  // Add click event listener
  backButton.addEventListener('click', () => {
      // Redirect to home page
      window.location.href = '/';
  });
});
