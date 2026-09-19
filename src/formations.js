export const FORMATIONS = {
  "4-4-2": {
    id: "4-4-2",
    slots: [
      { id: "gk", pos: "GK", x: 50, y: 91, label: "ВР" },
      { id: "d1", pos: "DF", x: 13, y: 71, label: "ЛЗ" },
      { id: "d2", pos: "DF", x: 37, y: 76, label: "ЦЗ" },
      { id: "d3", pos: "DF", x: 63, y: 76, label: "ЦЗ" },
      { id: "d4", pos: "DF", x: 87, y: 71, label: "ПЗ" },
      { id: "m1", pos: "MF", x: 13, y: 47, label: "ЛП" },
      { id: "m2", pos: "MF", x: 37, y: 52, label: "ЦП" },
      { id: "m3", pos: "MF", x: 63, y: 52, label: "ЦП" },
      { id: "m4", pos: "MF", x: 87, y: 47, label: "ПП" },
      { id: "f1", pos: "FW", x: 37, y: 20, label: "ФД" },
      { id: "f2", pos: "FW", x: 63, y: 20, label: "ФД" },
    ],
  },
  "4-3-3": {
    id: "4-3-3",
    slots: [
      { id: "gk", pos: "GK", x: 50, y: 91, label: "ВР" },
      { id: "d1", pos: "DF", x: 13, y: 71, label: "ЛЗ" },
      { id: "d2", pos: "DF", x: 37, y: 76, label: "ЦЗ" },
      { id: "d3", pos: "DF", x: 63, y: 76, label: "ЦЗ" },
      { id: "d4", pos: "DF", x: 87, y: 71, label: "ПЗ" },
      { id: "m1", pos: "MF", x: 26, y: 55, label: "ЦП" },
      { id: "m2", pos: "MF", x: 50, y: 49, label: "ЦП" },
      { id: "m3", pos: "MF", x: 74, y: 55, label: "ЦП" },
      { id: "f1", pos: "FW", x: 15, y: 24, label: "ЛФ" },
      { id: "f2", pos: "FW", x: 50, y: 19, label: "ЦФ" },
      { id: "f3", pos: "FW", x: 85, y: 24, label: "ПФ" },
    ],
  },
  "4-2-3-1": {
    id: "4-2-3-1",
    slots: [
      { id: "gk", pos: "GK", x: 50, y: 91, label: "ВР" },
      { id: "d1", pos: "DF", x: 13, y: 71, label: "ЛЗ" },
      { id: "d2", pos: "DF", x: 37, y: 76, label: "ЦЗ" },
      { id: "d3", pos: "DF", x: 63, y: 76, label: "ЦЗ" },
      { id: "d4", pos: "DF", x: 87, y: 71, label: "ПЗ" },
      { id: "m1", pos: "MF", x: 37, y: 60, label: "ОП" },
      { id: "m2", pos: "MF", x: 63, y: 60, label: "ОП" },
      { id: "m3", pos: "MF", x: 15, y: 38, label: "ЛП" },
      { id: "m4", pos: "MF", x: 50, y: 35, label: "ЦП" },
      { id: "m5", pos: "MF", x: 85, y: 38, label: "ПП" },
      { id: "f1", pos: "FW", x: 50, y: 17, label: "ЦФ" },
    ],
  },
};

export const POS_COLORS = {
  GK: "#f5c518",
  DF: "#4da3ff",
  MF: "#39d98a",
  FW: "#ff5d5d",
};

export const POS_NAMES = { GK: "Вратари", DF: "Защитники", MF: "Полузащитники", FW: "Нападающие" };
