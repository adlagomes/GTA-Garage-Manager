import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const loginForm = document.querySelector('#login-form')
const registerForm = document.querySelector('#register-form')
const loginContainer = document.querySelector('#login-container')
const registerContainer = document.querySelector('#register-container')
const showRegister = document.querySelector('#show-register')
const showLogin = document.querySelector('#show-login')
const loginEmail = document.querySelector('#login-email')
const loginPassword = document.querySelector('#login-password')
const registerEmail = document.querySelector('#register-email')
const registerPassword = document.querySelector('#register-password')
const form = document.querySelector('[data-form="vehicle-form"]')
const vehicleList = document.querySelector('[data-list="vehicle-list"]')
const nameInput = document.querySelector('[data-input="name"]')
const modelInput = document.querySelector('[data-input="model"]')
const garageInput = document.querySelector('[data-input="garage"]')
const showVehiclesButton = document.querySelector('[data-button="show-vehicle-button"]')
const searchInput = document.querySelector('[data-input="search-input"]')
const searchButton = document.querySelector('[data-button="search-button"]')
const searchResults = document.querySelector('[data-list="vehicle-search-list"]')
const logoutButton = document.querySelector('#logout-button');

// Mostra e oculta formulários de login e registro
showRegister.addEventListener('click', (e) => {
  e.preventDefault()
  loginContainer.classList.add('hidden')
  registerContainer.classList.remove('hidden')
})

showLogin.addEventListener('click', (e) => {
  e.preventDefault()
  registerContainer.classList.add('hidden')
  loginContainer.classList.remove('hidden')
})

// Login de usuário
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = loginEmail.value
  const password = loginPassword.value
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('Usuário logado:', userCredential)
    loginContainer.classList.add('hidden')
    form.classList.remove('hidden')
    showVehiclesButton.classList.remove('hidden')
    logoutButton.classList.remove('hidden');
  }catch(error) {
    console.error('Erro ao fazer login:', error)
    alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.')
  }
})

// Logout de usuário
logoutButton.addEventListener('click', async (e) => {
  try {
    await signOut(auth);
    form.classList.add('hidden')
    showVehiclesButton.classList.add('hidden')
    loginContainer.classList.remove('hidden')
    logoutButton.classList.add('hidden'); // Ocultar botão de logout
  } catch (error) {
    console.error('Erro ao deslogar:', error);
  }
  loginForm.reset()
  // registerForm.reset()
})

// Registro de usuário
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = registerEmail.value
  const password = registerPassword.value
  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log('Usuario registrado', userCredential.user);
    registerContainer.classList.add('hidden')
    form.classList.remove('hidden')
    showVehiclesButton.classList.remove('hidden')
    logoutButton.classList.remove('hidden')
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro ao registrar. Verifique suas informações e tente novamente.')
  }
})

class Veiculo {
  constructor(nome, modelo, garagem) {
    this.nome = nome
    this.modelo = modelo
    this.garagem = garagem
  }
}

// Adiciona veiculos ao DOM e Firestore
const adicionarVeiculoAoDOM = (veiculo) => {
  let garageDiv = document.querySelector(`#garagem-${veiculo.garagem.replace(/\s+/g, '')}`)

  if (!garageDiv) {
    garageDiv = document.createElement('div')
    garageDiv.className = 'garagem'
    garageDiv.id = `garagem-${veiculo.garagem.replace(/\s+/g, '')}`
    garageDiv.innerHTML = `<h3>${veiculo.garagem}</h3>`
    vehicleList.appendChild(garageDiv)
  }
  const vehicleDiv = document.createElement('div')
  vehicleDiv.className ='vehicle'
  vehicleDiv.innerHTML = `
    <p>${veiculo.nome}</p>
    <p>Modelo: ${veiculo.modelo}</p>
  `
  garageDiv.appendChild(vehicleDiv)
}

