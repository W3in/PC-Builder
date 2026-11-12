// Prebuilt PCs, one per usage, built from parts that exist in seeds/products.js.
// Seeded so the Prebuilt page is never empty after `npm run seed`.
const part = (component, name) => ({ component, name });

const Prebuilts = [
  {
    name: "PC Office Starter i3", slug: "pc-office-starter-i3", price: 14990000,
    image: "/images/products/xigmatek-gaming-x.png", brand: "PC Builder", category: "prebuilt", usage: "office", countInStock: 10,
    description: "Máy văn phòng - học tập gọn nhẹ, đủ dùng cho Office, họp online và giải trí nhẹ.",
    buildParts: [
      part("cpu", "Intel Core i3-12100F"),
      part("mainboard", "ASUS H610M-K D4"),
      part("ram", "Kingston Fury Beast 8GB DDR4 3200MHz"),
      part("gpu", "MSI RX 7600 Mech 2X 8G"),
      part("hdd", "Seagate Barracuda 2TB"),
      part("psu", "Deepcool PK550D 550W Bronze"),
      part("case", "Xigmatek Gaming X 3F"),
      part("cooler", "ID-Cooling SE-214-XT ARGB")
    ]
  },
  {
    name: "PC Gaming Ryzen 5 RTX 4060 Ti", slug: "pc-gaming-ryzen-5-rtx-4060-ti", price: 28990000,
    image: "/images/products/montech-air-1000.png", brand: "PC Builder", category: "prebuilt", usage: "gaming", countInStock: 10,
    description: "Cấu hình chơi game 1080p/1440p mượt mà với Ryzen 5 7600 và RTX 4060 Ti.",
    buildParts: [
      part("cpu", "AMD Ryzen 5 7600"),
      part("mainboard", "Gigabyte B650M GAMING X AX"),
      part("ram", "Corsair Vengeance RGB 16GB DDR5 6000MHz"),
      part("gpu", "Gigabyte RTX 4060 Ti Eagle 8GB"),
      part("ssd", "Samsung 980 Pro 1TB"),
      part("psu", "Cooler Master MWE 750W Bronze V2"),
      part("case", "Montech AIR 1000 Premium"),
      part("cooler", "Thermalright Peerless Assassin 120 SE")
    ]
  },
  {
    name: "PC Streaming i7 RTX 4070 Super", slug: "pc-streaming-i7-rtx-4070-super", price: 49990000,
    image: "/images/products/corsair-4000d.png", brand: "PC Builder", category: "prebuilt", usage: "streaming", countInStock: 5,
    description: "Vừa chơi game vừa livestream: Core i7-14700K 20 nhân cùng RTX 4070 Super.",
    buildParts: [
      part("cpu", "Intel Core i7-14700K"),
      part("mainboard", "Gigabyte Z790 AORUS ELITE AX"),
      part("ram", "G.Skill Trident Z5 RGB 16GB DDR5 6400MHz"),
      part("gpu", "ASUS Dual RTX 4070 Super 12GB"),
      part("ssd", "Samsung 980 Pro 1TB"),
      part("psu", "MSI MPG A850G PCIE5 850W Gold"),
      part("case", "Corsair 4000D Airflow"),
      part("cooler", "Deepcool LT720 360mm")
    ]
  },
  {
    name: "PC Workstation Ryzen 9 RTX 4080 Super", slug: "pc-workstation-ryzen-9-rtx-4080-super", price: 75990000,
    image: "/images/products/lianli-o11d-evo.png", brand: "PC Builder", category: "prebuilt", usage: "workstation", countInStock: 3,
    description: "Máy trạm cho dựng phim, render 3D và AI với Ryzen 9 7950X và RTX 4080 Super.",
    buildParts: [
      part("cpu", "AMD Ryzen 9 7950X"),
      part("mainboard", "MSI MPG B650 CARBON WIFI"),
      part("ram", "TeamGroup T-Force Delta RGB 16GB DDR5 6000MHz"),
      part("gpu", "Gigabyte RTX 4080 Super Gaming OC"),
      part("ssd", "Samsung 980 Pro 1TB"),
      part("hdd", "Seagate Barracuda 2TB"),
      part("psu", "Corsair RM1000x 1000W 80 Plus Gold"),
      part("case", "Lian Li O11 Dynamic EVO Black"),
      part("cooler", "NZXT Kraken Elite 360 RGB")
    ]
  }
];

module.exports = Prebuilts;
