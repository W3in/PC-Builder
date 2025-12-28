const Products = [
  // --- CPU (INTEL) ---
  {
    name: "Intel Core i5-12400F",
    slug: "intel-core-i5-12400f",
    price: 3500000,
    image: "/images/products/cpu-intel-core-i5-12400f.png",
    brand: "Intel",
    category: "cpu",
    countInStock: 50,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      cores: "6",
      threads: "12",
      base_clock: "2.5 GHz",
      boost_clock: "4.4 GHz",
      tdp: "65W",
      series: "Core i5",
    }
  },
  {
    name: "Intel Core i9-13900K",
    slug: "intel-core-i9-13900k",
    price: 14500000,
    image: "/images/products/cpu-intel-core-i9-13900k.png",
    brand: "Intel",
    category: "cpu",
    countInStock: 20,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      cores: "24",
      threads: "32",
      base_clock: "3.0 GHz",
      boost_clock: "5.8 GHz",
      tdp: "125W",
      series: "Core i9",
    }
  },
  {
    name: "Intel Core i7-13700K",
    slug: "intel-core-i7-13700k",
    price: 10500000,
    image: "/images/products/intel-core-i7-13700k.png",
    brand: "Intel",
    category: "cpu",
    countInStock: 15,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      cores: "16",
      threads: "24",
      base_clock: "3.4 GHz",
      boost_clock: "5.4 GHz",
      tdp: "125W",
      series: "Core i7",
    }
  },
  {
    name: "Intel Core i3-12100F",
    slug: "intel-core-i3-12100f",
    price: 2400000,
    image: "/images/products/intel-core-i3-12100f.png",
    brand: "Intel",
    category: "cpu",
    countInStock: 30,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      cores: "4",
      threads: "8",
      base_clock: "3.3 GHz",
      boost_clock: "4.3 GHz",
      tdp: "58W",
      series: "Core i3",
    }
  },

  // --- CPU (AMD) ---
  {
    name: "AMD Ryzen 9 7950X",
    slug: "amd-ryzen-9-7950x",
    price: 13900000,
    image: "/images/products/cpu-amd-ryzen-9-7950x.png",
    brand: "AMD",
    category: "cpu",
    countInStock: 10,
    specs: {
      socket: "AM5 (Ryzen 7000/9000)",
      cores: "16",
      threads: "32",
      base_clock: "4.5 GHz",
      boost_clock: "5.7 GHz",
      tdp: "170W",
      series: "Ryzen 9",
    }
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    slug: "amd-ryzen-7-7800x3d",
    price: 11000000,
    image: "/images/products/amd-ryzen-7-7800x3d.png",
    brand: "AMD",
    category: "cpu",
    countInStock: 12,
    specs: {
      socket: "AM5 (Ryzen 7000/9000)",
      cores: "8",
      threads: "16",
      base_clock: "4.2 GHz",
      boost_clock: "5.0 GHz",
      tdp: "120W",
      series: "Ryzen 7",
    }
  },
  {
    name: "AMD Ryzen 5 7600X",
    slug: "amd-ryzen-5-7600x",
    price: 5900000,
    image: "/images/products/amd-ryzen-5-7600x.png",
    brand: "AMD",
    category: "cpu",
    countInStock: 25,
    specs: {
      socket: "AM5 (Ryzen 7000/9000)",
      cores: "6",
      threads: "12",
      base_clock: "4.7 GHz",
      boost_clock: "5.3 GHz",
      tdp: "105W",
      series: "Ryzen 5",
    }
  },

  // --- MAINBOARD ---
  {
    name: "ASUS TUF GAMING B660M-PLUS D4",
    slug: "asus-tuf-b660m-plus-d4",
    price: 3200000,
    image: "/images/products/ASUS-TUF-GAMING-B660M-PLUS D4.png",
    brand: "Asus",
    category: "mainboard",
    countInStock: 5,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      chipset: "B660",
      form_factor: "mATX (Micro ATX)",
      ram_type: "DDR4",
      ram_slots: "4",
      max_ram: "128GB",
      m2_slots: "2",
      sata_slots: "4",
      pci_slots: "2"
    }
  },
  {
    name: "ASUS ROG MAXIMUS Z790 HERO",
    slug: "asus-rog-maximus-z790",
    price: 16000000,
    image: "/images/products/asus-rog-maximus-z790-hero-ddr5-4.png",
    brand: "Asus",
    category: "mainboard",
    countInStock: 8,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      chipset: "Z790",
      form_factor: "ATX",
      ram_type: "DDR5",
      ram_slots: "4",
      max_ram: "128GB",
      m2_slots: "3",
      sata_slots: "6",
      pci_slots: "2"
    }
  },
  {
    name: "ASUS H610M-K D4",
    slug: "asus-h610m-k",
    price: 1700000,
    image: "/images/products/asus-prime-h610m-ddr4.png",
    brand: "Asus",
    category: "mainboard",
    countInStock: 20,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      chipset: "H610",
      form_factor: "mATX (Micro ATX)",
      ram_type: "DDR4",
      ram_slots: "2",
      max_ram: "64GB",
      m2_slots: "1",
      sata_slots: "4",
      pci_slots: "1"
    }
  },
  {
    name: "MSI MAG B660M MORTAR WIFI DDR4",
    slug: "msi-mag-b660m-mortar-wifi-ddr4",
    price: 4200000,
    image: "/images/products/msi-mag-b660m-mortar.png",
    brand: "MSI",
    category: "mainboard",
    countInStock: 10,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      chipset: "B660",
      form_factor: "mATX (Micro ATX)",
      ram_type: "DDR4",
      ram_slots: "4",
      max_ram: "128GB",
      m2_slots: "2",
      sata_slots: "6",
      pci_slots: "2"
    }
  },
  {
    name: "Gigabyte Z790 AORUS ELITE AX",
    slug: "gigabyte-z790-aorus-elite-ax",
    price: 7500000,
    image: "/images/products/gigabyte-z790-aorus.png",
    brand: "Gigabyte",
    category: "mainboard",
    countInStock: 12,
    specs: {
      socket: "LGA1700 (Alder/Raptor Lake)",
      chipset: "Z790",
      form_factor: "ATX",
      ram_type: "DDR5",
      ram_slots: "4",
      max_ram: "192GB",
      m2_slots: "4",
      sata_slots: "6",
      pci_slots: "3"
    }
  },
  {
    name: "ASUS ROG STRIX B650-A GAMING WIFI",
    slug: "asus-rog-strix-b650-a-gaming-wifi",
    price: 6800000,
    image: "/images/products/asus-rog-strix-b650-a.png",
    brand: "Asus",
    category: "mainboard",
    countInStock: 7,
    specs: {
      socket: "AM5 (Ryzen 7000/9000)",
      chipset: "B650",
      form_factor: "ATX",
      ram_type: "DDR5",
      ram_slots: "4",
      max_ram: "128GB",
      m2_slots: "3",
      sata_slots: "4",
      pci_slots: "2"
    }
  },

  // --- RAM ---
  {
    name: "Kingston Fury Beast 8GB 3200MHz DDR4",
    slug: "kingston-fury-8gb-ddr4",
    price: 650000,
    image: "/images/products/ram-kingston-fury-beast-rgb-8gb-3200mhz-ddr4.png",
    brand: "Kingston",
    category: "ram",
    countInStock: 50,
    specs: {
      type: "DDR4",
      capacity: "8GB",
      bus: "3200MHz",
      cas_latency: "16"
    }
  },
  {
    name: "Corsair Vengeance LPX 8GB DDR4 3200MHz",
    slug: "corsair-vengeance-lpx-8gb-ddr4-3200",
    price: 1100000,
    image: "/images/products/corsair-vengeance-lpx-8gb.png",
    brand: "Corsair",
    category: "ram",
    countInStock: 40,
    specs: {
      type: "DDR4",
      capacity: "8GB",
      bus: "3200MHz",
      cas_latency: "16"
    }
  },
  {
    name: "G.Skill Trident Z5 RGB 16GB DDR5 6000MHz",
    slug: "gskill-trident-z5-rgb-16gb-ddr5-6000",
    price: 3500000,
    image: "/images/products/gskill-trident-z5-16gb.png",
    brand: "G.Skill",
    category: "ram",
    countInStock: 25,
    specs: {
      type: "DDR5",
      capacity: "16GB",
      bus: "6000MHz",
      cas_latency: "30"
    }
  },
  {
    name: "TeamGroup T-Force Delta RGB 16GB DDR5 5600MHz",
    slug: "teamgroup-tforce-delta-16gb-ddr5",
    price: 1600000,
    image: "/images/products/teamgroup-tforce-delta-16gb.png",
    brand: "TeamGroup",
    category: "ram",
    countInStock: 30,
    specs: {
      type: "DDR5",
      capacity: "16GB",
      bus: "5600MHz",
      cas_latency: "32"
    }
  },

  // --- GPU (VGA) ---
  {
    name: "Gigabyte GeForce RTX 3060 Gaming OC 12G",
    slug: "gigabyte-rtx-3060-gaming-oc-12g",
    price: 7900000,
    image: "/images/products/gigabyte-rtx-3060.png",
    brand: "Gigabyte",
    category: "gpu",
    countInStock: 20,
    specs: {
      chipset: "NVIDIA",
      series: "RTX 3060",
      vram: "12GB",
      boost_clock: "1837 MHz",
      length: "282 mm"
    }
  },
  {
    name: "ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB",
    slug: "asus-rog-strix-rtx-4090-24g",
    price: 55000000,
    image: "/images/products/asus-rog-strix-rtx-4090.png",
    brand: "Asus",
    category: "gpu",
    countInStock: 3,
    specs: {
      chipset: "NVIDIA",
      series: "RTX 4090",
      vram: "24GB",
      boost_clock: "2640 MHz",
      length: "357.6 mm"
    }
  },
  {
    name: "MSI Radeon RX 7600 MECH 2X 8G",
    slug: "msi-radeon-rx-7600-mech-2x-8g",
    price: 7500000,
    image: "/images/products/msi-rx-6600-mech.png",
    brand: "MSI",
    category: "gpu",
    countInStock: 25,
    specs: {
      chipset: "AMD",
      series: "RX 7600",
      vram: "8GB",
      boost_clock: "2655 MHz",
      length: "235 mm"
    }
  },

  // --- PSU (NGUỒN) ---
  {
    name: "Corsair CV650 650W 80 Plus Bronze",
    slug: "corsair-cv650",
    price: 1200000,
    image: "/images/products/Corsair-CV650-650W-80-Plus-Bronze.png",
    brand: "Corsair",
    category: "psu",
    countInStock: 10,
    specs: {
      wattage: "650W",
      efficiency: "80 Plus Bronze",
      modular: "Non Modular"
    }
  },
  {
    name: "MSI MPG A850G PCIE5 850W Gold",
    slug: "msi-mpg-a850g-pcie5-850w",
    price: 3200000,
    image: "/images/products/msi-mpg-a850g.png",
    brand: "MSI",
    category: "psu",
    countInStock: 20,
    specs: {
      wattage: "850W",
      efficiency: "80 Plus Gold",
      modular: "Full Modular"
    }
  },
  {
    name: "Cooler Master MWE Bronze 550W V2",
    slug: "cooler-master-mwe-bronze-550w",
    price: 1100000,
    image: "/images/products/cooler-master-mwe-550w.png",
    brand: "Cooler Master",
    category: "psu",
    countInStock: 40,
    specs: {
      wattage: "550W",
      efficiency: "80 Plus Bronze",
      modular: "Non Modular"
    }
  },

  // --- STORAGE (SSD/HDD) ---
  {
    name: "Samsung 980 Pro 1TB",
    slug: "samsung-980-pro-1tb",
    price: 2500000,
    image: "/images/products/samsung-980-pro-1tb-m-2-nvme.png",
    brand: "Samsung",
    countInStock: 50,
    category: "storage",
    specs: {
      type: "SSD",
      interface: "M.2 NVMe Gen 4",
      capacity: "1TB",
      read_speed: "7000 MB/s",
      write_speed: "5000 MB/s"
    }
  },
  {
    name: "Seagate Barracuda 2TB",
    slug: "seagate-barracuda-2tb",
    price: 1200000,
    image: "/images/products/hdd_seagate_baracuda_2tb.png",
    brand: "Seagate",
    countInStock: 50,
    category: "storage",
    specs: {
      type: "HDD",
      interface: "SATA 3.5\"",
      capacity: "2TB",
      rpm: "7200 RPM",
      cache: "256MB"
    }
  }
];

module.exports = Products;