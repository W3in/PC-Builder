export const BUDGET_RATIO = {
    cpu: 0.18,
    mainboard: 0.12,
    gpu: 0.35,
    ram: 0.08,
    ssd: 0.07,
    psu: 0.08,
    case: 0.05,
    cooler: 0.07
};

// Hàm tính giá gợi ý
export const getRecommendedPrice = (totalBudget, category) => {
    if (!totalBudget || totalBudget <= 0) return 0;
    const ratio = BUDGET_RATIO[category] || 0.1;
    return totalBudget * ratio;
};