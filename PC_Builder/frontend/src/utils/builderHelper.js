export const generateSlots = (buildState, t) => {
    const mainboard = buildState['mainboard'];

    const ramSlots = mainboard?.specs?.ram_slots || 2;
    const cpuSockets = mainboard?.specs?.cpu_sockets || 1;
    const gpuSlots = mainboard?.specs?.pci_slots || 1;

    let slots = [];

    // 1. CPU
    for (let i = 0; i < cpuSockets; i++) {
        slots.push({
            key: `cpu_${i}`,
            type: 'cpu',
            // Dùng t để dịch, truyền biến number vào
            label: i === 0 ? t('builder.slots.cpu') : t('builder.slots.cpu_n', { number: i + 1 })
        });
    }

    // 2. Mainboard
    slots.push({ key: 'mainboard', type: 'mainboard', label: t('builder.slots.mainboard') });

    // 3. Cooler
    for (let i = 0; i < cpuSockets; i++) {
        slots.push({
            key: `cooler_${i}`,
            type: 'cooler',
            label: i === 0 ? t('builder.slots.cooler') : t('builder.slots.cooler_n', { number: i + 1 })
        });
    }

    // 4. RAM
    for (let i = 0; i < ramSlots; i++) {
        slots.push({
            key: `ram_${i}`,
            type: 'ram',
            label: t('builder.slots.ram', { number: i + 1 })
        });
    }

    // 5. GPU
    for (let i = 0; i < gpuSlots; i++) {
        slots.push({
            key: `gpu_${i}`,
            type: 'gpu',
            label: i === 0 ? t('builder.slots.gpu') : t('builder.slots.gpu_n', { number: i + 1 })
        });
    }

    // 6. Storage
    slots.push({ key: 'storage_0', type: 'storage', label: t('builder.slots.storage_os') });
    slots.push({ key: 'storage_1', type: 'storage', label: t('builder.slots.storage_data') });
    slots.push({ key: 'storage_2', type: 'storage', label: t('builder.slots.storage_data') });

    // 7. PSU & Case
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