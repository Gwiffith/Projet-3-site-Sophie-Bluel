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

function closeModal(event = null) {
    if (event) {
        event.preventDefault();
    }
    resetModalContent();
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
    const modalSubmit = document.getElementById('myModal').querySelector('.modal-footer');
    modalTitle.innerHTML = '';
    addTitle();
    modalMain.innerHTML = '';
    modalMain.classList.remove('modal-main-updated');
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
        imgContainer.classList.add('editableGallery')
        const imgElement = document.createElement('img');
        const deleteButton = document.createElement('button');
        deleteButton.id = 'deleteButton';
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
            // Trouver l'index de l'image dans le tableau imageGallery
            const index = imageGallery.findIndex(project => project.id === imageId);
            
            // Si l'image est trouvée, la supprimer du tableau
            if (index !== -1) {
                imageGallery.splice(index, 1);
            }
            buildProjects(imageGallery);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la suppression de l\'image:', error)
    })
}

function addModalButton() {
    const modalSubmit = document.getElementById('myModal').querySelector('.modal-footer');
    let modalButtonAdd = modalSubmit.querySelector('button');
    if (!modalButtonAdd) {  // Vérifier si le bouton existe avant de le créer
        modalButtonAdd = document.createElement('button');
        modalButtonAdd.textContent = 'Ajouter une photo';
        modalButtonAdd.classList.add('buttonModal')
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
    uploadForm.classList.add('modalUploadForm');

    // Créer le wrapper principal
    const fileInputWrapper = document.createElement('div');
    fileInputWrapper.className = 'custom-file-upload-wrapper';

    // Ajouter l'image 
    const placeholderImage = document.createElement('img');
    placeholderImage.src = './assets/images/img-placeholder.svg';
    placeholderImage.alt = 'Emplacement de votre photo'
    placeholderImage.className = 'placeholder-image';

    // Créer le label qui agit comme un bouton
    const fileLabel = document.createElement('label');
    fileLabel.setAttribute('for', 'fileInput');
    fileLabel.className = 'custom-file-upload';
    fileLabel.textContent = '+ Ajouter photo';

    // Créer l'input de fichier caché
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'image';
    fileInput.accept = 'image/*';
    fileInput.id = 'fileInput';
    fileInput.style.display = 'none'; // Masquer l'input
    fileInput.required = true;

    // Créer le texte d'information
    const fileInfo = document.createElement('span');
    fileInfo.className = 'file-info';
    fileInfo.textContent = 'jpg, png : 4mo max';

    // Assembler les éléments
    fileInputWrapper.appendChild(placeholderImage); // Ajouter l'image en haut
    fileInputWrapper.appendChild(fileLabel); // Ajouter le label (bouton)
    fileInputWrapper.appendChild(fileInput); // Ajouter l'input de fichier
    fileInputWrapper.appendChild(fileInfo);  // Ajouter le texte d'information
    
    // Ajouter la prévisualisation d'image
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                placeholderImage.src = e.target.result; // Met à jour l'image avec l'aperçu
                fileLabel.classList.add('removed');
                fileInfo.classList.add('removed');
                placeholderImage.classList.add('preview-image');
                fileInputWrapper.classList.add('wrapper-no-padding')
            }
            reader.readAsDataURL(this.files[0]);
        }
    })

    // Groupe pour le titre
    const titleGroup = document.createElement('div');
    const titleLabel = document.createElement('label');
    titleGroup.classList.add('inputGroups');
    titleLabel.setAttribute('for', 'imageTitle');
    titleLabel.textContent = 'Titre';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.id = 'imageTitle';
    titleInput.classList.add('inputFields');
    titleInput.required = true;
    titleGroup.appendChild(titleLabel);
    titleGroup.appendChild(titleInput);
    
    // Groupe pour la catégorie
    const categoryGroup = document.createElement('div');
    const categoryLabel = document.createElement('label');
    categoryGroup.classList.add('inputGroups');
    categoryLabel.setAttribute('for', 'categories');
    categoryLabel.textContent = 'Catégorie';
    const categorySelect = document.createElement('select');
    categorySelect.name = 'category';
    categorySelect.id = 'categories';
    categorySelect.classList.add('inputFields');
    categorySelect.required = true;

// Ajout d'une option vide par défaut
const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = '';
categorySelect.appendChild(defaultOption);

    try {
        const categories = await getDataCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
    categoryGroup.appendChild(categoryLabel);
    categoryGroup.appendChild(categorySelect);

    // Groupe pour le bouton d'envoi
    const buttonGroup = document.createElement('div');
    const uploadButton = document.createElement('button');
    uploadButton.type = 'submit';
    uploadButton.textContent = 'Valider';
    uploadButton.classList.add('buttonModal');
    uploadButton.disabled = true; // Le bouton est désactivé par défaut
    buttonGroup.appendChild(uploadButton);

    function validateForm() {
        const isValid = fileInput.files.length > 0 && titleInput.value.trim() !== '' && categorySelect.value !== '';
        uploadButton.disabled = !isValid; // Activer/désactiver le bouton en fonction de la validation
    }

    // Ajout d'événements pour valider le formulaire en temps réel
    fileInput.addEventListener('change', validateForm);
    titleInput.addEventListener('input', validateForm);
    categorySelect.addEventListener('change', validateForm);

    // Ajout de tous les groupes au formulaire
    
    uploadForm.appendChild(fileInputWrapper);
    uploadForm.appendChild(titleGroup);
    uploadForm.appendChild(categoryGroup);
    uploadForm.appendChild(buttonGroup);

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        uploadImage(uploadForm);
    });

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
            imageGallery.push(result);
            buildProjects(imageGallery);
            closeModal();
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
    const modalSubmit = modalContent.querySelector('.modal-footer');

    const backButton = document.getElementById('backButton');
    backButton.classList.remove('hidden');

    modalTitle.textContent = 'Ajout Photo'

    modalMain.innerHTML = '';
    modalMain.classList.add('modal-main-updated');
    const uploadForm = await createUploadForm();
    modalMain.appendChild(uploadForm);

    modalSubmit.innerHTML ='';
}


document.addEventListener('DOMContentLoaded', function() {
    const modalBackground = document.getElementById('myModal');

    // Écoute pour les clics sur l'arrière-plan de la modale
    modalBackground.addEventListener('click', function(event) {
        // Vérifie si le clic est directement sur le fond (modal) et pas sur modal-content
        if (event.target === modalBackground) {
            closeModal();
        }
    })

    const editButton = document.getElementById('editButton');
    editButton.addEventListener('click', function(event) {
        openModal(event);
        addGallery(imageGallery);
        addModalButton();
    })
})
