class TeamMaker {
  constructor(qnt_members = 6, repeat_types = false) {
    this.qnt_members = qnt_members;
    this.repeat_types = repeat_types;
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
      let hasDuplicateType = pokemon.type.some((t) => seenTypes.has(t));

      if (!this.repeat_types && hasDuplicateType) {
        // Se não permitir tipos repetidos e o Pokémon tem um tipo que já está no time, continue para o próximo Pokémon
        continue;
      }

      team.push(pokemon);
      pokemon.type.forEach((t) => seenTypes.add(t)); // Adiciona os tipos deste Pokémon ao conjunto de tipos vistos
    }

    return team;
  }
}

// Captura os elementos HTML
const teamSizeInput = document.getElementById("teamSizeInput");
const repeatTypesRadio = document.getElementsByName("repeatTypes");
const generateTeamButton = document.getElementById("generateTeamButton");
const teamOutput = document.getElementById("teamOutput");

// Inicializa o TeamMaker
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
  // Adicione outras cores conforme necessário
};

// Função para gerar o time de Pokémon
function generateTeam() {
  generateTeamButton.classList.add('generating');
  generateTeamButton.disabled = true;

  // Obtém o tamanho do time do input
  const teamSize = parseInt(teamSizeInput.value, 10);

  // Define o tamanho do time no TeamMaker
  maker.qnt_members = teamSize;

  // Obtém se tipos repetidos são permitidos ou não
  const allowRepeatTypes = repeatTypesRadio[0].checked; // true se permitir, false se não permitir

  // Define o comportamento de repetição de tipos no TeamMaker
  maker.repeat_types = allowRepeatTypes;

  // Limpa o conteúdo atual do contêiner de Pokémon
  teamOutput.innerHTML = "";

  // Gera o time de Pokémon
  maker
    .randomize_team()
    .then((team) => {
      // Para cada Pokémon no time, cria um elemento e adiciona ao contêiner
      team.forEach((pokemon) => {
        const pokemonElement = document.createElement("div");
        pokemonElement.classList.add("pokemon");

        const primaryType = pokemon.type[0].toLowerCase();
        const backgroundColor = typeColors[primaryType] || "#A8A878";

        pokemonElement.style.backgroundColor = backgroundColor;

        pokemonElement.innerHTML = `
        <div class="pokemon-id">ID: ${pokemon.game_indice}</div>
        <a href="https://pokemondb.net/pokedex/${pokemon.name}" target="_blank">
        <div class="pokemon-sprite"><img src=${pokemon.sprite}></div>
        </a>
        
        <a href="https://pokemondb.net/pokedex/${pokemon.name}" target="_blank">
        <div class="pokemon-name">${pokemon.name}</div>
        </a>
        <div class="pokemon-types">Types: ${pokemon.type.join(", ")}</div>
    `;
        teamOutput.appendChild(pokemonElement);
      });

      generateTeamButton.disabled = false;
      generateTeamButton.classList.remove('generating');
    })
    .catch((error) => {
      console.error("Error to generate team:", error);
      teamOutput.innerHTML = `<p>Error to generate team.</p>`;

      generateTeamButton.disabled = false;
      generateTeamButton.classList.remove('generating');
    });
}

// Adiciona um listener para o botão de gerar time
generateTeamButton.addEventListener("click", generateTeam);
