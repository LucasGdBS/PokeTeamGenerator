// Importa a classe TeamMaker do arquivo TeamMaker.js
import { TeamMaker } from "./TeamMaker.js";

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
        <div class="pokemon-sprite"><img src=${pokemon.sprite}></div>
        <div class="pokemon-name">${pokemon.name}</div>
        <div class="pokemon-types">Tipos: ${pokemon.type.join(", ")}</div>
    `;
        teamOutput.appendChild(pokemonElement);
      });
    })
    .catch((error) => {
      console.error("Erro ao gerar time:", error);
      teamOutput.innerHTML = `<p>Ocorreu um erro ao gerar o time de Pokémon.</p>`;
    });
}

// Adiciona um listener para o botão de gerar time
generateTeamButton.addEventListener("click", generateTeam);
