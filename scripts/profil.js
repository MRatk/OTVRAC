document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            const userResp = await response.json();
            const user = userResp.jsonLD;
            console.log(user)
            document.getElementById('email').textContent = `Email: ${user.email}`;
            document.getElementById('nickname').textContent = `Name: ${user.givenName}`;
            document.getElementById('updated_at').textContent = `Account updated at: ${user.performerIn.endDate}`;

        } else {
            console.error('Greška prilikom dohvaćanja korisničkih podataka.');
        }
    } catch (error) {
        console.error('Greška:', error);
    }
});

