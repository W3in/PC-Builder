import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../assets/styles/Selection.css';
import { FILTER_OPTIONS } from '../../utils/filterOptions';
const FilterSidebar = ({ category, selectedFilters, onFilterChange }) => {


    const options = FILTER_OPTIONS[category] || [];

    const [openSections, setOpenSections] = useState({});

    const toggleSection = (key) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCheckboxChange = (key, value) => {
        onFilterChange(key, value);
    };

    return (
        <div className="filter-sidebar">
            <h3 className="filter-heading">FILTERS</h3>

            {options.map((group) => {
                const isOpen = openSections[group.key] !== false; // Mặc định mở
                return (
                    <div key={group.key} className="filter-group">
                        <div className="filter-header" onClick={() => toggleSection(group.key)}>
                            <span>{group.label}</span>
                            {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                        </div>

                        {isOpen && (
                            <div className="filter-options">
                                {group.options.map(opt => (
                                    <label key={opt} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters[group.key]?.includes(opt) || false}
                                            onChange={() => handleCheckboxChange(group.key, opt)}
                                        />
                                        {opt}
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