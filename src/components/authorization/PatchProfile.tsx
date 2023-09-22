import React, { useState } from 'react';
import { updateUserData, User } from '../../features/AuthSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import axios from 'axios';

interface ProfileEditPopupProps {
  onClose: () => void;
  user: User;
  token: string;
}

const ProfileEditPopup: React.FC<ProfileEditPopupProps> = ({ onClose, user, token }) => {
  const [username, setUsername] = useState<string>('');
  const [avatarURL, setAvatarURL] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfileData = {
      id: user._id, // Передаем ID пользователя
      username: username,
      avatarURL: avatarURL,
      token: token,
    };

    try {
      await dispatch(updateUserData(updatedProfileData));

      // Обработка успешного обновления профиля (можете добавить здесь логику)
      onClose();
    } catch (error) {
      setError('Произошла ошибка при обновлении профиля.');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await axios.post('http://localhost:4000/upload/img', formData);
        setAvatarURL(`http://localhost:4000${data.url}`);
      } catch (error) {
        setError('Произошла ошибка при загрузке изображения.');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-xl">
        <div className="p-4">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Закрыть &#10006; {/* Это символ крестика */}
          </button>
          <h3 className="text-2xl font-semibold mb-4">Изменить профиль</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Новый никнейм:
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Новая ссылка на аватар:
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                value={avatarURL}
                onChange={(e) => setAvatarURL(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Изменить изображение:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full"
            >
              Сохранить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPopup;
