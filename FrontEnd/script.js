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

  document.addEventListener("DOMContentLoaded", async (event) => {
    const projectList = await getDataWorks();
    buildProjects(projectList);
    await buildFilterMenu(); // Construire le menu de filtre après le chargement des projets
});

async function getDataCategories() {
    const urlCategories = apiUrl + '/categories';
    const response = await fetch(urlCategories);
    const categories = await response.json();
    return categories;
}

function createButton(category) {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.addEventListener('click', () => {
        filterProjectsByCategory(category.id);
    });
    return button;
}

async function buildFilterMenu() {
    const gallery = document.getElementById('gallery');
    const filterMenu = document.createElement('div');
    filterMenu.id = 'filter-menu';
    gallery.insertAdjacentElement('beforebegin', filterMenu);
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';
    allButton.addEventListener('click', async () => {
        const allProjects = await getDataWorks();
        buildProjects(allProjects);
    });
    filterMenu.appendChild(allButton);
    const categories = await getDataCategories();
    categories.forEach((category) => {
        const button = createButton(category);
        filterMenu.appendChild(button);
    });

}

async function filterProjectsByCategory(categoryId) {
    gallery.innerHTML = '';
    const projects = await getDataWorks(); // Récupérer tous les projets
    const filteredProjects = projects.filter(project => project.categoryId === categoryId); // Filtrer les projets par catégorie
    buildProjects(filteredProjects); // Reconstruire l'affichage avec les projets filtrés
}