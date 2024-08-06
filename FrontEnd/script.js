const apiUrl ='http://localhost:5678/api'

async function getDataWorks() {
    const urlWorks = apiUrl + '/works';
    const response = await fetch(urlWorks);
    const projects = await response.json();
    return projects
}

function buildProjects(projects) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    projects.forEach((project) => {
        const projectElement = document.createElement('figure');
        const img = document.createElement('img');
        img.src = project.imageUrl;
        img.alt = project.title;
        const caption = document.createElement('figcaption');
        caption.textContent = project.title;
        projectElement.appendChild(img);
        projectElement.appendChild(caption);
        gallery.appendChild(projectElement);
    });
}


async function getDataCategories() {
    const urlCategories = apiUrl + '/categories';
    const response = await fetch(urlCategories);
    const categories = await response.json();
    return categories;
}

function createButton(category) {
    const button = document.createElement('button');
    button.classList.add("filtersButton")
    button.textContent = category.name;
    button.addEventListener('click', () => {
        filterProjectsByCategory(category.id);
    });
    return button;
}

function createAllButton() {
    const allButton = document.createElement('button');
    allButton.classList.add("filtersButton")
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', async () => {
        const allProjects = await getDataWorks();
        buildProjects(allProjects);
    });
    return allButton
}

function createFilterMenuDom() {
    const gallery = document.getElementById('gallery');
    const filterMenu = document.createElement('div');
    filterMenu.id = 'filterMenu';
    gallery.insertAdjacentElement('beforebegin', filterMenu);
    return filterMenu;
}

async function buildFilters(categories) {
    const filterMenu = createFilterMenuDom();
    const allButton = createAllButton();
    filterMenu.appendChild(allButton);
    if (isAuthenticated()) {
        if(filterMenu) filterMenu.style.display = 'none';
        return;
    }
    categories.forEach((category) => {
        const button = createButton(category);
        filterMenu.appendChild(button);
    });
    const buttons = document.querySelectorAll('.filtersButton');
    buttons.forEach(button => {             // Permet d'avoir le filtre actif d'une couleur différente
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    })

}
async function filterProjectsByCategory(categoryId) {
    gallery.innerHTML = '';
    const projects = await getDataWorks(); 
    const filteredProjects = projects.filter(project => project.categoryId === categoryId); 
    buildProjects(filteredProjects); 
}

function isAuthenticated() {
    return localStorage.getItem('userToken') !== null;
}

function updateAuthenticationLink() {
    const authLink = document.getElementById('authLink');
    authLink.innerHTML = '';
    const link = document.createElement('a');
    if (isAuthenticated()) {
        link.href = '#';
        link.textContent = 'logout';
        link.addEventListener('click', function(event) {
            logout();
            event.preventDefault();
        })   
    } else {
        link.href = 'login.html'
        link.textContent = 'login'
    }
    authLink.appendChild(link);
}

async function logout() {
    localStorage.removeItem('userToken');
    updateUIAuth();
    const categories = await getDataCategories();
    await buildFilters(categories);

}

function updateHeader() {
    const header = document.querySelector('header');
    let editBand = document.getElementById('editBand');
    if (isAuthenticated()) {
        editBand = document.createElement('div');
        editBand.id = 'editBand';
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-regular fa-pen-to-square';
        const editText = document.createElement ('p');
        editText.textContent = 'Mode édition';
        editBand.appendChild(editIcon);
        editBand.appendChild(editText);
        header.insertAdjacentElement("beforebegin", editBand);        
    } else {
        if (editBand) {
            editBand.parentNode.removeChild(editBand);
        }
}}

function addEditButton() {
    const projectsTitle = document.getElementById('projectsTitle');
    let editButton = document.getElementById('editButton');
    if (isAuthenticated()) {
            editButton = document.createElement('button');
            editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i><span>Modifier</span>';
            editButton.id = 'editButton';
            projectsTitle.insertAdjacentElement('beforeend', editButton);
    } else {
        if (editButton) { 
            editButton.parentNode.removeChild(editButton);
        }
    }
}

 async function updateUIAuth() {
    updateAuthenticationLink();
    updateHeader();
    addEditButton()
    
}



document.addEventListener("DOMContentLoaded", async (event) => {
    await updateUIAuth()
    const projectList = await getDataWorks();
    buildProjects(projectList);
    console.log(projectList);
    const categories = await getDataCategories();
    await buildFilters(categories);
});