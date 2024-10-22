const form = document.querySelector('[data-form="vehicle-form"]')
const vehicleList = document.querySelector('[data-list="vehicle-list"]')
const nameInput = document.querySelector('[data-input="name"]')
const modelInput = document.querySelector('[data-input="model"]')
const garageInput = document.querySelector('[data-input="garage"]')
const showVehiclesButton = document.querySelector('[data-button="show-vehicle-button"]')
const searchInput = document.querySelector('[data-input="search-input"]')
const searchButton = document.querySelector('[data-button="search-button"]')
const searchResults = document.querySelector('[data-list="vehicle-search-list"]')

class Veiculo {
  constructor(nome, modelo, garagem) {
    this.nome = nome
    this.modelo = modelo
    this.garagem = garagem
  }
}

let veiculos = []

const adicionarVeiculoAoDOM = (veiculo) => {
  const vehicleDiv = document.createElement('div')
  vehicleDiv.className ='vehicle'
  vehicleDiv.innerHTML = `
    <h3>${veiculo.nome}</h3>
    <p>${veiculo.modelo}</p>
    <p>Guardado em: ${veiculo.garagem}</p>
  `
  vehicleList.appendChild(vehicleDiv)
}

const handleFormSubmit = (e) => {
  e.preventDefault()
  const nome = nameInput.value
  const modelo = modelInput.value
  const garagem = garageInput.value
  const veiculo = new Veiculo(nome, modelo, garagem)
  veiculos.push(veiculo)
  adicionarVeiculoAoDOM(veiculo)
  form.reset()
}

const toggleVehicleList = () => {
  vehicleList.classList.toggle('hidden')
  showVehiclesButton.textContent = vehicleList.classList.contains('hidden') ? 'Mostrar Veículos' : 'Ocultar Veículos'
}

const buscarVeiculos = () => {
  const termo = searchInput.value.toLowerCase()
  const resultados = veiculos.filter(veiculo => {
    const nomeVeiculo = veiculo.nome.toLowerCase().includes(termo)
    const nomeGaragem = veiculo.garagem.toLowerCase().includes(termo)
    return nomeVeiculo || nomeGaragem;
  })

  searchResults.innerHTML = ''
  searchResults.style.display = 'block'

  if(resultados.length > 0) {
    resultados.forEach(veiculo => {
      const vehicleDiv = document.createElement('div')
      vehicleDiv.className = 'vehicle'
      vehicleDiv.innerHTML = `
        <h3>${veiculo.nome}</h3>
        <p>Modelo: ${veiculo.modelo}</p>
        <p>Garagem: ${veiculo.garagem}</p>
      `
      searchResults.appendChild(vehicleDiv)
    })
  } else {
    searchResults.innerHTML = '<p>Nenhum veículo ou garagem encontrado</p>'
  }
}

form.addEventListener('submit', handleFormSubmit)
showVehiclesButton.addEventListener('click', toggleVehicleList)
searchButton.addEventListener('click', buscarVeiculos)