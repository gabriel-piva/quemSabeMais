// --------------------------------------------------------------------------

// Character 

class Character {
    public name: string;
    public nameVariations: string[];
    public image: string;
    public video: string;
    public tips: string[];

    constructor(name: string, nameVariations: string[], image: string, video: string, tips: string[]) {
        this.name = name;
        this.nameVariations = nameVariations;
        this.image = image;
        this.video = video;
        this.tips = tips;
    }
}

export { Character };

// --------------------------------------------------------------------------