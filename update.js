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
var checkedItemsTypes = getCheckedItemsTypes();
var checkedItemsGenerations = getCheckedItemsGenerations();

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



// Responsavel por recuperar os valores dos checkbox
function getCheckedItemsTypes() {
  var checkboxes = document.querySelectorAll('#checkboxes-type input[type="checkbox"]');
  var checkedItems = [];

  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      checkedItems.push(checkbox.value);
    }
  });

  return checkedItems;
}

function getCheckedItemsGenerations() {
  var checkboxes = document.querySelectorAll('#checkboxes-generation input[type="checkbox"]');
  var checkedItems = [];

  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      checkedItems.push(checkbox.value);
    }
  });

  return checkedItems;
}


