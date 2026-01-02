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
            options: ["LGA1851", "LGA1700", "LGA1200", "AM5", "AM4"]
        },
        {
            label: "Series",
            key: "series",
            options: ["Core i9", "Core i7", "Core i5", "Core i3", "Ryzen 9", "Ryzen 7", "Ryzen 5"]
        },
        {
            label: "Cores",
            key: "core_count",
            options: [4, 6, 8, 10, 12, 14, 16, 20, 24]
        },
    ],
    mainboard: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Asus", "MSI", "Gigabyte", "ASRock", "NZXT", "EVGA", "Biostar"]
        },
        {
            label: "Chipset",
            key: "chipset",
            options: ["Z790", "B760", "H610", "X670E", "B650", "X570", "B550"]
        },
        {
            label: "Socket",
            key: "socket",
            options: ["LGA1851", "LGA1700", "LGA1200", "AM5", "AM4"]
        },
        {
            label: "Form Factor",
            key: "form_factor",
            options: ["ATX", "mATX", "ITX"]
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
            options: [8, 16, 32, 64]
        },
        {
            label: "Bus Speed",
            key: "speed",
            options: [3200, 3600, 5200, 5600, 6000]
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
            options: [8, 10, 12, 16, 20, 24]
        }
    ],
    storage: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Samsung", "Western Digital", "Kingston", "Seagate", "Crucial", "Lexar", "Sabrent", "Corsair", "Gigabyte", "MSI"]
        },
        { label: "Type", key: "type", options: ["SSD", "HDD"] },
        { label: "Capacity(GB)", key: "capacity", options: [256, 512, 1024, 2048] },
        {
            label: "Interface",
            key: "interface",
            options: ["M.2 NVMe Gen 4", "M.2 NVMe Gen 3", "SATA 3.5\""]
        }
    ],
    psu: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Corsair", "Seasonic", "MSI", "Asus", "Cooler Master", "Thermaltake", "Deepcool", "FSP", "NZXT", "Super Flower", "be quiet!"]
        },
        {
            label: "Wattage",
            key: "wattage",
            options: [550, 650, 750, 850, 1000, 1200]
        },
        {
            label: "Efficiency Rating",
            key: "efficiency",
            options: ["80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium"]
        },
        {
            label: "Modular",
            key: "modular",
            options: ["Full Modular", "Non Modular"]
        }
    ],
    cooler: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["Thermalright", "Deepcool", "NZXT", "Corsair", "Cooler Master", "Noctua", "Arctic", "Lian Li", "Xigmatek", "ID-Cooling", "Valkyrie", "be quiet!"]
        },
        {
            label: "Type",
            key: "type",
            options: ["Air Cooler", "AIO Liquid"]
        },
        {
            label: "Size / Radiator",
            key: "size",
            options: [120, 240, 280, 360]
        },
        {
            label: "Color",
            key: "color",
            options: ["Black", "White", "Silver", "LCD Screen"]
        }
    ],
    case: [
        {
            label: "Manufacturer",
            key: "brand",
            options: ["NZXT", "Corsair", "Lian Li", "Hyte", "Montech", "Deepcool", "Phanteks", "Fractal Design", "Cooler Master", "Antec", "Thermaltake", "Xigmatek"]
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
    ],
    case_fans: [
        { label: "Manufacturer", key: "brand", options: ["Corsair", "Lian Li", "Noctua", "Arctic", "Cooler Master", "be quiet!", "NZXT", "Thermalright"] },
        { label: "Fan Size", key: "size", options: ["120mm", "140mm", "200mm", "80mm"] },
        { label: "Color", key: "color", options: ["black", "white", "RGB", "ARGB"] },
    ],
    thermal: [
        { label: "Manufacturer", key: "brand", options: ["Thermal Grizzly", "Arctic", "Noctua", "Cooler Master", "Deepcool"] },
        { label: "Type", key: "type", options: ["Paste", "Thermal Pad", "Liquid Metal"] }
    ],
    sound_card: [
        { label: "Manufacturer", key: "brand", options: ["Creative", "Asus", "EVGA"] },
        { label: "Interface", key: "interface", options: ["PCIe x1", "External USB"] },
        { label: "Channels", key: "channels", options: ["5.1", "7.1", "Stereo"] }
    ],
    wired_net: [
        { label: "Manufacturer", key: "brand", options: ["TP-Link", "Intel", "Asus", "D-Link"] },
        { label: "Speed", key: "speed", options: ["1 Gbps", "2.5 Gbps", "10 Gbps"] },
        { label: "Interface", key: "interface", options: ["PCIe", "USB 3.0"] }
    ],
    wifi_net: [
        { label: "Manufacturer", key: "brand", options: ["Asus", "TP-Link", "Gigabyte", "Netgear", "Intel"] },
        { label: "Standard", key: "standard", options: ["Wi-Fi 7", "Wi-Fi 6E", "Wi-Fi 6", "Wi-Fi 5"] },
        { label: "Interface", key: "interface", options: ["PCIe Card", "USB Dongle"] }
    ],
    headphones: [
        { label: "Manufacturer", key: "brand", options: ["Logitech", "Razer", "SteelSeries", "HyperX", "Corsair", "Sennheiser", "Audio-Technica", "Sony"] },
        { label: "Type", key: "type", options: ["Over-ear", "In-ear", "On-ear"] },
        { label: "Connectivity", key: "connectivity", options: ["wired", "Bluetooth", "wired/wireless"] }
    ],
    keyboard: [
        { label: "Manufacturer", key: "brand", options: ["Logitech", "Razer", "Corsair", "Keychron", "Akko", "SteelSeries", "Ducky"] },
        { label: "Switch Type", key: "switch_type", options: ["Mechanical", "Membrane", "Optical", "Low Profile"] },
        { label: "Size/Layout", key: "layout", options: ["Full Size (100%)", "TKL (80%)", "75%", "65%", "60%"] },
        { label: "Connectivity", key: "connectivity", options: ["wired", "wireless", "Bluetooth"] }
    ],
    mouse: [
        { label: "Manufacturer", key: "brand", options: ["Logitech", "Razer", "SteelSeries", "Zowie", "Glorious", "Corsair", "Pulsar"] },
        { label: "Connectivity", key: "connectivity", options: ["wired", "wireless", "wired/wireless"] },
        { label: "Sensor Type", key: "sensor", options: ["Optical", "Laser"] },
        { label: "Handedness", key: "handedness", options: ["right_handed", "Ambidextrous", "left_handed"] }
    ],
    speakers: [
        { label: "Manufacturer", key: "brand", options: ["Logitech", "Edifier", "Creative", "Razer", "Bose"] },
        { label: "Configuration", key: "config", options: ["2.0", "2.1", "5.1", "Soundbar"] }
    ],

    monitor: [
        { label: "Manufacturer", key: "brand", options: ["Dell", "LG", "Asus", "Samsung", "AOC", "MSI", "Gigabyte", "ViewSonic", "BenQ"] },
        { label: "Resolution", key: "resolution", options: ["1920 x 1080", "2560 x 1440", "3840 x 2160 (4K)", "3440 x 1440 (UW)"] },
        { label: "Refresh Rate", key: "refresh_rate", options: ["60Hz", "75Hz", "144Hz", "165Hz", "240Hz", "360Hz+"] },
        { label: "Panel Type", key: "panel_type", options: ["IPS", "VA", "TN", "OLED"] },
        { label: "Screen Size", key: "size", options: ["24\"", "27\"", "32\"", "34\"+", "Under 22\""] }
    ],
    webcam: [
        { label: "Manufacturer", key: "brand", options: ["Logitech", "Razer", "Elgato", "Microsoft"] },
        { label: "Resolution", key: "resolution", options: ["720p", "1080p", "4K"] }
    ],

    antivirus: [
        { label: "Manufacturer", key: "brand", options: ["Kaspersky", "Bitdefender", "Norton", "McAfee", "ESET"] },
        { label: "License", key: "license", options: ["1 Year", "2 Years", "Lifetime"] }
    ],
    os: [
        { label: "Manufacturer", key: "brand", options: ["Microsoft"] },
        { label: "Edition", key: "edition", options: ["Home", "Pro", "Enterprise"] },
        { label: "Version", key: "version", options: ["Windows 11", "Windows 10"] }
    ],
    prebuilt: [
        { label: "Usage", key: "usage", options: ["office", "gaming", "streaming", "workstation"] },
        { label: "Price Range", key: "price_range", options: ["under_15m", "range_15_30m", "above_30m"] }
    ]
};