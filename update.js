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
 
        if (this.allow_types.length < 18 && !this.allow_types.some((t) => pokemon.type.includes(t))) {
          // Se houver menos tipos permitidos e o Pokémon não tem nenhum dos tipos permitidos, continue para o próximo Pokémon
          continue;
        }

        if (!this.allow_legendaries || this.allow_generations.length < 9) {
          let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.game_indice}`);
          let specie = await response.json();

          let isLegendary = specie.is_legendary;
          let generation = specie.generation.name;

          if (!this.allow_legendaries && isLegendary) {
            // Se não permitir Pokémon lendários e o Pokémon é lendário, continue para o próximo Pokémon
            continue;
          }
          if (this.allow_generations.length < 9 && !this.allow_generations.includes(generation)) {
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