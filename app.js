const form = document.querySelector('[data-form="vehicle-form"]')
const vehicleList = document.querySelector('[data-list="vehicle-list"]')
const nameInput = document.querySelector('[data-input="name"]')
const modelInput = document.querySelector('[data-input="model"]')
const garageInput = document.querySelector('[data-input="garage"]')

class Veiculo {
  constructor(nome, modelo, garagem) {
    this.nome = nome
    this.modelo = modelo
    this.garagem = garagem
  }
}

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

  adicionarVeiculoAoDOM(veiculo)

  form.reset()
})
