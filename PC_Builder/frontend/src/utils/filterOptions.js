export const FILTER_OPTIONS = {
    cpu: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Intel", "AMD"]
        },
        {
            label: "Socket",
            key: "socket",
            options: [
                "LGA1851 (Arrow Lake)", "LGA1700 (Alder/Raptor Lake)", "LGA1200", "LGA2066",
                "AM5 (Ryzen 7000/9000)", "AM4 (Ryzen 5000)", "sTR5 (Threadripper)"
            ]
        },
        {
            label: "Series",
            key: "series",
            options: [
                "Core Ultra 9", "Core Ultra 7", "Core Ultra 5",
                "Core i9", "Core i7", "Core i5", "Core i3",
                "Ryzen 9", "Ryzen 7", "Ryzen 5", "Ryzen 3", "Threadripper"
            ]
        },
        {
            label: "Cores",
            key: "cores",
            options: ["4", "6", "8", "10", "12", "14", "16", "20", "24"]
        },
        {
            label: "Threads",
            key: "threads",
            options: ["4", "6", "8", "10", "12", "14", "16", "20", "24"]
        }
    ],
    mainboard: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Asus", "MSI", "Gigabyte", "ASRock", "NZXT", "EVGA", "Biostar"]
        },
        {
            label: "Socket",
            key: "socket",
            options: ["LGA1851", "LGA1700", "LGA1200", "AM5", "AM4"]
        },
        {
            label: "Chipset",
            key: "chipset",
            options: [
                "Z890", "B860", "Z790", "B760", "Z690", "B660", "H610",
                "X870E", "X870", "X670E", "X670", "B650E", "B650", "A620", "X570", "B550"
            ]
        },
        {
            label: "Form Factor",
            key: "form_factor",
            options: ["E-ATX", "ATX", "mATX (Micro ATX)", "Mini ITX"]
        },
        {
            label: "RAM Type",
            key: "ram_type",
            options: ["DDR5", "DDR4"]
        }
    ],
    ram: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Corsair", "G.Skill", "Kingston", "TeamGroup", "ADATA", "Crucial", "Patriot", "Lexar", "PNY"]
        },
        {
            label: "Type",
            key: "type",
            options: ["DDR5", "DDR4"]
        },
        {
            label: "Capacity Config",
            key: "capacity",
            options: [
                "16GB (2x8GB)", "32GB (2x16GB)", "64GB (2x32GB)", "96GB (2x48GB)",
                "8GB", "16GB", "32GB", "64GB"
            ]
        },
        {
            label: "Bus Speed",
            key: "bus",
            options: [
                "3200MHz", "3600MHz",
                "5200MHz", "5600MHz", "6000MHz", "6400MHz", "7200MHz", "8000MHz+"
            ]
        }
    ],
    gpu: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Asus", "MSI", "Gigabyte", "Zotac", "Colorful", "Galax", "PNY", "Sapphire", "PowerColor", "XFX", "ASRock", "Inno3D"]
        },
        {
            label: "Chipset Manufacturer",
            key: "chipset",
            options: ["NVIDIA", "AMD", "Intel"]
        },
        {
            label: "Series",
            key: "series",
            options: [
                "RTX 5090", "RTX 5080",
                "RTX 4090", "RTX 4080 Super", "RTX 4070 Ti Super", "RTX 4070 Super", "RTX 4060 Ti", "RTX 4060",
                "RTX 3060", "RTX 3050",
                "RX 7900 XTX", "RX 7900 XT", "RX 7800 XT", "RX 7700 XT", "RX 7600",
                "Intel Arc A770", "Intel Arc A750"
            ]
        },
        {
            label: "VRAM",
            key: "vram",
            options: ["8GB", "10GB", "12GB", "16GB", "20GB", "24GB"]
        }
    ],
    storage: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Samsung", "Western Digital", "Kingston", "Seagate", "Crucial", "Lexar", "Sabrent", "Corsair", "Gigabyte", "MSI"]
        },
        {
            label: "Type",
            key: "type",
            options: ["SSD", "HDD"]
        },
        {
            label: "Capacity",
            key: "capacity",
            options: ["250GB", "500GB", "1TB", "2TB", "4TB", "8TB+"]
        },
        {
            label: "Interface",
            key: "interface",
            options: ["M.2 NVMe Gen 5", "M.2 NVMe Gen 4", "M.2 NVMe Gen 3", "SATA 2.5\"", "SATA 3.5\""]
        }
    ],
    psu: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Corsair", "Seasonic", "MSI", "Asus", "Cooler Master", "Thermaltake", "Deepcool", "FSP", "NZXT", "Super Flower"]
        },
        {
            label: "Wattage",
            key: "wattage",
            options: ["550W", "650W", "750W", "850W", "1000W", "1200W", "1300W", "1600W+"]
        },
        {
            label: "Efficiency Rating",
            key: "efficiency",
            options: ["80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium"]
        },
        {
            label: "Modular",
            key: "modular",
            options: ["Full Modular", "Semi Modular", "Non Modular"]
        }
    ],
    cooler: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Thermalright", "Deepcool", "NZXT", "Corsair", "Cooler Master", "Noctua", "Arctic", "Lian Li", "Xigmatek", "ID-Cooling", "Valkyrie"]
        },
        {
            label: "Type",
            key: "type",
            options: ["Air Cooler", "AIO Liquid"]
        },
        {
            label: "Radiator Size",
            key: "size",
            options: ["120mm", "240mm", "280mm", "360mm", "420mm"]
        },
        {
            label: "Color",
            key: "color",
            options: ["Black", "White", "LCD Screen"]
        }
    ],
    case: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["NZXT", "Corsair", "Lian Li", "Hyte", "Montech", "Deepcool", "Phanteks", "Fractal Design", "Cooler Master", "Antec", "Thermaltake"]
        },
        {
            label: "Form Factor",
            key: "form_factor",
            options: ["Full Tower", "Mid Tower", "Mini Tower", "Mini ITX"]
        },
        {
            label: "Color",
            key: "color",
            options: ["Black", "White", "Black/Red"]
        },
        {
            label: "Side Panel",
            key: "side_panel",
            options: ["Tempered Glass", "Mesh", "Solid"]
        }
    ]
};