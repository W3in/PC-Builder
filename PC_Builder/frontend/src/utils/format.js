const EXCHANGE_RATES = {
    vi: 1,          // Gốc (VND)
    en: 0.00004,    // (khoảng 25.000 VND = 1 USD)
    ja: 0.006       // (khoảng 165 VND = 1 JPY)
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