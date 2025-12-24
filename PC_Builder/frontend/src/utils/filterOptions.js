export const FILTER_OPTIONS = {
    cpu: [
        { label: "Manufacturer", key: "brand", options: ["Intel", "AMD"] },
        { label: "Socket", key: "socket", options: ["LGA1700", "LGA1851", "AM5", "AM4"] },
        { label: "Series", key: "series", options: ["Core Ultra", "Core i9", "Core i7", "Core i5", "Ryzen 9", "Ryzen 7", "Ryzen 5"] }
    ],
    mainboard: [
        { label: "Manufacturer", key: "brand", options: ["Asus", "MSI", "Gigabyte", "ASRock"] },
        { label: "Socket", key: "socket", options: ["LGA1700", "LGA1851", "AM5", "AM4"] },
        { label: "Form Factor", key: "form_factor", options: ["ATX", "mATX", "E-ATX", "ITX"] },
        { label: "RAM Type", key: "ram_type", options: ["DDR4", "DDR5"] },
        { label: "Chipset", key: "chipset", options: ["Z790", "B760", "Z690", "X670/X670E", "B650/B650E", "B550"] }
    ],
    ram: [
        { label: "Manufacturer", key: "brand", options: ["Corsair", "G.Skill", "Kingston", "Adata", "TeamGroup"] },
        { label: "Type", key: "type", options: ["DDR5", "DDR4"] },
        { label: "Capacity", key: "capacity", options: ["16GB (2x8GB)", "32GB (2x16GB)", "64GB (2x32GB)", "16GB (1 stick)", "8GB (1 stick)"] },
        { label: "Bus Speed", key: "bus", options: ["3200MHz", "3600MHz", "5200MHz", "5600MHz", "6000MHz", "6400MHz+"] }
    ],
    gpu: [
        { label: "Manufacturer", key: "brand", options: ["Asus", "MSI", "Gigabyte", "Zotac", "Colorful", "Galax"] },
        { label: "Chipset", key: "chipset", options: ["NVIDIA", "AMD"] },
        {
            label: "Series", key: "series", options: [
                "RTX 4090", "RTX 4080 Super", "RTX 4070 Ti Super", "RTX 4070 Super", "RTX 4060 Ti", "RTX 3060",
                "RX 7900 XTX", "RX 7800 XT", "RX 7700 XT", "RX 7600"
            ]
        },
        { label: "VRAM", key: "vram", options: ["8GB", "12GB", "16GB", "20GB", "24GB"] }
    ],
    psu: [
        { label: "Manufacturer", key: "brand", options: ["Corsair", "Seasonic", "MSI", "Cooler Master", "Thermaltake", "Deepcool"] },
        { label: "Wattage", key: "wattage", options: ["550W - 650W", "750W", "850W", "1000W", "1200W+"] },
        { label: "Efficiency", key: "efficiency", options: ["80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum"] },
        { label: "Modular", key: "modular", options: ["Full Modular", "Semi Modular", "Non Modular"] }
    ],
    storage: [
        { label: "Type", key: "type", options: ["SSD", "HDD"] },
        { label: "Capacity", key: "capacity", options: ["250GB", "500GB", "1TB", "2TB", "4TB", "6TB+"] },
        { label: "Interface", key: "interface", options: ["M.2 NVMe", "SATA 2.5\"", "SATA 3.5\""] },
        { label: "Brand", key: "brand", options: ["Samsung", "Western Digital", "Kingston", "Seagate", "Lexar", "Crucial"] },
    ],
    cooler: [
        { label: "Manufacturer", key: "brand", options: ["Thermalright", "Deepcool", "NZXT", "Corsair", "Cooler Master", "Noctua"] },
        { label: "Type", key: "type", options: ["Air Cooler (Tản khí)", "AIO Liquid (Tản nước AIO)"] },
        { label: "Size (AIO)", key: "size", options: ["240mm", "280mm", "360mm", "420mm"] },
        { label: "Color", key: "color", options: ["Black", "White"] }
    ],
    case: [
        { label: "Manufacturer", key: "brand", options: ["NZXT", "Corsair", "Montech", "Lian Li", "Hyte", "Deepcool"] },
        { label: "Form Factor", key: "form_factor", options: ["Mid Tower", "Full Tower", "Mini ITX"] },
        { label: "Color", key: "color", options: ["Black", "White"] }
    ]
};