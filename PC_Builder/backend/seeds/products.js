const Products = [
  // ==================== CPU (INTEL) ====================
  // Gen 14
  {
    name: "Intel Core i9-14900K", slug: "intel-core-i9-14900k", price: 15990000,
    image: "/images/products/cpu-intel-core-i9-14900k.png", brand: "Intel", category: "cpu", countInStock: 20,
    specs: { socket: "LGA1700", core_count: 24, thread_count: 32, base_clock: 3.2, boost_clock: 6.0, tdp: 125, performance_score: 65000, integrated_graphics: true, series: "Core i9" }
  },
  {
    name: "Intel Core i7-14700K", slug: "intel-core-i7-14700k", price: 11500000,
    image: "/images/products/intel-core-i7-14700k.png", brand: "Intel", category: "cpu", countInStock: 30,
    specs: { socket: "LGA1700", core_count: 20, thread_count: 28, base_clock: 3.4, boost_clock: 5.6, tdp: 125, performance_score: 52000, integrated_graphics: true, series: "Core i7" }
  },
  {
    name: "Intel Core i5-14600K", slug: "intel-core-i5-14600k", price: 8500000,
    image: "/images/products/cpu-intel-core-i5-14600k.png", brand: "Intel", category: "cpu", countInStock: 50,
    specs: { socket: "LGA1700", core_count: 14, thread_count: 20, base_clock: 3.5, boost_clock: 5.3, tdp: 125, performance_score: 38000, integrated_graphics: true, series: "Core i5" }
  },
  {
    name: "Intel Core i9-13900K", slug: "intel-core-i9-13900k", price: 13500000,
    image: "/images/products/cpu-intel-core-i9-13900k.png", brand: "Intel", category: "cpu", countInStock: 15,
    specs: { socket: "LGA1700", core_count: 24, thread_count: 32, base_clock: 3.0, boost_clock: 5.8, tdp: 125, performance_score: 60000, integrated_graphics: true, series: "Core i9" }
  },
  {
    name: "Intel Core i7-13700K", slug: "intel-core-i7-13700k", price: 9900000,
    image: "/images/products/intel-core-i7-13700k.png", brand: "Intel", category: "cpu", countInStock: 20,
    specs: { socket: "LGA1700", core_count: 16, thread_count: 24, base_clock: 3.4, boost_clock: 5.4, tdp: 125, performance_score: 46000, integrated_graphics: true, series: "Core i7" }
  },
  {
    name: "Intel Core i5-13400F", slug: "intel-core-i5-13400f", price: 5200000,
    image: "/images/products/cpu-intel-core-i5-13400f.png", brand: "Intel", category: "cpu", countInStock: 100,
    specs: { socket: "LGA1700", core_count: 10, thread_count: 16, base_clock: 2.5, boost_clock: 4.6, tdp: 65, performance_score: 26000, integrated_graphics: false, series: "Core i5" }
  },
  {
    name: "Intel Core i3-13100F", slug: "intel-core-i3-13100f", price: 2900000,
    image: "/images/products/intel-core-i3-13100f.png", brand: "Intel", category: "cpu", countInStock: 80,
    specs: { socket: "LGA1700", core_count: 4, thread_count: 8, base_clock: 3.4, boost_clock: 4.5, tdp: 58, performance_score: 15000, integrated_graphics: false, series: "Core i3" }
  },
  {
    name: "Intel Core i5-12400F", slug: "intel-core-i5-12400f", price: 3200000,
    image: "/images/products/cpu-intel-core-i5-12400f.png", brand: "Intel", category: "cpu", countInStock: 150,
    specs: { socket: "LGA1700", core_count: 6, thread_count: 12, base_clock: 2.5, boost_clock: 4.4, tdp: 65, performance_score: 19500, integrated_graphics: false, series: "Core i5" }
  },
  {
    name: "Intel Core i3-12100F", slug: "intel-core-i3-12100f", price: 2200000,
    image: "/images/products/intel-core-i3-12100f.png", brand: "Intel", category: "cpu", countInStock: 30,
    specs: { socket: "LGA1700", core_count: 4, thread_count: 8, base_clock: 3.3, boost_clock: 4.3, tdp: 58, performance_score: 14000, integrated_graphics: false, series: "Core i3" }
  },

  // ==================== CPU (AMD) ====================
  {
    name: "AMD Ryzen 9 7950X3D", slug: "amd-ryzen-9-7950x3d", price: 16500000,
    image: "/images/products/cpu-amd-ryzen-9-7950x.png", brand: "AMD", category: "cpu", countInStock: 10,
    specs: { socket: "AM5", core_count: 16, thread_count: 32, base_clock: 4.2, boost_clock: 5.7, tdp: 120, performance_score: 64000, integrated_graphics: true, series: "Ryzen 9" }
  },
  {
    name: "AMD Ryzen 9 7950X", slug: "amd-ryzen-9-7950x", price: 13900000,
    image: "/images/products/cpu-amd-ryzen-9-7950x.png", brand: "AMD", category: "cpu", countInStock: 10,
    specs: { socket: "AM5", core_count: 16, thread_count: 32, base_clock: 4.5, boost_clock: 5.7, tdp: 170, performance_score: 63000, integrated_graphics: true, series: "Ryzen 9" }
  },
  {
    name: "AMD Ryzen 9 7900X", slug: "amd-ryzen-9-7900x", price: 10500000,
    image: "/images/products/cpu-amd-ryzen-9-7950x.png", brand: "AMD", category: "cpu", countInStock: 15,
    specs: { socket: "AM5", core_count: 12, thread_count: 24, base_clock: 4.7, boost_clock: 5.6, tdp: 170, performance_score: 51000, integrated_graphics: true, series: "Ryzen 9" }
  },
  {
    name: "AMD Ryzen 7 7800X3D", slug: "amd-ryzen-7-7800x3d", price: 10500000,
    image: "/images/products/amd-ryzen-7-7800x3d.png", brand: "AMD", category: "cpu", countInStock: 12,
    specs: { socket: "AM5", core_count: 8, thread_count: 16, base_clock: 4.2, boost_clock: 5.0, tdp: 120, performance_score: 35000, integrated_graphics: true, series: "Ryzen 7" }
  },
  {
    name: "AMD Ryzen 7 7700X", slug: "amd-ryzen-7-7700x", price: 8200000,
    image: "/images/products/amd-ryzen-7-7800x3d.png", brand: "AMD", category: "cpu", countInStock: 20,
    specs: { socket: "AM5", core_count: 8, thread_count: 16, base_clock: 4.5, boost_clock: 5.4, tdp: 105, performance_score: 36000, integrated_graphics: true, series: "Ryzen 7" }
  },
  {
    name: "AMD Ryzen 5 7600X", slug: "amd-ryzen-5-7600x", price: 5500000,
    image: "/images/products/amd-ryzen-5-7600x.png", brand: "AMD", category: "cpu", countInStock: 40,
    specs: { socket: "AM5", core_count: 6, thread_count: 12, base_clock: 4.7, boost_clock: 5.3, tdp: 105, performance_score: 28000, integrated_graphics: true, series: "Ryzen 5" }
  },
  {
    name: "AMD Ryzen 5 7600", slug: "amd-ryzen-5-7600", price: 4800000,
    image: "/images/products/amd-ryzen-5-7600x.png", brand: "AMD", category: "cpu", countInStock: 30,
    specs: { socket: "AM5", core_count: 6, thread_count: 12, base_clock: 3.8, boost_clock: 5.1, tdp: 65, performance_score: 27000, integrated_graphics: true, series: "Ryzen 5" }
  },
  {
    name: "AMD Ryzen 7 5700X", slug: "amd-ryzen-7-5700x", price: 4200000,
    image: "/images/products/amd-ryzen-5-7600x.png", brand: "AMD", category: "cpu", countInStock: 50,
    specs: { socket: "AM4", core_count: 8, thread_count: 16, base_clock: 3.4, boost_clock: 4.6, tdp: 65, performance_score: 26000, integrated_graphics: false, series: "Ryzen 7" }
  },
  {
    name: "AMD Ryzen 5 5600", slug: "amd-ryzen-5-5600", price: 2900000,
    image: "/images/products/amd-ryzen-5-5600.png", brand: "AMD", category: "cpu", countInStock: 100,
    specs: { socket: "AM4", core_count: 6, thread_count: 12, base_clock: 3.5, boost_clock: 4.4, tdp: 65, performance_score: 22000, integrated_graphics: false, series: "Ryzen 5" }
  },

  // ==================== GPU====================
  {
    name: "ASUS ROG Strix RTX 4090 OC 24GB", slug: "asus-rog-strix-rtx-4090", price: 55000000,
    image: "/images/products/asus-rog-strix-rtx-4090.png", brand: "Asus", category: "gpu", countInStock: 5,
    specs: { chipset: "NVIDIA", series: "RTX 4090", vram: 24, length: 358, tdp: 450, performance_score: 39000, recommended_psu: 1000 }
  },
  {
    name: "Gigabyte RTX 4080 Super Gaming OC", slug: "gigabyte-rtx-4080-super", price: 32000000,
    image: "/images/products/gigabyte-rtx-4080-super.png", brand: "Gigabyte", category: "gpu", countInStock: 10,
    specs: { chipset: "NVIDIA", series: "RTX 4080", vram: 16, length: 342, tdp: 320, performance_score: 35000, recommended_psu: 850 }
  },
  {
    name: "MSI RTX 4070 Ti Super Ventus 3X", slug: "msi-rtx-4070-ti-super", price: 24000000,
    image: "/images/products/msi-rtx-4070-ti-super.png", brand: "MSI", category: "gpu", countInStock: 15,
    specs: { chipset: "NVIDIA", series: "RTX 4070 Ti", vram: 16, length: 308, tdp: 285, performance_score: 31000, recommended_psu: 750 }
  },
  {
    name: "ASUS Dual RTX 4070 Super 12GB", slug: "asus-dual-rtx-4070-super", price: 17500000,
    image: "/images/products/asus-dual-rtx-4070-super.png", brand: "Asus", category: "gpu", countInStock: 25,
    specs: { chipset: "NVIDIA", series: "RTX 4070", vram: 12, length: 267, tdp: 220, performance_score: 27000, recommended_psu: 650 }
  },
  {
    name: "Gigabyte RTX 4060 Ti Eagle 8GB", slug: "gigabyte-rtx-4060-ti", price: 10500000,
    image: "/images/products/gigabyte-rtx-4060-ti.png", brand: "Gigabyte", category: "gpu", countInStock: 40,
    specs: { chipset: "NVIDIA", series: "RTX 4060 Ti", vram: 8, length: 242, tdp: 160, performance_score: 22000, recommended_psu: 550 }
  },
  {
    name: "MSI RTX 4060 Ventus 2X Black", slug: "msi-rtx-4060-ventus", price: 7900000,
    image: "/images/products/msi-rtx-4060-ventus.png", brand: "MSI", category: "gpu", countInStock: 60,
    specs: { chipset: "NVIDIA", series: "RTX 4060", vram: 8, length: 199, tdp: 115, performance_score: 18000, recommended_psu: 550 }
  },
  {
    name: "Gigabyte RTX 3060 Gaming OC 12G", slug: "gigabyte-rtx-3060", price: 7500000,
    image: "/images/products/gigabyte-rtx-3060.png", brand: "Gigabyte", category: "gpu", countInStock: 30,
    specs: { chipset: "NVIDIA", series: "RTX 3060", vram: 12, length: 282, tdp: 170, performance_score: 17000, recommended_psu: 550 }
  },
  {
    name: "ASRock RX 7900 XTX Phantom Gaming", slug: "asrock-rx-7900-xtx", price: 26000000,
    image: "/images/products/asrock-rx-7900-xtx.png", brand: "ASRock", category: "gpu", countInStock: 5,
    specs: { chipset: "AMD", series: "RX 7900 XTX", vram: 24, length: 330, tdp: 355, performance_score: 36000, recommended_psu: 850 }
  },
  {
    name: "Sapphire Pulse RX 7800 XT 16GB", slug: "sapphire-rx-7800-xt", price: 14500000,
    image: "/images/products/sapphire-rx-7800-xt.png", brand: "Sapphire", category: "gpu", countInStock: 10,
    specs: { chipset: "AMD", series: "RX 7800 XT", vram: 16, length: 280, tdp: 263, performance_score: 29000, recommended_psu: 700 }
  },
  {
    name: "MSI RX 7600 Mech 2X 8G", slug: "msi-rx-7600", price: 7200000,
    image: "/images/products/msi-rx-7600.png", brand: "MSI", category: "gpu", countInStock: 20,
    specs: { chipset: "AMD", series: "RX 7600", vram: 8, length: 235, tdp: 165, performance_score: 16000, recommended_psu: 550 }
  },

  // ==================== MAINBOARD====================
  {
    name: "ASUS ROG MAXIMUS Z790 HERO", slug: "asus-z790-hero", price: 16000000,
    image: "/images/products/asus-rog-maximus-z790-hero-ddr5-4.png", brand: "Asus", category: "mainboard", countInStock: 10,
    specs: { socket: "LGA1700", chipset: "Z790", form_factor: "ATX", ram_type: "DDR5", ram_slots: 4, max_ram: 192 }
  },
  {
    name: "MSI MAG B760M MORTAR WIFI", slug: "msi-b760m-mortar", price: 4500000,
    image: "/images/products/msi-b760m-mortar.png", brand: "MSI", category: "mainboard", countInStock: 15,
    specs: { socket: "LGA1700", chipset: "B760", form_factor: "mATX", ram_type: "DDR5", ram_slots: 4, max_ram: 128 }
  },
  {
    name: "Gigabyte Z790 AORUS ELITE AX", slug: "gigabyte-z790-aorus", price: 7200000,
    image: "/images/products/gigabyte-z790-aorus.png", brand: "Gigabyte", category: "mainboard", countInStock: 12,
    specs: { socket: "LGA1700", chipset: "Z790", form_factor: "ATX", ram_type: "DDR5", ram_slots: 4, max_ram: 192 }
  },
  {
    name: "ASUS TUF GAMING B660M-PLUS D4", slug: "asus-b660m-plus", price: 3200000,
    image: "/images/products/ASUS-TUF-GAMING-B660M-PLUS D4.png", brand: "Asus", category: "mainboard", countInStock: 20,
    specs: { socket: "LGA1700", chipset: "B660", form_factor: "mATX", ram_type: "DDR4", ram_slots: 4, max_ram: 128 }
  },
  {
    name: "ASUS H610M-K D4", slug: "asus-h610m-k", price: 1800000,
    image: "/images/products/asus-prime-h610m-ddr4.png", brand: "Asus", category: "mainboard", countInStock: 30,
    specs: { socket: "LGA1700", chipset: "H610", form_factor: "mATX", ram_type: "DDR4", ram_slots: 2, max_ram: 64 }
  },
  {
    name: "ASUS ROG STRIX B650-A WIFI", slug: "asus-rog-strix-b650a", price: 6500000,
    image: "/images/products/asus-rog-strix-b650-a.png", brand: "Asus", category: "mainboard", countInStock: 10,
    specs: { socket: "AM5", chipset: "B650", form_factor: "ATX", ram_type: "DDR5", ram_slots: 4, max_ram: 128 }
  },
  {
    name: "MSI MPG B650 CARBON WIFI", slug: "msi-b650-carbon", price: 7200000,
    image: "/images/products/msi-mag-b660m-mortar.png", brand: "MSI", category: "mainboard", countInStock: 8,
    specs: { socket: "AM5", chipset: "B650", form_factor: "ATX", ram_type: "DDR5", ram_slots: 4, max_ram: 128 }
  },
  {
    name: "Gigabyte B650M GAMING X AX", slug: "gigabyte-b650m-gaming", price: 4200000,
    image: "/images/products/gigabyte-b650m-gaming.png", brand: "Gigabyte", category: "mainboard", countInStock: 15,
    specs: { socket: "AM5", chipset: "B650", form_factor: "mATX", ram_type: "DDR5", ram_slots: 4, max_ram: 128 }
  },

  // ==================== RAM (10 Sản phẩm) ====================
  {
    name: "Corsair Vengeance RGB 16GB DDR5 6000MHz", slug: "corsair-vengeance-ddr5-16gb", price: 3700000,
    image: "/images/products/corsair-vengeance-lpx-8gb.png", brand: "Corsair", category: "ram", countInStock: 25,
    specs: { type: "DDR5", capacity: 16, speed: 6000, kit: "16GB", cas_latency: 36 }
  },
  {
    name: "Corsair Vengeance RGB 8GB DDR4 3200MHz", slug: "corsair-vengeance-ddr4-8gb", price: 600000,
    image: "/images/products/corsair-vengeance-lpx-8gb.png", brand: "Corsair", category: "ram", countInStock: 25,
    specs: { type: "DDR4", capacity: 8, speed: 3200, kit: "8GB", cas_latency: 36 }
  },
  {
    name: "G.Skill Trident Z5 RGB 16GB DDR5 6400MHz", slug: "gskill-trident-z5-ddr5-16gb", price: 5100000,
    image: "/images/products/gskill-trident-z5-16gb.png", brand: "G.Skill", category: "ram", countInStock: 20,
    specs: { type: "DDR5", capacity: 16, speed: 6400, kit: "16GB", cas_latency: 32 }
  },
  {
    name: "Kingston Fury Beast 8GB DDR4 3200MHz", slug: "kingston-fury-ddr4-8gb", price: 1100000,
    image: "/images/products/ram-kingston-fury-beast-rgb-8gb-3200mhz-ddr4.png", brand: "Kingston", category: "ram", countInStock: 50,
    specs: { type: "DDR4", capacity: 8, speed: 3200, kit: "8GB", cas_latency: 16 }
  },
  {
    name: "TeamGroup T-Force Delta RGB 16GB DDR5 6000MHz", slug: "teamgroup-delta-ddr5-16gb", price: 6000000,
    image: "/images/products/teamgroup-tforce-delta-16gb.png", brand: "TeamGroup", category: "ram", countInStock: 30,
    specs: { type: "DDR5", capacity: 16, speed: 6000, kit: "16GB", cas_latency: 38 }
  },

  // ==================== PSU (6 Sản phẩm) ====================
  {
    name: "Corsair RM1000x 1000W 80 Plus Gold", slug: "corsair-rm1000x", price: 4500000,
    image: "/images/products/corsair-rm1000x.png", brand: "Corsair", category: "psu", countInStock: 10,
    specs: { wattage: 1000, efficiency: "80 Plus Gold", modular: "Full Modular" }
  },
  {
    name: "MSI MPG A850G PCIE5 850W Gold", slug: "msi-a850g", price: 3200000,
    image: "/images/products/msi-mpg-a850g.png", brand: "MSI", category: "psu", countInStock: 15,
    specs: { wattage: 850, efficiency: "80 Plus Gold", modular: "Full Modular" }
  },
  {
    name: "Asus ROG Thor 1200W Platinum II", slug: "asus-rog-thor-1200", price: 9500000,
    image: "/images/products/asus-rog-thor-1200.png", brand: "Asus", category: "psu", countInStock: 5,
    specs: { wattage: 1200, efficiency: "80 Plus Platinum", modular: "Full Modular" }
  },
  {
    name: "Cooler Master MWE 750W Bronze V2", slug: "cm-mwe-750", price: 1800000,
    image: "/images/products/cooler-master-mwe-550w.png", brand: "Cooler Master", category: "psu", countInStock: 30,
    specs: { wattage: 750, efficiency: "80 Plus Bronze", modular: "Non Modular" }
  },
  {
    name: "Corsair CV650 650W Bronze", slug: "corsair-cv650", price: 1250000,
    image: "/images/products/Corsair-CV650-650W-80-Plus-Bronze.png", brand: "Corsair", category: "psu", countInStock: 40,
    specs: { wattage: 650, efficiency: "80 Plus Bronze", modular: "Non Modular" }
  },
  {
    name: "Deepcool PK550D 550W Bronze", slug: "deepcool-pk550d", price: 990000,
    image: "/images/products/deepcool-pk550d.png", brand: "Deepcool", category: "psu", countInStock: 50,
    specs: { wattage: 550, efficiency: "80 Plus Bronze", modular: "Non Modular" }
  },

  // ==================== CASE (5 Sản phẩm) ====================
  {
    name: "NZXT H9 Flow White", slug: "nzxt-h9-flow", price: 4200000,
    image: "/images/products/nzxt-h9-flow.png", brand: "NZXT", category: "case", countInStock: 8,
    specs: { form_factor: "Mid Tower", supported_motherboards: ["ATX", "mATX", "ITX"], max_gpu_length: 435, color: "White" }
  },
  {
    name: "Lian Li O11 Dynamic EVO Black", slug: "lianli-o11d-evo", price: 4000000,
    image: "/images/products/lianli-o11d-evo.png", brand: "Lian Li", category: "case", countInStock: 10,
    specs: { form_factor: "Mid Tower", supported_motherboards: ["E-ATX", "ATX", "mATX"], max_gpu_length: 426, color: "Black" }
  },
  {
    name: "Corsair 4000D Airflow", slug: "corsair-4000d", price: 2100000,
    image: "/images/products/corsair-4000d.png", brand: "Corsair", category: "case", countInStock: 25,
    specs: { form_factor: "Mid Tower", supported_motherboards: ["ATX", "mATX"], max_gpu_length: 360, color: "Black" }
  },
  {
    name: "Montech AIR 1000 Premium", slug: "montech-air-1000", price: 1500000,
    image: "/images/products/montech-air-1000.png", brand: "Montech", category: "case", countInStock: 20,
    specs: { form_factor: "Mid Tower", supported_motherboards: ["ATX", "mATX"], max_gpu_length: 340, color: "White" }
  },
  {
    name: "Xigmatek Gaming X 3F", slug: "xigmatek-gaming-x", price: 850000,
    image: "/images/products/xigmatek-gaming-x.png", brand: "Xigmatek", category: "case", countInStock: 40,
    specs: { form_factor: "Mid Tower", supported_motherboards: ["ATX", "mATX"], max_gpu_length: 320, color: "Black" }
  },

  // ==================== COOLER (4 Sản phẩm) ====================
  {
    name: "NZXT Kraken Elite 360 RGB", slug: "nzxt-kraken-360", price: 7500000,
    image: "/images/products/nzxt-kraken-360.png", brand: "NZXT", category: "cooler", countInStock: 10,
    specs: { type: "AIO Liquid", size: 360, socket_support: ["LGA1700", "AM5"], color: "Black" }
  },
  {
    name: "Thermalright Peerless Assassin 120 SE", slug: "pa120-se", price: 900000,
    image: "/images/products/pa120-se.png", brand: "Thermalright", category: "cooler", countInStock: 50,
    specs: { type: "Air Cooler", size: 120, socket_support: ["LGA1700", "AM5", "AM4"], color: "Silver" }
  },
  {
    name: "Deepcool LT720 360mm", slug: "deepcool-lt720", price: 3100000,
    image: "/images/products/deepcool-lt720.png", brand: "Deepcool", category: "cooler", countInStock: 20,
    specs: { type: "AIO Liquid", size: 360, socket_support: ["LGA1700", "AM5"], color: "Black" }
  },
  {
    name: "ID-Cooling SE-214-XT ARGB", slug: "se-214-xt", price: 450000,
    image: "/images/products/se-214-xt.png", brand: "ID-Cooling", category: "cooler", countInStock: 60,
    specs: { type: "Air Cooler", size: 120, socket_support: ["LGA1700", "AM4", "AM5"], color: "Black" }
  },

  // ==================== STORAGE (2 Sản phẩm mẫu) ====================
  {
    name: "Samsung 980 Pro 1TB", slug: "samsung-980-pro-1tb", price: 2500000,
    image: "/images/products/samsung-980-pro-1tb-m-2-nvme.png", brand: "Samsung", category: "storage", countInStock: 50,
    specs: { type: "SSD", interface: "M.2 NVMe Gen 4", capacity: 1024, read_speed: 7000, write_speed: 5000 }
  },
  {
    name: "Seagate Barracuda 2TB", slug: "seagate-barracuda-2tb", price: 1200000,
    image: "/images/products/hdd_seagate_baracuda_2tb.png", brand: "Seagate", category: "storage", countInStock: 50,
    specs: { type: "HDD", interface: "SATA 3.5\"", capacity: 2048, rpm: 7200, cache: 256 }
  }
];

module.exports = Products;