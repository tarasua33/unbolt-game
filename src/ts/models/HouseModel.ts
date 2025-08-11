export enum ElementTypes {
    WINDOW = "window",
    WOOL_F = "wallFull",
    WOOL_D = "wallDoor",
    WOOL_W = "wallWindow",
    FL_P = "floorPattern",
    FL_B = "floorBoard",
    DOOR = "door"
}

export enum ElementIDs {
    DOOR = "door",
    WALL_FD = 'frontDoorWall',
    WALL_FW = 'frontWindowWall',
    WALL_LSFW = "leftSideFrontWindowWall",
    WALL_LSB = "leftSideBackWall",
    WALL_RSF = "rightSideFrontWall",
    WALL_RSBW = "rightSideBackWindowWall",
    WALL_BL = "backLeftWall",
    WALL_BR = "backRightWall",
    FLOOR_B = "floorBottom",
    FLOOR_T = "floorTop",
    WINDOW_F = "windowFront",
    WINDOW_L = "windowLeft",
    WINDOW_R = "windowRight",
    ROOF_L = "leftHalfRoof",
    ROOF_R = "rightHalfRoof"
}

const boltedElements = [
    ElementIDs.DOOR,
    ElementIDs.WALL_FD,
    ElementIDs.WALL_FW,
    ElementIDs.WALL_LSFW,
    ElementIDs.WALL_LSB,
    ElementIDs.WALL_RSF,
    ElementIDs.WALL_RSBW,
    ElementIDs.WALL_BL,
    ElementIDs.WALL_BR,
    ElementIDs.FLOOR_B,
    ElementIDs.FLOOR_T,
    ElementIDs.WINDOW_F,
    ElementIDs.WINDOW_L,
    ElementIDs.WINDOW_R,
    ElementIDs.ROOF_L,
    ElementIDs.ROOF_R
]

const taskMap: Map<ElementIDs, {boltsNum: number}> = new Map([
    [ElementIDs.DOOR, { boltsNum: 1 }],
    [ElementIDs.WINDOW_F, { boltsNum: 1 }],
    [ElementIDs.WINDOW_L, { boltsNum: 1 }],
    [ElementIDs.WINDOW_R, { boltsNum: 1 }],
    [ElementIDs.WALL_FD, { boltsNum: 2 }],
    [ElementIDs.WALL_FW, { boltsNum: 2 }],
    [ElementIDs.WALL_BL, { boltsNum: 2 }],
    [ElementIDs.WALL_BR, { boltsNum: 2 }],
    [ElementIDs.WALL_LSB, { boltsNum: 2 }],
    [ElementIDs.WALL_LSFW, { boltsNum: 2 }],
    [ElementIDs.WALL_RSBW, { boltsNum: 2 }],
    [ElementIDs.WALL_RSF, { boltsNum: 2 }],
    [ElementIDs.FLOOR_B, { boltsNum: 3 }],
    [ElementIDs.FLOOR_T, { boltsNum: 3 }],
    [ElementIDs.ROOF_L, { boltsNum: 2 }],
    [ElementIDs.ROOF_R, { boltsNum: 2 }]
])

export class HouseModel {
    public assetsElementTypes = [ElementTypes.DOOR, ElementTypes.FL_B, ElementTypes.FL_P, ElementTypes.WINDOW, ElementTypes.WOOL_D, ElementTypes.WOOL_F, ElementTypes.WOOL_W];

    public boltedElements = boltedElements.slice()
    public taskMap: Map<ElementIDs, {boltsNum: number}> = new Map(
        Array.from(taskMap).map(([key, value]) => [key, JSON.parse(JSON.stringify(value))])
    )
}