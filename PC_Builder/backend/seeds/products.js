const Products = [
  {
    name: "Intel Core i5-12400F",
    slug: "intel-core-i5-12400f",
    price: 3500000,
    image: "/images/products/cpu-intel-core-i5-12400f.png",
    brand: "Intel",
    category: "cpu",
    countInStock: 10,
    specs: {
      socket: "LGA1700",
      cores: 6,
      threads: 12,
      tdp: 65,
      integrated_gpu: false
    }
  },
  {
    name: "ASUS TUF GAMING B660M-PLUS D4",
    slug: "asus-tuf-b660m-plus-d4",
    price: 3200000,
    image: "/images/products/ASUS-TUF-GAMING-B660M-PLUS D4.png",
    brand: "Asus",
    category: "mainboard",
    countInStock: 5,
    specs: {
      socket: "LGA1700",
      ram_type: "DDR4",
      form_factor: "mATX",
      slots: 4
    }
  },
  {
    name: "Kingston Fury Beast 8GB 3200MHz DDR4",
    slug: "kingston-fury-8gb-ddr4",
    price: 650000,
    image: "/images/products/ram-kingston-fury-beast-rgb-8gb-3200mhz-ddr4.png",
    brand: "Kingston",
    category: "ram",
    countInStock: 20,
    specs: {
      type: "DDR4",
      capacity: 8,
      bus: 3200
    }
  },
  {
    name: "Corsair CV650 650W 80 Plus Bronze",
    slug: "corsair-cv650",
    price: 1200000,
    image: "/images/products/Corsair-CV650-650W-80-Plus-Bronze.png",
    brand: "Corsair",
    category: "psu",
    countInStock: 10,
    specs: {
      wattage: 650,
      efficiency: "Bronze"
    }
  },
  {
    name: "Intel Core i9-13900K",
    slug: "intel-core-i9-13900k",
    price: 14500000,
    image: "/images/products/cpu-intel-core-i9-13900k.png",
    brand: "Intel",
    category: "cpu",
    countInStock: 50,
    specs: {
      socket: "LGA1700",
      cores: "24",
      threads: "32",
      base_clock: "3.0 GHz",
      boost_clock: "5.8 GHz",
      series: "Core i9"
    }
  },
  {
    name: "AMD Ryzen 9 7950X",
    slug: "amd-ryzen-9-7950x",
    price: 13900000,
    image: "/images/products/cpu-amd-ryzen-9-7950x.png",
    brand: "AMD",
    category: "cpu",
    countInStock: 20,
    specs: {
      socket: "AM5",
      cores: "16",
      threads: "32",
      base_clock: "4.5 GHz",
      boost_clock: "5.7 GHz",
      series: "Ryzen 9"
    }
  },
  {
    name: "ASUS ROG MAXIMUS Z790 HERO",
    slug: "asus-rog-maximus-z790",
    price: 16000000,
    image: "/images/products/asus-rog-maximus-z790-hero-ddr5-4.png",
    brand: "Asus",
    category: "mainboard",
    countInStock: 10,
    specs: {
      socket: "LGA1700",
      chipset: "Z790",
      form_factor: "ATX",
      ram_type: "DDR5",
      max_ram: "128GB"
    }
  },
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
      interface: "NVMe",
      capacity: "1TB"
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
      rpm: "7200",
      capacity: "2TB"
    }
  }
];

module.exports = Products;