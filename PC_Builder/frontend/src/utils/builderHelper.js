export const generateSlots = (buildState, t) => {
    const mainboard = buildState['mainboard'];

    const ramSlots = mainboard?.specs?.ram_slots || 2;
    const cpuSockets = mainboard?.specs?.cpu_sockets || 1;
    const gpuSlots = mainboard?.specs?.pci_slots || 1;

    let slots = [];

    for (let i = 0; i < cpuSockets; i++) {
        slots.push({
            key: `cpu_${i}`,
            type: 'cpu',
            label: i === 0 ? t('builder.slots.cpu') : t('builder.slots.cpu_n', { number: i + 1 })
        });
    }

    slots.push({ key: 'mainboard', type: 'mainboard', label: t('builder.slots.mainboard') });

    for (let i = 0; i < cpuSockets; i++) {
        slots.push({
            key: `cooler_${i}`,
            type: 'cooler',
            label: i === 0 ? t('builder.slots.cooler') : t('builder.slots.cooler_n', { number: i + 1 })
        });
    }

    for (let i = 0; i < ramSlots; i++) {
        slots.push({
            key: `ram_${i}`,
            type: 'ram',
            label: t('builder.slots.ram', { number: i + 1 })
        });
    }

    for (let i = 0; i < gpuSlots; i++) {
        slots.push({
            key: `gpu_${i}`,
            type: 'gpu',
            label: i === 0 ? t('builder.slots.gpu') : t('builder.slots.gpu_n', { number: i + 1 })
        });
    }

    slots.push({ key: 'storage_0', type: 'storage', label: t('builder.slots.storage_os') });
    slots.push({ key: 'storage_1', type: 'storage', label: t('builder.slots.storage_data') });
    slots.push({ key: 'storage_2', type: 'storage', label: t('builder.slots.storage_data') });

    slots.push({ key: 'psu', type: 'psu', label: t('builder.slots.psu') });
    slots.push({ key: 'case', type: 'case', label: t('builder.slots.case') });

    return slots;
};



export const groupComponents = (rawSlots, buildState) => {
    const grouped = [];
    const processedKeys = new Set();

    rawSlots.forEach((slot) => {
        if (processedKeys.has(slot.key)) return;

        const product = buildState[slot.key];

        if (!product) {
            grouped.push({
                ...slot,
                product: null,
                qty: 0,
                slotKeys: [slot.key]
            });
            return;
        }

        const sameProductKeys = [slot.key];


        rawSlots.forEach((otherSlot) => {
            if (otherSlot.key !== slot.key && otherSlot.type === slot.type && !processedKeys.has(otherSlot.key)) {
                const otherProduct = buildState[otherSlot.key];
                if (otherProduct && otherProduct._id === product._id) {
                    sameProductKeys.push(otherSlot.key);
                    processedKeys.add(otherSlot.key);
                }
            }
        });

        grouped.push({
            ...slot,
            product: product,
            qty: sameProductKeys.length,
            slotKeys: sameProductKeys,
            totalPrice: product.price * sameProductKeys.length
        });

        processedKeys.add(slot.key);
    });

    return grouped;
};

