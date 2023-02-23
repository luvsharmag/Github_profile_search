'use strict'

const Apiurl = 'https://api.github.com/users/';

const cardContainer = document.querySelector('.card');
const Search = document.querySelector('#search');

const createErrorCard = function(mess){
    const html = `
            <h1>${mess}</h1>
    `
    cardContainer.innerHTML = html;
}

const renderuser = function(data){

    cardContainer.innerHTML = '';
    const html = `
    <div>
    <img src="${data.avatar_url}" alt="" width="100" height="100" class="avatar">                
    </div>
    <div class="user-info">
        <h2>${data.name}</h2>
        <p>${data.bio}</p>

        <ul>
            <li>${data.followers}<strong>Followers</strong></li>
            <li>${data.following}<strong>Following</strong></li>
            <li>${data.public_repos}<strong>Repos</strong></li>                
        </ul>
        
        <div id="repos">            
        </div>
    </div>
    `;
    cardContainer.insertAdjacentHTML('afterbegin',html);
};

function addrepostocard(repos){
    const reposEl = document.getElementById('repos');
    repos.slice(0,10).forEach(repo=>
        {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');
            repoEl.href = repo.html_url;
            repoEl.target = '_blank';
            repoEl.innerText =  repo.name;

            reposEl.appendChild(repoEl);
        })
}
const getRepos = async function(username){
    try{
        const {data} = await axios(Apiurl+username+'/repos?sort=created');
        console.log(data);
        addrepostocard(data);
    }catch(err){
        console.error(err);
    }
}
function getUser(name){
    axios.get(Apiurl + name)
    .then((res)=>{        
        console.log(res);
        renderuser(res.data);
        getRepos(name);
    }).catch((err)=>{
        if(err.response.status == 404){
            createErrorCard('No profile with this username');
        }
        
        console.error(err);
    })
}


document.addEventListener('keydown',(e)=>{
    if(e.key === "Enter" && Search.value != ''){
        e.preventDefault();
        getUser(Search.value);
        Search.value = '';
        console.log(Search.value);
    }
})