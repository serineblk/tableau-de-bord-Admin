import React, { useState } from 'react';
import '../styles/UserManagement.css';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaEdit, FaTrash, FaUserPlus, FaMoon, FaSun } from 'react-icons/fa'; // Import des icônes
import img from '../assets/img.webp'; // Import de l'image

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', role: '' });
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Nombre d'utilisateurs par page
  const [darkMode, setDarkMode] = useState(false); // Mode sombre
  const [notification, setNotification] = useState(null); // Notification

  const addUser = () => {
    if (newUser.username && newUser.role) {
      setUsers([...users, newUser]);
      setNewUser({ username: '', role: '' });
      showNotification("Utilisateur ajouté avec succès !");
    } else {
      showNotification("Veuillez remplir tous les champs.", true);
    }
  };

  const deleteUser = (index) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      setDeletingIndex(index);
      setTimeout(() => {
        setUsers(users.filter((_, i) => i !== index));
        setDeletingIndex(null);
        showNotification("Utilisateur supprimé avec succès !");
      }, 500);
    }
  };

  const updateUser = (index) => {
    const updatedUsername = prompt("Nouveau nom d'utilisateur", users[index].username);
    const updatedRole = prompt("Nouveau rôle", users[index].role);
    if (updatedUsername && updatedRole) {
      const updatedUsers = [...users];
      updatedUsers[index] = { username: updatedUsername, role: updatedRole };
      setUsers(updatedUsers);
      showNotification("Utilisateur modifié avec succès !");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Réinitialiser la pagination lors de la recherche
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // La notification disparaît après 3 secondes
  };

  // Filtrer et trier les utilisateurs
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.username.localeCompare(b.username);
    } else {
      return b.username.localeCompare(a.username);
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Bouton pour basculer en mode sombre */}
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.isError ? 'error' : 'success'}`}>
          {notification.message}
        </div>
      )}

      <div className="user-management">
        {/* Ajout de l'image dans l'en-tête */}
        <div className="header-with-image">
          <img src={img} alt="Gestion des utilisateurs" className="header-image" />
          <h2 className="title">Gestion des Utilisateurs</h2>
        </div>

        {/* Barre de recherche */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>

        {/* Bouton de tri */}
        <button onClick={toggleSortOrder} className="sort-button">
          {sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
          Trier par nom ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
        </button>

        {/* Formulaire d'ajout d'utilisateur */}
        <div className="user-form">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="user-input"
          />
          <input
            type="text"
            placeholder="Rôle"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="user-input"
          />
          <button onClick={addUser} className="add-user-button">
            <FaUserPlus /> Ajouter
          </button>
        </div>

        {/* Liste des utilisateurs */}
        <ul className="user-list">
          {currentUsers.map((user, index) => (
            <li
              key={index}
              className={`user-item ${deletingIndex === index ? 'fade-out' : ''}`}
            >
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role}</span>
              <div className="user-actions">
                <button onClick={() => updateUser(index)} className="edit-button">
                  <FaEdit /> Modifier
                </button>
                <button onClick={() => deleteUser(index)} className="delete-button">
                  <FaTrash /> Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Nouvel espace pour afficher les utilisateurs ajoutés en dehors de user-management */}
      <div className="external-users">
        <h3>Utilisateurs Ajoutés</h3>
        <ul>
          {currentUsers.map((user, index) => (
            <li key={index} className="external-user-item">
              <span>{user.username}</span> - <span>{user.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserManagement;