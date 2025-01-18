function download_JSON(){
    window.location.href = '/mobiteli.json';
}
function download_CSV() {
    window.location.href = '/mobiteli.csv';
}

async function checkUserStatus(){
    try{
        const userStatusResp = await fetch('api/users');
        const userStatus = await userStatusResp.json()
        console.log(userStatusResp)
        if(userStatus.logged){
            document.getElementById('korisnickiProfil').style.display = 'block'
            document.getElementById('osvjezi').style.display = 'block'
            document.getElementById('odjava').style.display = 'block'
            document.getElementById('prijava').style.display = 'none'


        }else {
            document.getElementById('korisnickiProfil').style.display = 'none'
            document.getElementById('osvjezi').style.display = 'none'
            document.getElementById('odjava').style.display = 'none'
            document.getElementById('prijava').style.display = 'block'



        }
    }catch (error){
        console.log('Error fetching: ', error)
    }
}
document.addEventListener('DOMContentLoaded', checkUserStatus);


document.getElementById('korisnickiProfil').addEventListener('click', async function () {
    const response = await fetch('api/users');
    if(response.ok){
        const data = await response.json();
        //console.log("ulogiran:" + data.logged);
        if(data.logged){
            window.location.href = "/profilPage";
        }else{
            window.location.href = "/login";
        }
    }
});

document.getElementById('odjava').addEventListener('click', async function () {
    const response = await fetch('api/users');
    if(response.ok){
        const data = await response.json();
        //console.log("ulogiran:" + data.logged);
        if(data.logged){
            window.location.href = "/logout";
        }else{
            window.location.href = "/login";
        }
    }
});

document.getElementById('prijava').addEventListener('click', async function () {
    const response = await fetch('api/users');
    if(response.ok){
        const data = await response.json();
        //console.log("ulogiran:" + data.logged);
        if(data.logged){
            console.log("Already signed in!")
        }else{
            window.location.href = "/login";
        }
    }
});

document.getElementById('osvjezi').addEventListener('click', async () =>{
    try {
        const response = await fetch('/refresh', {
            method: 'PUT',
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
        } else {
            console.error('Greška prilikom osvježavanja preslika.');
            alert('Greška prilikom osvježavanja preslika.');
        }
    } catch (error) {
        console.error('Greška:', error);
        alert('Došlo je do greške.');
    }
});

