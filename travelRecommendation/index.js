const searchButton = document.querySelector('.header__search-button_search')
const clearButton = document.querySelector('.header__search-button_clear')
const searchInput = document.querySelector('.header__search-input')
const sectionCountry = document.querySelector('.section__country')

clearButton.addEventListener('click', (event) => {
  event.preventDefault()
  
  clearResultsContainer()

  const searchValue = isSearchHasValue()

  if(searchValue) {
    searchInput.value = ''
  }
})

searchButton.addEventListener('click', (event) => {
  event.preventDefault()

  clearResultsContainer()

  const searchValue = isSearchHasValue()
  
  if(searchValue) {
    getRecommendations(searchValue)
  } else {
    generateErrorToDOM('Search query is empty.', sectionCountry)
  }

})

function isSearchHasValue() {
  return searchInput.value || null
}

async function getRecommendations(searchValue) {
  try {
    await fetch('./travel_recommendation_api.json').then(res => res.json()).then(data => generateResult(data, searchValue))
  } catch(error) {
    return error
  }
}

function generateResult(data, value) {
  let selectedCategory;
  let searchValue = value.toLowerCase()

  switch(searchValue) {
    case 'beach': 
      searchValue = 'beaches'
      break;
    case 'temple': 
      searchValue = 'temples'
      break;
    case 'country': 
      searchValue = 'countries'
      break;
    default:
      break;
  }

  if(searchValue === 'beaches' || searchValue === 'temples') {
    selectedCategory = data[searchValue]
    generateKeywordsResultToDOM(selectedCategory)
  } else if(searchValue === 'countries') {
    generateMatchResultToDOM(data, searchValue)
  } else {
    generateErrorToDOM('Please enter a valid search query', sectionCountry)
  }
}

function generateKeywordsResultToDOM(data) {
  const countriesWrapper = document.createElement('div')
  countriesWrapper.setAttribute('class', 'section__country-wrapper')
  
  sectionCountry.appendChild(countriesWrapper)

  data.forEach(element => {
    console.log(element)
    countriesWrapper.innerHTML = countriesWrapper.innerHTML + 
    countryItemContainer(element)
  });
}

function generateMatchResultToDOM(data, value) {
  const countriesWrapper = document.createElement('div')
  countriesWrapper.setAttribute('class', 'section__country-wrapper')

  sectionCountry.appendChild(countriesWrapper)

  let cities = Object.values(data.countries).map(item => item.cities)
  cities.forEach(item => {
    item.forEach(element => {
      countriesWrapper.innerHTML = countriesWrapper.innerHTML + 
        countryItemContainer(element)
    })
  })
}

function countryItemContainer(element) {
  return `
    <div class="section__country-item">
      <img src='./assets/images/${element.imageUrl}' />
      <div class="section__country-item-text">
        <h4>${element.name}</h4>
        <p>${element.description}</p>
        <a href="#">Visit</a>
      </div>
    </div>
  `
}

function generateErrorToDOM(error, element) {
  const div = document.createElement('div');
  const p = document.createElement('p')
  const isError = document.querySelector('.section__country-error')

  if(isError) {
    isError.remove()
  }
  
  div.appendChild(p)
  div.setAttribute('class', 'section__country-error')

  p.textContent = error
  element.appendChild(div)
}

function clearResultsContainer() {
  while(sectionCountry.firstChild) {
    sectionCountry.removeChild(sectionCountry.lastChild)
  }
}