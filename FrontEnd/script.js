const apiUrl ='http://localhost:5678/api'

async function getData() {
    const url = apiUrl + '/works';
    const response = await fetch(url);
    const projects = await response.json();
    buildProjects(projects);
}

function buildProjects(projects) {
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

getData ()