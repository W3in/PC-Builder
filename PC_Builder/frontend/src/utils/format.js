const EXCHANGE_RATES = {
    vi: 1,
    en: 0.00004,
    ja: 0.006
};

const CURRENCY_CONFIG = {
    vi: { locale: 'vi-VN', currency: 'VND' },
    en: { locale: 'en-US', currency: 'USD' },
    ja: { locale: 'ja-JP', currency: 'JPY' }
};

export const formatPrice = (amountInVND, language = 'vi') => {
    if (!amountInVND) amountInVND = 0;
    const rate = EXCHANGE_RATES[language] || 1;

    const convertedAmount = amountInVND * rate;

    const config = CURRENCY_CONFIG[language] || CURRENCY_CONFIG.vi;

    return new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: config.currency,
        maximumFractionDigits: 0
    }).format(convertedAmount);
};

export const convertToVND = (amount, language = 'vi') => {
    const rate = EXCHANGE_RATES[language] || 1;
    return amount / rate;
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150?text=No+Image";

    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    if (imagePath.startsWith('/images')) {
        return imagePath;
    }

    const backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    return `${backendUrl}${imagePath}`;
};