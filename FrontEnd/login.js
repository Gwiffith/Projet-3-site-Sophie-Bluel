const apiUrl ='http://localhost:5678/api'

function getUserData(event) {
    event.preventDefault(); // Empêche la soumission du formulaire
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    return {email, password};
}

async function logIn(event) {
    const userData = getUserData(event);
    const loginData = {
        email: userData.email,
        password: userData.password
    }
    const urlLogIn = apiUrl +'/users/login'
    try {
        const response = await fetch(urlLogIn, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        if(response.ok) {
            const  result = await response.json();
            const token = result.token;
            console.log(token)
            localStorage.setItem('userToken', token);
            redirectUser()
        } else {
            console.error ('Erreur dans l’identifiant ou le mot de passe', response.status, response.statusText)
            alert('Erreur dans l’identifiant ou le mot de passe')
        }
        
    } catch (error) {
        console.error('Erreur de la requête fetch :', error)
    };
}

function redirectUser() {
    window.location.href = 'index.html';
}


document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit',logIn);
});

