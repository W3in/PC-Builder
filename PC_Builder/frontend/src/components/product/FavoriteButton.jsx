import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const FavoriteButton = ({ productId }) => {
    const { t } = useTranslation();
    const { user, favorites, toggleFavorite } = useAuth();

    const isFav = favorites.includes(productId);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            return toast.info(t('toast.fav_login'));
        }

        const success = await toggleFavorite(productId);
        if (success) {
            if (!isFav) {
                toast.success(t('toast.fav_added') || "Đã thêm vào yêu thích");
            } else {
                toast.info(t('toast.fav_removed') || "Đã xóa khỏi yêu thích");
            }
        }
    };

    return (
        <button onClick={handleClick} className="btn-favorite">
            {isFav ? <FaHeart color="#ff4d4d" /> : <FaRegHeart color="#888" />}
        </button>
    );
};

export default FavoriteButton;