export const analyzeBuild = (cartItems, t) => {
    const report = {
        errors: [],
        warnings: [],
        tips: [],
        stats: {
            totalTDP: 0,
            estimatedWattage: 0,
            bottleneckStatus: t ? t('builder.analysis.calculating') : "Calculating..."
        }
    };

    const cpu = cartItems.find(i => i.category === 'cpu');
    const main = cartItems.find(i => i.category === 'mainboard');
    const gpu = cartItems.find(i => i.category === 'gpu');
    const ramList = cartItems.filter(i => i.category === 'ram');
    const psu = cartItems.find(i => i.category === 'psu');
    const casePc = cartItems.find(i => i.category === 'case');
    const cooler = cartItems.find(i => i.category === 'cooler');

    if (cpu && main) {
        if (cpu.specs?.socket !== main.specs?.socket) {
            report.errors.push(`${t('builder.analysis.error_socket')} ${t('category.cpu')} (${cpu.specs?.socket}) ${t('builder.analysis.and')} ${t('category.mainboard')} (${main.specs?.socket})`);
        }
    }

    if (main && ramList.length > 0) {
        const ramType = ramList[0].specs?.type;
        const mainRamType = main.specs?.ram_type;

        if (ramType && mainRamType && ramType !== mainRamType) {
            report.errors.push(`${t('builder.analysis.error_ram_match')} ${t('category.ram')} (${ramType}) ${t('builder.analysis.and')} ${t('category.mainboard')} (${mainRamType})`);
        }
    }

    if (casePc && main) {
        const supported = casePc.specs?.supported_motherboards || [];
        const mainForm = main.specs?.form_factor;

        const supportedArr = Array.isArray(supported) ? supported : [supported];

        if (mainForm && !supportedArr.includes(mainForm)) {
            report.errors.push(`${t('builder.analysis.error_case_size')} ${t('builder.analysis.case_support')} [${supportedArr.join(', ')}] ${t('builder.analysis.main_size')} (${mainForm})`);
        }
    }

    if (casePc && gpu) {
        const maxLen = casePc.specs?.max_gpu_length || 300;
        const gpuLen = gpu.specs?.length || 250;

        if (gpuLen > maxLen) {
            report.errors.push(`${t('builder.analysis.error_gpu_length')} (${gpuLen}mm). ${t('builder.analysis.case_support2')} ${maxLen}mm.`);
        }
    }

    let totalTDP = 0;
    if (cpu?.specs?.tdp) totalTDP += Number(cpu.specs.tdp);
    if (gpu?.specs?.tdp) totalTDP += Number(gpu.specs.tdp);

    totalTDP += (ramList.length * 5);
    totalTDP += 50;

    report.stats.totalTDP = totalTDP;
    report.stats.estimatedWattage = Math.ceil(totalTDP * 1.1);

    if (psu) {
        const psuWattage = Number(psu.specs?.wattage || 0);
        if (psuWattage < report.stats.estimatedWattage) {
            report.errors.push(t('builder.analysis.error_psu_weak', { wattage: psuWattage, need: report.stats.estimatedWattage }) || `Nguồn ${psuWattage}W quá yếu.`);
        } else if (psuWattage < report.stats.estimatedWattage + 100) {
            report.warnings.push(t('builder.analysis.warn_psu_tight') || "Nguồn hơi sát tải.");
        }
    } else {
        if (totalTDP > 0) {
            report.tips.push(`${t('builder.analysis.psu_used')} ${report.stats.estimatedWattage}W. ${t('builder.analysis.psu_recommended')} ${Math.ceil(report.stats.estimatedWattage * 1.2)}W ${t('builder.analysis.psu_upto')}`);
        }
    }

    if (cpu && gpu) {
        const cpuScore = Number(cpu.specs?.performance_score || 0);
        const gpuScore = Number(gpu.specs?.performance_score || 0);

        if (cpuScore > 0 && gpuScore > 0) {
            const ratio = cpuScore / gpuScore;

            if (ratio < 0.8) {
                report.stats.bottleneckStatus = t('builder.analysis.status_cpu_weak') || "Bottleneck: CPU Yếu";
                report.warnings.push(`${t('builder.analysis.warn_bottleneck_cpu')} ${t('category.cpu')} ${cpu.name} ${t('builder.analysis.warn_bottleneck_cpu1')} ${gpu.name}. ${t('builder.analysis.warn_bottleneck_cpu2')}`);
            } else if (ratio > 1.5) {
                report.stats.bottleneckStatus = t('builder.analysis.status_gpu_weak') || "Bottleneck: GPU Yếu";
                report.tips.push(`t('builder.analysis.warn_bottleneck_cpu')`);
            } else {
                report.stats.bottleneckStatus = t('builder.analysis.status_balanced') || "Cân bằng tốt";
                report.tips.push(`t('builder.analysis.tip_balanced')`);
            }
        }
    }

    return report;
};