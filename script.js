class TeamMaker {
  constructor(qnt_members = 6, repeat_types = false) {
    this.qnt_members = qnt_members;
    this.repeat_types = repeat_types;
    this.allow_types = [];
    this.allow_generations = [];
    this.allow_legendaries = true;
    this.team_members = [];
    this.url = "https://pokeapi.co/api/v2/pokemon";
  }

  get_pokemon_type(pokemon) {
    return pokemon.types.map((type) => type.type.name);
  }

  get_pogemon_name(pokemon) {
    return pokemon.name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async get_random_pokemon() {
    let pokemon_id = Math.floor(Math.random() * 1025);
    let response = await fetch(`${this.url}/${pokemon_id}`);
    let pokemon = await response.json();
    return {
      game_indice: pokemon.id,
      name: this.get_pogemon_name(pokemon),
      type: this.get_pokemon_type(pokemon),
      sprite: pokemon.sprites.front_default,
    };
  }

  async randomize_team() {
    let team = [];
    let seenTypes = new Set();

    while (team.length < this.qnt_members) {
      let pokemon = await this.get_random_pokemon();
      let hasDuplicateType = pokemon.type.some((t) => seenTypes.has(t)); // Verifica se ja existe o tipo do pokemon no time e retorna true ou false

      if (!this.repeat_types && hasDuplicateType) {
        // Se não permitir tipos repetidos e o Pokémon tem um tipo que já está no time, continue para o próximo Pokémon
        continue;
      }

      if (
        this.allow_types.length < 18 &&
        !this.allow_types.some((t) => pokemon.type.includes(t))
      ) {
        // Se houver menos tipos permitidos e o Pokémon não tem nenhum dos tipos permitidos, continue para o próximo Pokémon
        continue;
      }

      if (!this.allow_legendaries || this.allow_generations.length < 9) {
        let response = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.game_indice}`
        );
        let specie = await response.json();

        let isLegendary = specie.is_legendary;
        let generation = specie.generation.name;

        if (!this.allow_legendaries && isLegendary) {
          // Se não permitir Pokémon lendários e o Pokémon é lendário, continue para o próximo Pokémon
          continue;
        }
        if (
          this.allow_generations.length < 9 &&
          !this.allow_generations.includes(generation)
        ) {
          // Se houver menos gerações permitidas e a geração do Pokémon não está entre as permitidas, continue para o próximo Pokémon
          continue;
        }
      }

      team.push(pokemon);
      pokemon.type.forEach((t) => seenTypes.add(t)); // Adiciona os tipos deste Pokémon ao conjunto de tipos vistos
    }

    return team;
  }
}

// Responsavel pelos checkbox dentro dos selects
var expanded_types = false;
var expanded_generation = false;

function showCheckboxesTypes() {
  var checkboxes = document.getElementById("checkboxes-type");
  if (!expanded_types) {
    checkboxes.style.display = "block";
    expanded_types = true;
  } else {
    checkboxes.style.display = "none";
    expanded_types = false;
  }
}

function showCheckboxesGeneration() {
  var checkboxes = document.getElementById("checkboxes-generation");
  if (!expanded_generation) {
    checkboxes.style.display = "block";
    expanded_generation = true;
  } else {
    checkboxes.style.display = "none";
    expanded_generation = false;
  }
}

// Responsavel por criar o time
// Pegando os valores dos inputs
const teamSizeInput = document.getElementById("teamSizeInput");
const repeatTypesRadio = document.getElementsByName("repeatTypes");
const allowLegendariesRadio = document.getElementsByName("allowLegendaries");
const generateTeamButton = document.getElementById("generateTeamButton");
const teamOutput = document.getElementById("teamOutput");

let maker = new TeamMaker();

const typeColors = {
  bug: "#A8B820",
  dark: "#705848",
  dragon: "#7038F8",
  electric: "#F8D030",
  fairy: "#EE99AC",
  fighting: "#C03028",
  fire: "#F08030",
  flying: "#A890F0",
  ghost: "#705898",
  grass: "#78C850",
  ground: "#E0C068",
  ice: "#98D8D8",
  normal: "#A8A878",
  poison: "#A040A0",
  psychic: "#F85888",
  rock: "#B8A038",
  steel: "#B8B8D0",
  water: "#6890F0",
};

// Função para gerar os pokemon vai aqui!
function generateTeam() {
  const generateTeamButton = document.getElementById("generateTeamButton");
  const teamSizeInput = document.getElementById("teamSizeInput");
  const repeatTypesRadio = document.getElementsByName("repeatTypes");
  const allowLegendariesRadio = document.getElementsByName("allowlegendary");
  const teamOutput = document.getElementById("teamOutput");

  generateTeamButton.classList.add("generating");
  generateTeamButton.disabled = true;

  const teamSize = parseInt(teamSizeInput.value, 10);
  maker.qnt_members = teamSize;

  const allowRepeatTypes = repeatTypesRadio[0].checked;

  maker.allow_legendaries = allowLegendariesRadio[0].checked;
  maker.repeat_types = allowRepeatTypes;
  maker.allow_types = getCheckedItems("checkboxes-type");
  maker.allow_generations = getCheckedItems("checkboxes-generation");
  console.log(maker.allow_types);
  console.log(maker.allow_generations);

  if (maker.allow_types.length === 0) {
    alert("Please select at least one type.");
    generateTeamButton.disabled = false;
    generateTeamButton.classList.remove("generating");
    return;
  }

  if (maker.allow_generations.length === 0) {
    alert("Please select at least one generation.");
    generateTeamButton.disabled = false;
    generateTeamButton.classList.remove("generating");
    return;
  }

  // Limpa o conteúdo atual do contêiner de Pokémon
  teamOutput.innerHTML = "";

  // Gera o time de Pokémon
  maker
    .randomize_team()
    .then((team) => {
      team.forEach((pokemon) => {
        const { game_indice, name, type, sprite } = pokemon;

        // Create the outer div for the card
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("col-md-8", "mb-3");

        // Create the card element
        const card = document.createElement("div");
        card.classList.add("card", "text-white");
        card.style.backgroundColor = typeColors[type[0]];

        // Create the horizontal card body
        const cardHorizontal = document.createElement("div");
        cardHorizontal.classList.add("card-horizontal");

        // Create the card body content
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        // Create the ID text
        const idText = document.createElement("p");
        idText.classList.add("card-text");
        idText.innerHTML = `<strong>ID: ${game_indice}</strong>`;

        // Create the image element
        const imgLink = document.createElement("a");
        imgLink.href = `https://pokemondb.net/pokedex/${game_indice}`; // Adicione a URL desejada aqui

        const img = document.createElement("img");
        img.src = sprite;
        img.alt = name;
        img.classList.add("card-img-left");

        imgLink.appendChild(img);

        // Create the name element
        const nameElement = document.createElement("h5");
        nameElement.classList.add("card-title");
        const nameLink = document.createElement("a");
        nameLink.href = `https://pokemondb.net/pokedex/${game_indice}`; // Adicione a URL desejada aqui
        nameLink.target = "_blank";
        nameLink.textContent = name;
        nameLink.classList.add("text-white", "d-flex", "justify-content-center");
        nameElement.appendChild(nameLink);

        const capitalizedTypes = type.map(
          (type) => type.charAt(0).toUpperCase() + type.slice(1)
        );

        // Create the types text
        const typesText = document.createElement("p");
        typesText.classList.add("card-text");
        typesText.innerHTML = `<strong>Types: ${capitalizedTypes.join(
          ", "
        )}</strong>`;

        // Append all elements to the card body
        cardBody.appendChild(idText);
        cardBody.appendChild(imgLink);
        cardBody.appendChild(nameElement);
        cardBody.appendChild(typesText);

        // Append card body to card horizontal div
        cardHorizontal.appendChild(cardBody);

        // Append card horizontal div to card
        card.appendChild(cardHorizontal);

        // Append card to outer div
        cardDiv.appendChild(card);

        // Append the card to the team output
        teamOutput.appendChild(cardDiv);
      });

      generateTeamButton.disabled = false;
      generateTeamButton.classList.remove("generating");
    })
    .catch((error) => {
      console.error("Error to generate team:", error);
      teamOutput.innerHTML = `<p>Error to generate team.</p>`;

      generateTeamButton.disabled = false;
      generateTeamButton.classList.remove("generating");
    });
}

// Adiciona um listener para o botão de gerar time
generateTeamButton.addEventListener("click", generateTeam);

// Função para capturar os itens marcados
function getCheckedItems(containerId) {
  const checkboxes = document.querySelectorAll(
    `#${containerId} input[type=checkbox]`
  );
  let checkedItems = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedItems.push(checkbox.value);
    }
  });
  return checkedItems;
}

// Adicionando o evento de click no botão
generateTeamButton.addEventListener("click", generateTeam);

// Responsavel por marcar todos os checkbox
function checkAllBoxes(id_checkbox, class_checkbox) {
  var checkall = document.getElementById(
    `${id_checkbox}`
  );

  checkboxes = document.querySelectorAll(
    `#${class_checkbox} input[type="checkbox"]`
  );

  if (checkall.checked) {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = true;
    });
  } else {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  }
}

document.getElementById('checkall-type').addEventListener('change', function() {
  checkAllBoxes('checkall-type', 'checkboxes-type');
});

document.getElementById('checkall-generation').addEventListener('change', function() {
  checkAllBoxes('checkall-generation', 'checkboxes-generation');
});