// Lida com envio de formulário
const handleFormSubmit = async (e) => {
  e.preventDefault()
  const nome = nameInput.value
  const modelo = modelInput.value
  const garagem = garageInput.value
  const veiculo = new Veiculo(nome, modelo, garagem)

  try {
    const garagemRef = collection(db, 'garagens', garagem, 'veiculos')
    const docRef = await addDoc(garagemRef, {
      nome: nome,
      modelo: modelo,
      garagem: garagem,
      userId: auth.currentUser.uid
    })
    console.log('veiculo adicionado com ID:', docRef.id)
    adicionarVeiculoAoDOM(veiculo)
  } catch (error) {
    console.error('Erro ao adicionar o veiculo:', error);
  }
form.reset()
}

// Alterna a exibição da lista de veículos
const toggleVehicleList = () => {
  vehicleList.classList.toggle('hidden')
  showVehiclesButton.textContent = vehicleList.classList.contains('hidden') ? 'Mostrar Veículos' : 'Ocultar Veículos'
}

// Busca veículos pelo termo fornecido
const buscarVeiculos = async () => {
  const termo = searchInput.value.toLowerCase()
  searchResults.innerHTML = ''
  searchResults.style.display = 'block'

  try {
    const garagensSnapshot = await db.collection('garagens').get();
    const resultados = [];

    for (const doc of garagensSnapshot.docs) {
      const garagem = doc.id;
      const veiculosSnapshot = await db.collection('garagens').doc(garagem).collection('veiculos').get();

      for (const subDoc of veiculosSnapshot.docs) {
        const veiculo = subDoc.data();
        if (veiculo.nome.toLowerCase().includes(termo) || veiculo.garagem.toLowerCase().includes(termo)) {
          resultados.push(veiculo);
        }
      }
    }
    if(resultados.length > 0) {
      resultados.forEach(veiculo => {
        const vehicleDiv = document.createElement('div');
        vehicleDiv.className = 'vehicle';
        vehicleDiv.innerHTML = `          <h3>${veiculo.nome}</h3>          <p>Modelo: ${veiculo.modelo}</p>          <p>Garagem: ${veiculo.garagem}</p>        `;
        searchResults.appendChild(vehicleDiv);
      });
    } else {
      searchResults.innerHTML = '<p>Nenhum veículo ou garagem encontrado</p>';
    }
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    searchResults.innerHTML = '<p>Erro ao buscar veículos</p>';
  }
  searchInput.value = '';
  // db.collection('garagens').get().then(snapshot => {
  //   snapshot.forEach(doc => {
  //     const garagem = doc.id
  //     db.collection('garagens').doc(garagem).collection('veiculos').get().then(subSnapshot => {
  //       const resultados = []
  //       subSnapshot.forEach(subDoc => {
  //         const veiculo = subDoc.data()
  //         if(veiculo.nome.toLowerCase().includes(termo) || veiculo.garagem.toLowerCase().includes(termo)) {
  //           resultados.push(veiculo)
  //         }
  //       })
  //       if(resultados.length > 0){
  //         resultados.forEach(veiculo => {
  //           const vehicleDiv = document.createElement('div');
  //           vehicleDiv.className = 'vehicle';
  //           vehicleDiv.innerHTML = `
  //             <h3>${veiculo.nome}</h3>
  //             <p>Modelo: ${veiculo.modelo}</p>
  //             <p>Garagem: ${veiculo.garagem}</p>
  //           `;
  //           searchResults.appendChild(vehicleDiv);
  //         });
  //       } else {
  //         searchResults.innerHTML = '<p>Nenhum veículo ou garagem encontrado</p>';
  //       }
  //     })
  //   });
  // }).catch(error => {
  //   console.error('Erro ao buscar veículos:', error);
  //   searchResults.innerHTML = '<p>Erro ao buscar veículos</p>';
  // });
  // searchInput.value = '';
};



form.addEventListener('submit', handleFormSubmit)
showVehiclesButton.addEventListener('click', toggleVehicleList)
searchButton.addEventListener('click', buscarVeiculos)