export function getAbbrName(name: string) {
  if (!name) return "?";
  const words = name.split(" ").filter(Boolean);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function randomAvatarBg(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; ++i) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360},78%,52%)`;
  return color;
}
