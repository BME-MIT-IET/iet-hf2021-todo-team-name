export interface Class {
  id: String;
  name: String;
  color: String;
  icon: String | undefined;
}

export const colors = {
  blue: { text: "Kék", value: "#007bff" },
  indigo: { text: "Indigó", value: "#6610f2" },
  pink: { text: "Rózsaszín", value: "#e83e8c" },
  red: { text: "Piros", value: "#dc3545" },
  orange: { text: "Narancssárga", value: "#fd7e14" },
  yello: { text: "Sárga", value: "#ffc107" },
  green: { text: "Zöld", value: "#28a745" },
  cyan: { text: "Kékeszöld", value: "#17a2b8" },
  white: { text: "Fehér", value: "#ffffff" },
  gray: { text: "Szürke", value: "#6c757d" },
  darkGray: { text: "Sötét", value: "#343a40" },
};
