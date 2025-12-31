import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../assets/styles/Selection.css';
import { FILTER_OPTIONS } from '../../utils/filterOptions';
import { useTranslation } from 'react-i18next';

const FilterSidebar = ({ category, selectedFilters, onFilterChange }) => {
    const { t } = useTranslation();

    const options = FILTER_OPTIONS[category] || [];

    const [openSections, setOpenSections] = useState({});

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCheckboxChange = (key, value) => {
        onFilterChange(key, value);
    };

    const getTranslatedOption = (opt) => {
        const translated = t(`filters.options.${opt}`);
        if (translated !== `filters.options.${opt}`) {
            return translated;
        }

        if (!isNaN(opt) ||
            /GB|MHz|Hz|W|RTX|RX|Core|Ryzen|LGA|AM\d/i.test(opt)
        ) {
            return opt;
        }
        const fallbackKey = opt.toLowerCase().replace(/[\s/]/g, '_').replace(/[()]/g, '');
        return t(`filters.options.${fallbackKey}`, opt);
    };

    return (
        <div className="filter-sidebar">
            <h3 className="filter-heading">{t('home.filter') || "FILTERS"}</h3>

            {options.map((group) => {
                const isOpen = openSections[group.key] !== false;

                const labelKey = group.label.toLowerCase().replace(/ /g, '_');
                const translatedLabel = t(`filters.labels.${labelKey}`, group.label);

                return (
                    <div key={group.key} className="filter-group">
                        <div className="filter-header" onClick={() => toggleSection(group.key)}>
                            <span>{translatedLabel}</span>
                            {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </div>

                        {isOpen && (
                            <div className="filter-options">
                                {group.options.map(opt => (
                                    <label key={opt} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[group.key]?.includes(opt) || false}
                                            onChange={() => onFilterChange(group.key, opt)}
                                        />
                                        {getTranslatedOption(opt)}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default FilterSidebar;