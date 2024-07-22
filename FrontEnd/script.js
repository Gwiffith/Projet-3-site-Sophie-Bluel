const apiUrl ='http://localhost:5678/api'

async function getDataWorks() {
    const url = apiUrl + '/works';
    const response = await fetch(url);
    const projects = await response.json();
    return projects
}

function buildProjects(projects) {
    console.log(projects)
    const gallery = document.getElementById('gallery');
    gallery.innerHtml = '';
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
    const projectList = await getDataWorks()
    buildProjects(projectList)
  });

  async function getDataCategories() {
    const url = apiUrl + '/categories';
    const response = await fetch(url);
    const categories = await response.json();
    return categories;
}
  getDataCategories()