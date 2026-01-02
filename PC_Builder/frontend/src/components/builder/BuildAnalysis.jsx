import React, { useMemo } from 'react';
import { analyzeBuild } from '../../utils/builderHelper';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaLightbulb, FaBolt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BuildAnalysis = ({ cartItems }) => {
    const { t } = useTranslation();
    const report = useMemo(() => analyzeBuild(cartItems, t), [cartItems, t]);

    if (cartItems.length === 0) return null;

    return (
        <div className="build-analysis-card" style={{
            background: 'var(--bg-container)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <FaBolt style={{ color: '#f1c40f' }} /> {t('builder.analysis.config_analysis')}
            </h3>

            <div className="power-meter" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                    <span>{t('builder.analysis.wattage_needed')} <strong>{report.stats.estimatedWattage}W</strong></span>
                    {report.stats.bottleneckStatus !== "Chưa đủ dữ liệu" && (
                        <span>{t('builder.analysis.rate')}: <strong>{report.stats.bottleneckStatus}</strong></span>
                    )}
                </div>
                <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #2ecc71, #f1c40f)'
                    }}></div>
                </div>
            </div>

            <div className="analysis-messages">
                {report.errors.map((err, idx) => (
                    <div key={`err-${idx}`} style={{ color: '#e74c3c', display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'start' }}>
                        <FaTimesCircle style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{err}</span>
                    </div>
                ))}

                {report.warnings.map((warn, idx) => (
                    <div key={`warn-${idx}`} style={{ color: '#f39c12', display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'start' }}>
                        <FaExclamationTriangle style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{warn}</span>
                    </div>
                ))}

                {report.tips.map((tip, idx) => (
                    <div key={`tip-${idx}`} style={{ color: '#3498db', display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'start' }}>
                        <FaLightbulb style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span>{tip}</span>
                    </div>
                ))}

                {report.errors.length === 0 && report.warnings.length === 0 && (
                    <div style={{ color: '#27ae60', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <FaCheckCircle />
                        <span>{t('builder.analysis.config_ok')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuildAnalysis;