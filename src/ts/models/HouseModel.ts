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

export class HouseModel {
    public assetsElementTypes = [ElementTypes.DOOR, ElementTypes.FL_B, ElementTypes.FL_P, ElementTypes.WINDOW, ElementTypes.WOOL_D, ElementTypes.WOOL_F, ElementTypes.WOOL_W];
}