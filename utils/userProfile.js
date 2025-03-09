const profileBgColors = [
  "bg-red-600", // Dark Red
  "bg-orange-600", // Dark Orange
  "bg-amber-600", // Dark Amber
  "bg-yellow-600", // Dark Yellow
  "bg-lime-700", // Deep Lime
  "bg-green-600", // Dark Green
  "bg-emerald-600", // Dark Emerald
  "bg-teal-600", // Dark Teal
  "bg-cyan-700", // Deep Cyan
  "bg-sky-700", // Deep Sky Blue
  "bg-blue-600", // Dark Blue
  "bg-indigo-600", // Dark Indigo
  "bg-violet-600", // Dark Violet
  "bg-purple-600", // Dark Purple
  "bg-fuchsia-600", // Dark Fuchsia
  "bg-pink-600", // Dark Pink
  "bg-rose-600", // Dark Rose
  "bg-slate-700", // Dark Slate
  "bg-gray-700", // Dark Gray
  "bg-zinc-700", // Dark Zinc
];

const roleDetails = {
  guest: {
    level: 0,
    bgcolor: "bg-zinc-600",
    namecolor: "text-slate-500",
  },

  member: {
    level: 10,
    namecolor: "text-neutral-900",
    unauthorized: "anonymous",
  },
  "jerk-member": {
    level: 100,
    namecolor: "text-yellow-800",
  },
  author: {
    level: 100,
    namecolor: "text-teal-600 font-normal ",
  },

  "super-admin": {
    level: 999999,
    bgcolor: " bg-gradient-to-br from-indigo-600 to-rose-800  ",
    namecolor:
      "font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-purple-700  to-cyan-400 ",
  },
};

const arraySize = profileBgColors.length;
function pickBgColor() {
  return profileBgColors[Math.floor(Math.random() * arraySize)];
}

module.exports = { pickBgColor, roleDetails, profileBgColors };
