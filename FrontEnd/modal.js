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
        backButton.addEventListener('click', resetModalContent);
        modalNav.appendChild(backButton);
    }
}

function resetModalContent() {
    const modalTitle = document.getElementById('myModal').querySelector('.modal-title');
    const modalMain = document.getElementById('myModal').querySelector('.modal-main');
    const modalSubmit = document.getElementById('myModal').querySelector('.modal-submit');

    modalTitle.textContent = 'Galerie photo';
    modalMain.innerHTML = '';
    addGallery(imageGallery);  
    modalSubmit.innerHTML = '';
    addModalButton();

    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.classList.add('hidden');
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
        const imgContainer = document.createElement('div'); // Conteneur pour l'image et le bouton
        const imgElement = document.createElement('img');
        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('i');
        deleteIcon.className = "fa-solid fa-trash-can";
        deleteButton.addEventListener('click', () => deleteImage(image.id, imgContainer));
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        deleteButton.appendChild(deleteIcon);
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(deleteButton)
        modalMain.appendChild(imgContainer);
    });
}

async function deleteImage(imageId, imgContainer) {
    const token = localStorage.getItem('userToken');
     await fetch(apiUrl + '/works/' + imageId, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            imgContainer.remove();
        }
    })
    .catch(error => {
        console.error('Erreur lors de la suppression de l\'image:', error)
    })
}

function addModalButton() {
    const modalSubmit = document.getElementById('myModal').querySelector('.modal-submit');
    let modalButtonAdd = modalSubmit.querySelector('button');
    if (!modalButtonAdd) {  // Vérifier si le bouton existe avant de le créer
        modalButtonAdd = document.createElement('button');
        modalButtonAdd.textContent = 'Ajouter une photo';
        modalButtonAdd.classList.add('buttonAdd')
        modalButtonAdd.id = 'buttonAdd';
        modalSubmit.appendChild(modalButtonAdd);
        modalButtonAdd.addEventListener('click', function() {
            updateModalContent()
        })
    }
}

async function createUploadForm() {
    const uploadForm = document.createElement('form');
    uploadForm.setAttribute('enctype', 'multipart/form-data');

    const fileInput=document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'image';
    fileInput.accept = 'image/*'; // Accepter uniquement les fichiers image

    const uploadButton = document.createElement('button');
    uploadButton.type = 'submit';
    uploadButton.textContent = 'Envoyer';

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'imageTitle');
    titleLabel.textContent = 'Titre';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.id = 'imageTitle';
    titleInput.required = true;

    const categorySelect = document.createElement('select');
    categorySelect.name = 'category';
    categorySelect.required = true;
    try {
        const categories = await getDataCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        })
    } catch (error) {
        console.error('Failed to load categories:', error);
    }

    uploadForm.appendChild(fileInput);
    uploadForm.appendChild(titleInput);
    uploadForm.appendChild(categorySelect);
    uploadForm.appendChild(uploadButton);

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        uploadImage(uploadForm)
    })
    return uploadForm;
}

async function uploadImage(form) {
    const formData = new FormData(form);
    const urlWorks = apiUrl + '/works';
    const token = localStorage.getItem('userToken');

    try {
        const response = await fetch(urlWorks, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        if (response.ok) {
            const result = await response.json();
            console.log('Upload Success:', result);
            alert('Image uploadée avec succès!');
        } else {
            throw new Error('Failed to upload image');
        }
    } catch (error) {
        console.error('Upload Error:', error);
        alert('Erreur lors de l’envoi de l’image.');
    }
}

async function updateModalContent() {
    const myModal = document.getElementById('myModal');
    const modalContent = myModal.querySelector('.modal-content');
    const modalNav = modalContent.querySelector('modal-nav');
    const modalTitle = modalContent.querySelector('.modal-title');
    const modalMain = modalContent.querySelector('.modal-main');
    const modalSubmit = modalContent.querySelector('.modal-submit');

    const backButton = document.getElementById('backButton');
    backButton.classList.remove('hidden');

    modalTitle.textContent = 'Ajout Photo'

    modalMain.innerHTML = '';
    const uploadForm = await createUploadForm();
    modalMain.appendChild(uploadForm);

    modalSubmit.innerHTML ='';
}


document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', function(event) {
        openModal(event);
        addGallery(imageGallery);
        addModalButton();
    });
});
