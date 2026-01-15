import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCommentDots, FaPaperPlane, FaTimes, FaRobot, FaWindowMinimize } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import '../../assets/styles/ChatWidget.css';

const ChatWidget = () => {
    const { t, i18n } = useTranslation();
    const { addToCart } = useCart();

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [sessionId] = useState(() => {
        const savedId = sessionStorage.getItem('chat_session_id');
        return savedId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    });
    const [messages, setMessages] = useState(() => {
        try {
            const savedChat = sessionStorage.getItem('chat_history');
            return savedChat ? JSON.parse(savedChat) : [];
        } catch (e) {
            return [];
        }
    });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        sessionStorage.setItem('chat_history', JSON.stringify(messages));
        sessionStorage.setItem('chat_session_id', sessionId);
    }, [messages, sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    sender: 'bot',
                    text: t('chat.welcome', 'Xin chào! Tôi là trợ lý ảo PC. Bạn cần tư vấn build máy hay tìm linh kiện gì không?')
                }
            ]);
        }
    }, [t, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userText = input;
        setInput('');
        setLoading(true);

        setMessages(prev => [...prev, { sender: 'user', text: userText }]);

        const currentResource = i18n.getResourceBundle(i18n.language, 'translation') || {};

        const aiConfig = currentResource.ai_config || {
            sys_prompt: "Bạn là nhân viên tư vấn PC.",
            label_price: "Giá",
            currency: "VNĐ",
            error_msg: "Lỗi kết nối"
        };

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    lang: i18n.language,
                    sessionId: sessionId,
                    aiConfig: aiConfig
                })
            });

            const data = await res.json();

            if (data.action === 'add_to_cart' && data.productId) {
                const productToBuy = data.suggestedProducts.find(p => p.id === data.productId);

                if (productToBuy) {
                    const cartItem = {
                        _id: productToBuy.id,
                        name: productToBuy.name,
                        price: productToBuy.price,
                        image: productToBuy.image,
                        countInStock: productToBuy.stock
                    };
                    addToCart(cartItem, 1);

                    setMessages(prev => [...prev, {
                        sender: 'bot',
                        text: `✅ ${data.reply}`,
                        type: 'success'
                    }]);
                } else {
                    setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
                }
            } else {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: data.reply,
                    products: data.suggestedProducts
                }]);
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'bot', text: t('chat.error', 'Xin lỗi, hệ thống đang bận.') }]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    if (!isOpen) {
        return (
            <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                <FaCommentDots size={24} />
            </button>
        );
    }

    return (
        <div className={`chat-widget-container ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header" onClick={() => !isMinimized && setIsMinimized(!isMinimized)}>
                <div className="chat-title">
                    <FaRobot className="chat-icon" /> AI Support
                </div>
                <div className="chat-controls">
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}>
                        <FaWindowMinimize size={12} style={{ marginBottom: 5 }} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                        <FaTimes size={14} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className="chat-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-message-group ${msg.sender}`}>
                                <div className={`chat-bubble ${msg.sender} ${msg.type || ''}`}>
                                    {msg.text}
                                </div>
                                {msg.products && msg.products.length > 0 && (
                                    <div className="chat-product-list">
                                        {msg.products.map(p => (
                                            <div key={p.id} className="chat-product-card" onClick={() => handleProductClick(p)}>
                                                <img src={p.image} alt={p.name} />
                                                <div className="chat-product-info">
                                                    <div className="chat-product-name">{p.name}</div>
                                                    <div className="chat-product-price">{formatPrice(p.price, i18n.language)}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-message-group bot">
                                <div className="chat-bubble bot typing">
                                    <span>.</span><span>.</span><span>.</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder={t('chat.placeholder', 'Nhập câu hỏi...')}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;