export enum COLORS {
    green = "#8df702",
    red = "#f70269",
    blue = "#028df7",
    yellow = "#f7e302",
    grey = "#d703fc",
}

export const BOLTS_COLORS_AMOUNT = [
    COLORS.green, COLORS.green, COLORS.green,
    COLORS.red, COLORS.red, COLORS.red,
    COLORS.green, COLORS.green, COLORS.green,
    COLORS.red, COLORS.red, COLORS.red,
    COLORS.yellow, COLORS.yellow, COLORS.yellow,
    COLORS.blue, COLORS.blue, COLORS.blue,
    COLORS.grey, COLORS.grey, COLORS.grey,
    COLORS.blue, COLORS.blue, COLORS.blue,
    COLORS.yellow, COLORS.yellow, COLORS.yellow,
    COLORS.grey, COLORS.grey, COLORS.grey
];

interface IBoltsPack {
    type: COLORS;
    count: number;
}

const INITIAL_BOLTS_PACKS: IBoltsPack[] = [
    {
        type: COLORS.green,
        count: 3
    },
    {
        type: COLORS.green,
        count: 3
    },
    {
        type: COLORS.red,
        count: 3
    },
    {
        type: COLORS.red,
        count: 3
    },
    {
        type: COLORS.blue,
        count: 3
    },
    {
        type: COLORS.blue,
        count: 3
    },
    {
        type: COLORS.yellow,
        count: 3
    },
    {
        type: COLORS.yellow,
        count: 3
    },
    {
        type: COLORS.grey,
        count: 3
    },
    {
        type: COLORS.grey,
        count: 3
    }
]

export class BoltsModel {
    public readonly chestsNumber = 3;
    public readonly boltsInChestsNumber = 3;
    public boltsColorsAmount!: COLORS[];
    public boltsPacks!: IBoltsPack[];
    public targetBoltsPacks!: IBoltsPack[];

    public reset(): void {
        const boltsPacks = this.boltsPacks = JSON.parse(JSON.stringify(INITIAL_BOLTS_PACKS));
        const targetBoltsPacks: IBoltsPack[] = this.targetBoltsPacks = [];

        for (let i = 0; i < this.chestsNumber; i++) {
            const idx = Math.floor(Math.random() * boltsPacks.length);
            const pack = boltsPacks.splice(idx, 1)[0];
            targetBoltsPacks.push(pack);
        }

        this.boltsColorsAmount = BOLTS_COLORS_AMOUNT.slice();
    }

    public updatePublicBoltPack(idxPack: number): void {
        const boltsPacks: IBoltsPack[] = this.boltsPacks;

        if (boltsPacks.length > 0) {
            const idx = Math.floor(Math.random() * boltsPacks.length);
            const newPack = boltsPacks.splice(idx, 1)[0]!;

            const targetPack = this.targetBoltsPacks[idxPack];
            targetPack!.type = newPack.type;
            targetPack!.count = newPack.count;
        }
    }
}
