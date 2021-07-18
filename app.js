'use strict'

const GALLERY_URL = 'https://jsonplaceholder.typicode.com/photos?_limit=500';
const GALLERY_ITEM_CLASS = 'gallery-item';
const PAGINATION_ITEM_CLASS = 'pagination-item';
const PAGINATION_ACTIVE_CLASS = 'active';
const FULL_IMAGE_BACKGROUND_CLASS = 'full-image-backgroud';
const FULL_IMAGE_VISIBLE_CLASS = 'full-image-visible';
const ITEMS_PER_PAGE = 50;

const container = document.getElementById('gallery');
const pagination = document.getElementById('pagination');
const fullImage = document.getElementById('fullImage');
const gallery = document.getElementById('gallery');
const galleryItemTemplate = document.getElementById('galleryItemTemplate').innerHTML;
const paginationItemTemplate = document.getElementById('paginationItemTemplate').innerHTML;

let photosList = [];
let currentPage = 0;
let totalPages = 0;

container.addEventListener('click', onContainerClick);
pagination.addEventListener('click', onPaginationClick);

init();

function onContainerClick(e){
    switch (true){
        case e.target.classList.contains(GALLERY_ITEM_CLASS):
            showFullImage(e.target.dataset.fullImageUrl);
            break;
        case e.target.classList.contains(FULL_IMAGE_BACKGROUND_CLASS):
            hideFullImage();
            break;
    }
}

function onPaginationClick(e){
    switch (true){
        case e.target.classList.contains(PAGINATION_ITEM_CLASS):
            onPageClick(e.target.dataset.pageIndex);
            break;

    }
}

function onPageClick(index){
    let page = index;

    switch(page){
        case 'prev': page = currentPage - 1; break 
        case 'next': page = currentPage + 1; break 
    }

    if (page >= totalPages) page=0;
    if (page < 0) page=totalPages - 1;

    console.log('page', page)
    showPage(page);
}

function init(){
    fetch(GALLERY_URL)
    .then((resp) => resp.json())
    .then(setPhotosList)
    .then(setPaginationData)
    .then(() => showPage(currentPage))
}

function setPhotosList(data){
    photosList = data;
}

function setPaginationData(){
    totalPages = Math.ceil(photosList.length / ITEMS_PER_PAGE);
    currentPage = localStorage.getItem('currentPage') || 0;

    if (currentPage > totalPages){
        currentPage = 0;
    }

    renderPagination(totalPages);
}

function renderPagination(totalPages){
    let pagesHtml = [
        paginationItemTemplate.replace('{{index}}', 'prev')
                            .replace('{{title}}', '<<<')
    ];

    for (let i=0; i<totalPages; i++){
        pagesHtml.push(paginationItemTemplate.replace('{{index}}', i)
                            .replace('{{title}}', i+1))
    }

    pagesHtml.push(paginationItemTemplate.replace('{{index}}', 'next')
        .replace('{{title}}', '>>>'))

    pagination.innerHTML = pagesHtml.join('\n');
}


function showPage(page){
    currentPage = page;
    localStorage.setItem('currentPage', page);

    togglePaginationActiveClass(page)
    renderGaleryItems(getImages(page));
}

function togglePaginationActiveClass(page){
    const activePage = pagination.querySelector(`.${PAGINATION_ACTIVE_CLASS}`);

    activePage && activePage.classList.remove(PAGINATION_ACTIVE_CLASS);
    pagination.querySelector(`[data-page-index="${page}"]`).classList.add(PAGINATION_ACTIVE_CLASS);

}

function getImages(page){
    return photosList.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
}

function renderGaleryItems(list){
    console.log(list);
    const imagesHtml = list.map(elem => {
        return galleryItemTemplate.replace('{{url}}', elem.thumbnailUrl)
                                    .replace('{{title}}', elem.title)
                                    .replace('{{fullImageUrl}}', elem.url);
    });
    gallery.innerHTML = imagesHtml.join('\n');

}

function showFullImage(url){
    fullImage.src = url;
    document.body.classList.add(FULL_IMAGE_VISIBLE_CLASS);
}

function hideFullImage(){
    document.body.classList.remove(FULL_IMAGE_VISIBLE_CLASS);
}