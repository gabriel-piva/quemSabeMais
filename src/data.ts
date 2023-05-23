// --------------------------------------------------------------------------

import { Character } from "./character.js";

// --------------------------------------------------------------------------

// Get Characters Data from JSON

async function getCharactersData():Promise<Character[]> {
    const charactersList: Character[] = [];
    try {
        const response = await fetch('assets/data/characters.json');
        const characters = await response.json();
        for(let character of characters) {
            const newCharacter: Character = new Character(character.name, character.nameVariations, character.image, character.video, character.tips);
            charactersList.push(newCharacter);
        }
    } catch(error) {
        console.error("Error loading characters: ", error);
    }
    return charactersList;
}

export { getCharactersData };

// --------------------------------------------------------------------------