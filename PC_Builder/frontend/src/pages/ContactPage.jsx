import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';
import '../assets/styles/Contact.css';

const ContactPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axiosClient.post('/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setStatus('error');
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="contact-container">
            <h2 className="contact-title">{t('contact.title')}</h2>

            {status === 'success' && <div className="success-alert">{t('contact.success')}</div>}

            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-field">
                        <label>{t('contact.name')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-field">
                        <label>{t('contact.email')}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-field">
                    <label>{t('contact.subject')}</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>
                <div className="form-field">
                    <label>{t('contact.message')}</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn-send" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending...' : t('contact.send')}
                </button>
            </form>
        </div>
    );
};
export default ContactPage;