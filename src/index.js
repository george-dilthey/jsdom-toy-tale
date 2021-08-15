let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
});

document.querySelector('form.add-toy-form').addEventListener('submit', (e) => {
  e.preventDefault()
  let name = document.querySelector('input[name*="name"]').value
  let image = document.querySelector('input[name*="image"]').value
  postData(name, image)
})


function getToys(){
  fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(json => {
    for(const toy of json){
      renderToy(toy)
    }
  })
}

function renderToy(toy){
  let div = document.createElement('div')
  div.className = "card"
  
  let h2 = document.createElement('h2')
  h2.innerText = toy.name

  let img = document.createElement('img')
  img.className = "toy-avatar"
  img.src = toy.image

  let p = document.createElement('p')
  p.innerText = toy.likes
  p.setAttribute("toy-id", toy.id)

  let button = document.createElement('button')
  button.className = "like-btn"
  button.innerText = "Like"
  button.setAttribute("toy-id", toy.id)
  button.addEventListener("click", (e) => likeToy(e))
  
  div.append(h2, img, p, button)
  document.getElementById('toy-collection').append(div)
  
}

function postData(name, image){
  const formData = {
    name: name,
    image: image,
    likes: 0
  };

  const configObj = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  return fetch("http://localhost:3000/toys", configObj)
    .then(function(response) {
    return response.json();
    })
    .then(object => renderToy(object))
    .catch(error => {
        console.log(error)
      });
}

function likeToy(e){
  const toyId = e.target.getAttribute('toy-id')
  const currentLikesElement = document.querySelector("p[toy-id=" + CSS.escape(toyId) + "]")
  let currentLikes = currentLikesElement.innerText*1
  currentLikes += 1
  currentLikesElement.innerText = currentLikes
  const formData = {    
    likes: currentLikes
  };

  const configObj = {
    method: "PATCH",
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  return fetch(`http://localhost:3000/toys/${toyId}`, configObj)
    .then(function(response) {
    return response.json();
    })
    .then(object => renderToy(object))
    .catch(error => {
        console.log(error)
      });
}

