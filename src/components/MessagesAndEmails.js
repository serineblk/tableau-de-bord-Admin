import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaTrash, FaEdit, FaEnvelope, FaSearch, FaEye, FaEyeSlash, FaSort, FaFilter, FaReply, FaHistory } from 'react-icons/fa';
import '../styles/MessagesAndEmails.css';

const MessagesAndEmails = () => {
  // Types de messages
  const MESSAGE_TYPES = {
    INCOMING: 'Demande client',
    OUTGOING: 'Message envoyé',
    NOTIFICATION: 'Notification interne',
    PROMOTIONAL: 'Offre promotionnelle',
    AUTOMATED: 'E-mail automatique'
  };

  // Catégories de messages
  const CATEGORIES = {
    RESERVATION: 'Réservation',
    PAYMENT: 'Paiement',
    COMPLAINT: 'Réclamation',
    QUESTION: 'Question',
    URGENT: 'Urgent'
  };

  // États initiaux
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    type: MESSAGE_TYPES.OUTGOING,
    recipient: '',
    subject: '',
    content: '',
    category: CATEGORIES.QUESTION
  });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentView, setCurrentView] = useState('messages'); // 'messages', 'history'
  const [selectedClient, setSelectedClient] = useState(null);

  // Charger les données initiales
  useEffect(() => {
    const demoMessages = [
      { id: 1, type: MESSAGE_TYPES.INCOMING, client: 'Jean Dupont', subject: 'Problème de paiement', content: 'Je ne parviens pas à effectuer le paiement...', date: '2023-10-15', category: CATEGORIES.PAYMENT, status: 'unread' },
      { id: 2, type: MESSAGE_TYPES.AUTOMATED, client: 'Marie Martin', subject: 'Confirmation de réservation', content: 'Votre réservation #1234 est confirmée...', date: '2023-10-14', category: CATEGORIES.RESERVATION, status: 'sent' },
      { id: 3, type: MESSAGE_TYPES.NOTIFICATION, subject: 'Surbooking chambre 101', content: 'Attention: surbooking détecté pour le 20/10...', date: '2023-10-14', category: CATEGORIES.URGENT, status: 'unread' },
      { id: 4, type: MESSAGE_TYPES.PROMOTIONAL, subject: 'Offre spéciale octobre', content: 'Profitez de -20% sur les suites...', date: '2023-10-12', status: 'sent' },
      { id: 5, type: MESSAGE_TYPES.INCOMING, client: 'Paul Durand', subject: 'Demande spéciale', content: 'Serait-il possible d avoir un lit bébé ?', date: '2023-10-10', category: CATEGORIES.QUESTION, status: 'read' }
    ];
    
    setMessages(demoMessages);
  }, []);

  // Gestion des filtres et tris
  const filteredMessages = messages.filter(msg => {
    return (
      (filters.type === 'all' || msg.type === filters.type) &&
      (filters.category === 'all' || msg.category === filters.category) &&
      (filters.status === 'all' || msg.status === filters.status) &&
      (filters.search === '' || 
       msg.subject.toLowerCase().includes(filters.search.toLowerCase()) || 
       (msg.client && msg.client.toLowerCase().includes(filters.search.toLowerCase())) ||
       msg.content.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Gestion des messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = {
      id: messages.length + 1,
      ...newMessage,
      date: new Date().toISOString().split('T')[0],
      status: 'sent'
    };
    
    setMessages([...messages, message]);
    setNewMessage({
      type: MESSAGE_TYPES.OUTGOING,
      recipient: '',
      subject: '',
      content: '',
      category: CATEGORIES.QUESTION
    });
    alert('Message envoyé avec succès!');
  };

  const handleReply = (originalMsg) => {
    setNewMessage({
      type: MESSAGE_TYPES.OUTGOING,
      recipient: originalMsg.client,
      subject: `RE: ${originalMsg.subject}`,
      content: `\n\n--- Message original ---\n${originalMsg.content}`,
      category: originalMsg.category
    });
  };

  const handleDelete = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const handleMarkAs = (id, status) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  const handleViewHistory = (client) => {
    setSelectedClient(client);
    setCurrentView('history');
  };

  return (
    <div className="messages-container">
      <h1><FaEnvelope /> Gestion des communications</h1>
      
      <div className="view-switcher">
        <button 
          className={currentView === 'messages' ? 'active' : ''}
          onClick={() => setCurrentView('messages')}
        >
          <FaEnvelope /> Messages
        </button>
        <button 
          className={currentView === 'history' ? 'active' : ''}
          onClick={() => setCurrentView('history')}
        >
          <FaHistory /> Historique
        </button>
      </div>

      {currentView === 'messages' && (
        <>
          <div className="filters">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            
            <div className="filter-group">
              <label><FaFilter /> Type :</label>
              <select 
                value={filters.type} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">Tous</option>
                {Object.values(MESSAGE_TYPES).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label><FaFilter /> Catégorie :</label>
              <select 
                value={filters.category} 
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">Toutes</option>
                {Object.values(CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label><FaFilter /> Statut :</label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">Tous</option>
                <option value="read">Lus</option>
                <option value="unread">Non lus</option>
                <option value="sent">Envoyés</option>
              </select>
            </div>
          </div>

          <div className="messages-list">
            <table className="messages-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('type')}>
                    Type <FaSort />
                  </th>
                  <th onClick={() => requestSort('client')}>
                    Client/Destinataire <FaSort />
                  </th>
                  <th onClick={() => requestSort('subject')}>
                    Sujet <FaSort />
                  </th>
                  <th onClick={() => requestSort('date')}>
                    Date <FaSort />
                  </th>
                  <th onClick={() => requestSort('category')}>
                    Catégorie <FaSort />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map(msg => (
                  <tr key={msg.id} className={msg.status}>
                    <td>{msg.type}</td>
                    <td>
                      {msg.client || 'Interne'}
                      {msg.client && (
                        <button 
                          className="history-btn"
                          onClick={() => handleViewHistory(msg.client)}
                        >
                          <FaHistory />
                        </button>
                      )}
                    </td>
                    <td>{msg.subject}</td>
                    <td>{msg.date}</td>
                    <td>{msg.category || '-'}</td>
                    <td className="actions">
                      {msg.type === MESSAGE_TYPES.INCOMING && msg.status !== 'read' && (
                        <button 
                          className="read-btn"
                          onClick={() => handleMarkAs(msg.id, 'read')}
                          title="Marquer comme lu"
                        >
                          <FaEyeSlash />
                        </button>
                      )}
                      {msg.type === MESSAGE_TYPES.INCOMING && (
                        <button 
                          className="reply-btn"
                          onClick={() => handleReply(msg)}
                          title="Répondre"
                        >
                          <FaReply />
                        </button>
                      )}
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setEditingId(msg.id);
                          setNewMessage({
                            type: msg.type,
                            recipient: msg.client || '',
                            subject: msg.subject,
                            content: msg.content,
                            category: msg.category || CATEGORIES.QUESTION
                          });
                        }}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(msg.id)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="compose-message">
            <h2>{editingId ? 'Modifier le message' : 'Nouveau message'}</h2>
            
            <form onSubmit={handleSendMessage}>
              <div>
                <label>Type :</label>
                <select
                  name="type"
                  value={newMessage.type}
                  onChange={(e) => setNewMessage({...newMessage, type: e.target.value})}
                >
                  {Object.entries(MESSAGE_TYPES).map(([key, value]) => (
                    <option key={key} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              
              {newMessage.type !== MESSAGE_TYPES.NOTIFICATION && (
                <div>
                  <label>
                    {newMessage.type === MESSAGE_TYPES.INCOMING ? 'De :' : 'À :'}
                  </label>
                  <input
                    type="text"
                    name="recipient"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                    required
                  />
                </div>
              )}
              
              <div>
                <label>Sujet :</label>
                <input
                  type="text"
                  name="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  required
                />
              </div>
              
              {newMessage.type === MESSAGE_TYPES.INCOMING && (
                <div>
                  <label>Catégorie :</label>
                  <select
                    name="category"
                    value={newMessage.category}
                    onChange={(e) => setNewMessage({...newMessage, category: e.target.value})}
                  >
                    {Object.entries(CATEGORIES).map(([key, value]) => (
                      <option key={key} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label>Message :</label>
                <textarea
                  name="content"
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  required
                  rows="6"
                />
              </div>
              
              <div className="buttons">
                <button type="submit" className="send-btn">
                  <FaPaperPlane /> {editingId ? 'Mettre à jour' : 'Envoyer'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setEditingId(null);
                      setNewMessage({
                        type: MESSAGE_TYPES.OUTGOING,
                        recipient: '',
                        subject: '',
                        content: '',
                        category: CATEGORIES.QUESTION
                      });
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}

      {currentView === 'history' && (
        <div className="history-section">
          <h2>Historique des communications {selectedClient && `avec ${selectedClient}`}</h2>
          
          <button 
            className="back-btn"
            onClick={() => setCurrentView('messages')}
          >
            Retour à la liste
          </button>
          
          {selectedClient ? (
            <div className="client-history">
              <div className="client-info">
                <h3>Client: {selectedClient}</h3>
                <p>Dernière communication: 2023-10-15</p>
                <p>Total messages: {messages.filter(m => m.client === selectedClient).length}</p>
              </div>
              
              <div className="history-timeline">
                {messages
                  .filter(msg => msg.client === selectedClient)
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(msg => (
                    <div key={msg.id} className="history-item">
                      <div className="history-date">{msg.date}</div>
                      <div className="history-type">{msg.type}</div>
                      <div className="history-subject">{msg.subject}</div>
                      <div className="history-content">{msg.content}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : (
            <div className="client-list">
              <h3>Sélectionnez un client pour voir son historique</h3>
              <ul>
                {[...new Set(messages.filter(m => m.client).map(m => m.client))].map(client => (
                  <li key={client}>
                    <button onClick={() => setSelectedClient(client)}>
                      {client}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesAndEmails;