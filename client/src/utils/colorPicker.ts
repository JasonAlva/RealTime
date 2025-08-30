const COLORS = [
    "#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#845EC2",
    "#FF9671", "#0081CF", "#FFC75F", "#D65DB1", "#00C9A7"
  ];
  
  let colorIndex = 0;
  export function getUserColor() {
    const color = COLORS[colorIndex % COLORS.length];
    colorIndex++;
    return color;
  }