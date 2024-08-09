function openModal(event) {
    event.preventDefault();
    addBackButton();
    addCloseButton();
    addTitle();
    const modal = document.getElementById('myModal');
    modal.style.display = null ; 
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    const closeButton = document.getElementById('closeButton');
    closeButton.style.display = 'flex';
}

function closeModal(event) {
    event.preventDefault();
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');
}

function addCloseButton() {
    const modalNav = document.getElementById('myModal').querySelector('.modal-nav');
    let closeButton = document.getElementById('closeButton');
    if (!closeButton) {  // Vérifier si le bouton existe avant de le créer
        closeButton = document.createElement('button');
        closeButton.id = 'closeButton';
        closeButton.classList.add('nav-button-style');
        const closeIcon = document.createElement('i');
        closeIcon.className = "fa-solid fa-xmark";
        closeButton.appendChild(closeIcon);
        closeButton.style.display = 'none'; 
        closeButton.addEventListener('click', closeModal); 
        modalNav.appendChild(closeButton); 
    }
}

function addBackButton() {
    const modalNav = document.getElementById('myModal').querySelector('.modal-nav');
    let backButton = document.getElementById('backButton');
    if (!backButton) {  // Vérifier si le bouton existe avant de le créer
        backButton = document.createElement('button');
        backButton.id = 'backButton';
        backButton.classList.add('nav-button-style');
        const backIcon = document.createElement('i');
        backIcon.className = "fa-solid fa-arrow-left";
        backButton.classList.add('hidden');
        backButton.appendChild(backIcon);
        modalNav.appendChild(backButton);
    }
}

function addTitle() {
    const modalTitle = document.getElementById('myModal').querySelector('.modal-title');
    let titleContent = document.getElementById('titleContent');
    if (!titleContent) {  // Vérifier si le titre existe avant de le créer
        titleContent = document.createElement('h3');
        titleContent.id = 'titleContent';
        titleContent.innerText = 'Galerie photo';
        modalTitle.appendChild(titleContent);
    }
}

function addGallery(images) {
    const modalMain = document.getElementById('myModal').querySelector('.modal-main');
    modalMain.innerHTML = '';
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        modalMain.appendChild(imgElement);
    });
}

function addModalButton() {
    const modalSubmit = document.getElementById('myModal').querySelector('.modal-submit');
    let modalButtonAdd = modalSubmit.querySelector('button');
    if (!modalButtonAdd) {  // Vérifier si le bouton existe avant de le créer
        modalButtonAdd = document.createElement('button');
        modalButtonAdd.textContent = 'Ajouter une photo';
        modalButtonAdd.classList.add('buttonAdd')
        modalSubmit.appendChild(modalButtonAdd);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', function(event) {
        openModal(event);
        addGallery(imageGallery);
        addModalButton();
    });
});
