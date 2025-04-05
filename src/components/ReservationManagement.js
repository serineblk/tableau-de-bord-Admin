import React, { useState } from 'react';
import '../styles/ReservationManagement.css'; // Importez le fichier CSS
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa'; // Icônes pour les actions

function ReservationManagement() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      roomNumber: '1001',
      guestName: 'John Doe',
      date: '01-04-2025',
      time: '14:00',
    },
    {
      id: 2,
      roomNumber: '1002',
      guestName: 'Alice Martin',
      date: '01-04-2025',
      time: '15:30',
    },
    {
      id: 3,
      roomNumber: '1003',
      guestName: 'Carlos Alvarez',
      date: '01-04-2025',
      time: '10:00',
    },
    {
      id: 4,
      roomNumber: '1004',
      guestName: 'Sophie Dubois',
      date: '01-04-2025',
      time: '18:45',
    },
    {
      id: 5,
      roomNumber: '1005',
      guestName: 'Liam Chen',
      date: '01-04-2025',
      time: '12:15',
    },
    {
      id: 6,
      roomNumber: '1006',
      guestName: 'Fatima Zahra',
      date: '01-04-2025',
      time: '09:00',
    },
    {
      id: 7,
      roomNumber: '1007',
      guestName: 'Noah Williams',
      date: '01-04-2025',
      time: '20:30',
    }
    // Ajoutez d'autres réservations ici...
  ]);

  const [editingReservationId, setEditingReservationId] = useState(null);

  // État pour le formulaire de modification
  const [editedReservation, setEditedReservation] = useState({
    roomNumber: '',
    guestName: '',
    date: '',
    time: '',
  });

  // Modifier une réservation existante
  const handleSaveEdit = () => {
    if (!editedReservation.roomNumber || !editedReservation.guestName || !editedReservation.date || !editedReservation.time) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const updatedReservations = reservations.map((reservation) =>
      reservation.id === editingReservationId ? { ...reservation, ...editedReservation } : reservation
    );

    setReservations(updatedReservations);
    setEditingReservationId(null);
    setEditedReservation({ roomNumber: '', guestName: '', date: '', time: '' });
  };

  // Préremplir le formulaire pour édition
  const handleEditReservation = (id) => {
    const reservationToEdit = reservations.find((reservation) => reservation.id === id);
    setEditedReservation(reservationToEdit);
    setEditingReservationId(id);
  };

  // Annuler une réservation
  const handleCancelReservation = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?");
    if (confirmDelete) {
      const updatedReservations = reservations.filter((reservation) => reservation.id !== id);
      setReservations(updatedReservations);
    }
  };

  return (
    <div className="reservation-management">
      <h2>Gestion des Réservations</h2>

      {/* Formulaire pour modifier une réservation */}
      {editingReservationId !== null && (
        <div className="reservation-form animated-slide-in">
          <h3>Modifier Réservation</h3>
          <input
            type="text"
            placeholder="Numéro de chambre"
            value={editedReservation.roomNumber}
            onChange={(e) => setEditedReservation({ ...editedReservation, roomNumber: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Nom du client"
            value={editedReservation.guestName}
            onChange={(e) => setEditedReservation({ ...editedReservation, guestName: e.target.value })}
            className="form-input"
          />
          <input
            type="date"
            value={editedReservation.date}
            onChange={(e) => setEditedReservation({ ...editedReservation, date: e.target.value })}
            className="form-input"
          />
          <input
            type="time"
            value={editedReservation.time}
            onChange={(e) => setEditedReservation({ ...editedReservation, time: e.target.value })}
            className="form-input"
          />
          <button onClick={handleSaveEdit} className="submit-button">
            <FaCheckCircle /> Enregistrer Modifications
          </button>
        </div>
      )}

      {/* Liste des réservations */}
      <div className="reservation-list">
        <h3>Liste des Réservations</h3>
        {reservations.length > 0 ? (
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id} className="reservation-item animated-fade-in">
                <div className="reservation-details">
                  <span><strong>Chambre:</strong> {reservation.roomNumber}</span>
                  <span><strong>Nom:</strong> {reservation.guestName}</span>
                  <span><strong>Date:</strong> {reservation.date}</span>
                  <span><strong>Heure:</strong> {reservation.time}</span>
                </div>
                <div className="reservation-actions">
                  <button onClick={() => handleEditReservation(reservation.id)} className="edit-button">
                    <FaEdit /> Modifier
                  </button>
                  <button onClick={() => handleCancelReservation(reservation.id)} className="delete-button">
                    <FaTrash /> Annuler
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-reservations">Aucune réservation disponible.</p>
        )}
      </div>
    </div>
  );
}

export default ReservationManagement;