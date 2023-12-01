const api= axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=uft-8',
    },
    params: {
        'api_key': API_KEY,

    }

}) ;

//Utils
function createMovies(movies, container) {
    container.innerHTML="";

    movies.forEach(movie => {
        
        const movieContainer= document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', ()=>{
            location.hash='#movie=' + movie.id;
        })

        const movieImg= document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src', 
            
            'https://image.tmdb.org/t/p/w500' + movie.poster_path
        )
        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);

    });
}

function createCategories(categories, container) {
    container.innerHTML="";
    categories.forEach(category => {

        const div= document.createElement('div');
        div.classList.add('category-container');

        const h3= document.createElement('h3');
        const h3Text=document.createTextNode(category.name);
        h3.classList.add('category-title');
        h3.setAttribute('id', 'id'+category.id);
        h3.addEventListener('click',()=>{
            location.hash=`#category= ${category.id}-${category.name}`;
        })
        
        container.appendChild(div);
        div.appendChild(h3);
        h3.appendChild(h3Text);
    });
}

async function getTrendingMoviesPreview() {
    const {data}= await api ('trending/movie/day');
    
   const movies=data.results;
    console.log({data, movies});

    createMovies(movies, trendingMoviesPreviewList);

}

async function getCategoriesPreview() {
    const {data}= await api ('genre/movie/list');
    

   const categories=data.genres;
   createCategories(categories, categoriesPreviewList)
   
    console.log({data, categories});
    
    
}

//ASÍ QUEDA SIN AXIOS:

// async function getCategoriesPreview() {
//     const res= await fetch ('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
//     const data= await res.json();

//    const categories=data.genres;
//     console.log({data, categories});

//     categories.forEach(category => {

//         const categoriesPreviewListContainer= document.querySelector('.categoriesPreview-list');

//         const div= document.createElement('div');
//         div.classList.add('category-container');

//         const h3= document.createElement('h3');
//         const h3Text=document.createTextNode(category.name);
//         h3.classList.add('category-title');
//         h3.setAttribute('id', 'id'+category.id);
        
//         categoriesPreviewListContainer.appendChild(div);
//         div.appendChild(h3);
//         h3.appendChild(h3Text);
//     });
// }

async function getMoviesByCategory(id) {
    const {data}= await api ('discover/movie',{
        params:{
            with_genres:id,
        },
    });
    
   const movies=data.results;
   createMovies(movies, genericSection);
   
}

async function getMoviesBySearch(query) {
    const {data}= await api ('search/movie',{
        params:{
            query,
        },
    });
    
   const movies=data.results;
   createMovies(movies, genericSection);
   
}

async function getTrendingMovies() {
    const {data}= await api ('trending/movie/day');
    
   const movies=data.results;
    console.log({data, movies});

    createMovies(movies, genericSection);

}

async function getMovieById(id) {
    const {data: movie}= await api ('movie/' + id);
    const movieImgUrl= 'https://image.tmdb.org/t/p/w500'+movie.poster_path;
    headerSection.style.background=`
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieImgUrl})
    `;
    movieDetailTitle.textContent=movie.title;
    movieDetailDescription.textContent=movie.overview;
    movieDetailScore.textContent=movie.vote_average;    

    createCategories(movie.genres, movieDetailCategoriesList)
    getRelatedmoviesId(id);
}

async function getRelatedmoviesId(id) {
const {data} = await api(`movie/${id}/recommendations`);
const relatedMovies= data.results;

    createMovies(relatedMovies, relatedMoviesContainer)
}