const sampleProducts = [
  {
    name: "Intel Core i5-12400F",
    slug: "intel-core-i5-12400f",
    price: 3500000,
    image: "/images/i5-12400f.jpg",
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
    image: "/images/b660m.jpg",
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
    image: "/images/ram-8gb.jpg",
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
    image: "/images/psu-650w.jpg",
    brand: "Corsair",
    category: "psu",
    countInStock: 10,
    specs: {
      wattage: 650,
      efficiency: "Bronze"
    }
  }
];

module.exports = sampleProducts;