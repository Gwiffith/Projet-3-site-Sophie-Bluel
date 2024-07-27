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
    await buildFilterMenu();
});

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

async function buildFilterMenu() {
    const gallery = document.getElementById('gallery');
    const filterMenu = document.createElement('div');
    filterMenu.id = 'filterMenu';
    gallery.insertAdjacentElement('beforebegin', filterMenu);
    const allButton = document.createElement('button');
    allButton.classList.add("filtersButton")
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