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
  vehicleDiv.innerHTML = `<h3>${veiculo.nome}</h3><p>${veiculo.modelo}</p><p>Guardado em: ${veiculo.garagem}</p>`
  vehicleList.appendChild(vehicleDiv)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const nome = nameInput.value
  const modelo = modelInput.value
  const garagem = garageInput.value

  const veiculo = new Veiculo(nome, modelo, garagem)

  veiculos.push(veiculo)
  console.log('Carro adicionado:', veiculo);
  console.log('Lista de carros atualizada:', veiculos)

  adicionarVeiculoAoDOM(veiculo)
  form.reset()
})

showVehiclesButton.addEventListener('click', () => {
  vehicleList.classList.toggle('hidden')
  showVehiclesButton.textContent = vehicleList.classList.contains('hidden') ? 'Mostrar Veículos' : 'Ocultar Veículos'
})

const buscarVeiculos = () => {
  const termo = searchInput.value.toLowerCase()
  console.log('termo busca: ', termo)

  const resultados = veiculos.filter(veiculo => {
    const nomeVeiculo = veiculo.nome.toLowerCase().includes(termo)
    const nomeGaragem = veiculo.garagem.toLowerCase().includes(termo)

    console.log('Nome:', veiculo.nome.toLowerCase(), 'Garagem:', veiculo.garagem.toLowerCase(), 'Inclui termo:', nomeVeiculo || nomeGaragem);
        return nomeVeiculo || nomeGaragem;
  })

  console.log('Resultados da busca:', resultados);
  console.log('Quantidade de resultados:', resultados.length);

  searchResults.innerHTML = ''
  searchResults.style.display = 'block'

  if(resultados.length > 0) {
    resultados.forEach(veiculo => {
      const vehicleDiv = document.createElement('div')
      vehicleDiv.className = 'vehicle'
      vehicleDiv.innerHTML = `<h3>${veiculo.nome}</h3><p>Modelo: ${veiculo.modelo}</p><p>Garagem: ${veiculo.garagem}</p>`
      console.log(veiculo.nome)
      searchResults.appendChild(vehicleDiv)
    })
  } else {
    searchResults.innerHTML = '<p>Nenhum veículo ou garagem encontrado</p>'
  }
}

searchButton.addEventListener('click', buscarVeiculos)
