const USAGE_RATIOS = {
    gaming: {
        cpu: 0.20,
        mainboard: 0.12,
        ram: 0.10,
        gpu: 0.40,
        ssd: 0.05,
        hdd: 0.03,
        psu: 0.05,
        case: 0.05,
        cooler: 0.03
    },
    office: {
        cpu: 0.35,
        mainboard: 0.15,
        ram: 0.15,
        gpu: 0,
        ssd: 0.15,
        hdd: 0.10,
        psu: 0.05,
        case: 0.05,
        cooler: 0
    },
    workstation: {
        cpu: 0.30,
        mainboard: 0.15,
        ram: 0.20,
        gpu: 0.20,
        ssd: 0.10,
        hdd: 0,
        psu: 0.10,
        case: 0.05,
        cooler: 0.10
    },
    streaming: {
        cpu: 0.25,
        mainboard: 0.12,
        ram: 0.13,
        gpu: 0.35,
        ssd: 0.05,
        hdd: 0.05,
        psu: 0.08,
        case: 0.07,
        cooler: 0.05
    }
};

export const getRecommendedPrice = (totalBudget, componentType, usage = 'gaming') => {
    const ratios = USAGE_RATIOS[usage] || USAGE_RATIOS.gaming;

    const ratio = ratios[componentType] || 0.05;

    return totalBudget * ratio;
};

export const getUsageList = (t) => [
    { id: 'gaming', label: t ? t('builder.usage.gaming') : 'Gaming' },
    { id: 'office', label: t('builder.usage.office') },
    { id: 'workstation', label: t('builder.usage.workstation') },
    { id: 'streaming', label: t('builder.usage.streaming') },
];