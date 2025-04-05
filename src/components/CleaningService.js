import React, { useState } from 'react';
import { FaUser, FaTshirt, FaBell, FaTrash, FaSearch, FaFilter, FaPlus, FaArrowLeft, FaArrowRight, FaEdit, FaClipboardList, FaHandshake, FaStar, FaShoppingCart, FaHistory } from 'react-icons/fa';
import '../styles/CleaningService.css';

function CleaningService() {
  // État pour les agents de nettoyage
  const [staff, setStaff] = useState([
    { id: 1, name: 'Jean Dupont', task: 'Chambres 101-105', status: 'en cours', performance: 'excellent' },
    { id: 2, name: 'Marie Curie', task: 'Couloirs et halls', status: 'terminé', performance: 'bon' },
  ]);
  
  // État pour les stocks - Ajout de plusieurs nouveaux produits
  const [inventory, setInventory] = useState([
    { id: 1, item: 'Serviettes', quantity: 50, needsRestock: false, category: 'Textile', minQuantity: 30 },
    { id: 2, item: 'Détergent', quantity: 10, needsRestock: true, category: 'Produits nettoyage', minQuantity: 15 },
    { id: 3, item: 'Gants jetables', quantity: 20, needsRestock: true, category: 'Protection', minQuantity: 50 },
    { id: 4, item: 'Sac poubelle', quantity: 100, needsRestock: false, category: 'Fournitures', minQuantity: 200 },
    { id: 5, item: 'Shampoing moquette', quantity: 5, needsRestock: true, category: 'Produits nettoyage', minQuantity: 10 },
    { id: 6, item: 'Désinfectant', quantity: 8, needsRestock: true, category: 'Produits nettoyage', minQuantity: 20 },
    { id: 7, item: 'Eponges', quantity: 25, needsRestock: false, category: 'Outils', minQuantity: 40 },
    { id: 8, item: 'Balai', quantity: 15, needsRestock: false, category: 'Outils', minQuantity: 10 },
    { id: 9, item: 'Serpillère', quantity: 12, needsRestock: false, category: 'Outils', minQuantity: 10 },
    { id: 10, item: 'Savon mains', quantity: 30, needsRestock: false, category: 'Hygiène', minQuantity: 50 },
  ]);
  
  // État pour les tâches planifiées
  const [tasks, setTasks] = useState([
    { id: 1, room: '101', status: 'pending', assignedTo: 'Jean Dupont' },
    { id: 2, room: '102', status: 'completed', assignedTo: 'Marie Curie' },
  ]);
  
  // État pour les demandes spéciales
  const [specialRequests, setSpecialRequests] = useState([
    { id: 1, request: 'Nettoyage express chambre 103', status: 'pending' },
    { id: 2, request: 'Remplacement des serviettes salle 201', status: 'completed' },
  ]);
  
  // État pour les notifications
  const [notifications, setNotifications] = useState([]);
  
  // État pour l'historique des actions
  const [history, setHistory] = useState([]);
  
  // État pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [inventoryFilter, setInventoryFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [currentInventoryPage, setCurrentInventoryPage] = useState(1);
  const itemsPerPage = 4;
  const inventoryPerPage = 6;
  
  // État pour l'édition d'un agent
  const [editingStaffId, setEditingStaffId] = useState(null);
  
  // État pour le formulaire d'ajout d'une tâche
  const [newTask, setNewTask] = useState({
    room: '',
    status: 'pending',
    assignedTo: '',
  });

  // Nouvel état pour le formulaire d'ajout d'un employé
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    task: '',
    status: 'en cours',
    performance: 'bon',
  });

  // Fonction pour ajouter un nouvel employé
  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.task) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }
    const newEmployeeToAdd = {
      id: staff.length + 1,
      ...newEmployee,
    };
    setStaff([...staff, newEmployeeToAdd]);
    setHistory([...history, `Nouvel employé ajouté : ${newEmployee.name}`]);
    setNewEmployee({ name: '', task: '', status: 'en cours', performance: 'bon' });
  };

  // Fonction pour mettre à jour les stocks
  const updateInventory = (itemId, newQuantity) => {
    const updatedInventory = inventory.map(item =>
      item.id === itemId ? { 
        ...item, 
        quantity: newQuantity,
        needsRestock: newQuantity <= item.minQuantity
      } : item
    );
    
    setInventory(updatedInventory);
    
    const item = inventory.find(i => i.id === itemId);
    setNotifications([...notifications, `Réapprovisionnement de ${item.item} à ${newQuantity} unités`]);
    setHistory([...history, `Stock mis à jour : ${item.item} (${newQuantity} unités)`]);
  };

  // Fonction pour commander un produit
  const orderProduct = (itemId, quantityToAdd) => {
    const item = inventory.find(i => i.id === itemId);
    const newQuantity = item.quantity + quantityToAdd;
    updateInventory(itemId, newQuantity);
  };

  // Fonction pour supprimer un agent
  const removeStaff = (staffId) => {
    setStaff(staff.filter(employee => employee.id !== staffId));
    setHistory([...history, `Agent ${staffId} supprimé`]);
  };

  // Fonction pour ajouter une nouvelle tâche via le formulaire
  const addTask = () => {
    if (!newTask.room || !newTask.assignedTo) {
      alert("Veuillez remplir tous les champs du formulaire.");
      return;
    }
    const newTaskToAdd = {
      id: tasks.length + 1,
      room: newTask.room,
      status: newTask.status,
      assignedTo: newTask.assignedTo,
    };
    setTasks([...tasks, newTaskToAdd]);
    setHistory([...history, `Nouvelle tâche ajoutée pour la chambre ${newTask.room}`]);
    setNewTask({ room: '', status: 'pending', assignedTo: '' });
  };

  // Fonction pour marquer une tâche comme terminée
  const completeTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'completed' } : task
    ));
    setHistory([...history, `Tâche ${taskId} marquée comme terminée`]);
  };

  // Filtrer les agents en fonction du terme de recherche et du statut
  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtrer les produits en fonction de la catégorie
  const filteredInventory = inventory.filter(item => {
    if (inventoryFilter === 'all') return true;
    if (inventoryFilter === 'needsRestock') return item.needsRestock;
    return item.category === inventoryFilter;
  });

  // Pagination pour le personnel
  const indexOfLastStaff = currentPage * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalStaffPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Pagination pour l'inventaire
  const indexOfLastInventory = currentInventoryPage * inventoryPerPage;
  const indexOfFirstInventory = indexOfLastInventory - inventoryPerPage;
  const currentInventory = filteredInventory.slice(indexOfFirstInventory, indexOfLastInventory);
  const totalInventoryPages = Math.ceil(filteredInventory.length / inventoryPerPage);

  const paginate = (pageNumber, type) => {
    if (type === 'staff') {
      setCurrentPage(pageNumber);
    } else {
      setCurrentInventoryPage(pageNumber);
    }
  };

  // Catégories uniques pour le filtre
  const categories = [...new Set(inventory.map(item => item.category))];

  return (
    <div className="hotel-cleaning-management">
      <h1>Gestion du Service de Ménage</h1>

      {/* Section pour ajouter un nouvel employé */}
      <section className="add-employee-section">
        <h2><FaUser /> Ajouter un Nouvel Employé</h2>
        <div className="add-employee-form">
          <input
            type="text"
            placeholder="Nom de l'employé"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tâche assignée"
            value={newEmployee.task}
            onChange={(e) => setNewEmployee({ ...newEmployee, task: e.target.value })}
          />
          <select
            value={newEmployee.status}
            onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
          >
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
          <select
            value={newEmployee.performance}
            onChange={(e) => setNewEmployee({ ...newEmployee, performance: e.target.value })}
          >
            <option value="excellent">Excellent</option>
            <option value="bon">Bon</option>
            <option value="moyen">Moyen</option>
          </select>
          <button className="add-employee-button" onClick={addEmployee}>
            <FaPlus /> Ajouter l'employé
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="notification-section">
        <h2><FaBell /> Notifications</h2>
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="notification-card">
                <p>{notification}</p>
              </div>
            ))
          ) : (
            <p>Aucune notification pour le moment.</p>
          )}
        </div>
      </section>

      {/* Supervision des Agents */}
      <section className="staff-section">
        <h2><FaUser /> Supervision des Agents</h2>
        <div className="search-filter-bar">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Rechercher un agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-bar">
            <FaFilter />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Tous</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>
        </div>
        <div className="staff-list">
          {currentStaff.map((employee) => (
            <div key={employee.id} className="staff-card">
              <div className="staff-info">
                <h3>{employee.name}</h3>
                <p>Tâche: {employee.task}</p>
                <p>Statut: {employee.status}</p>
                <p>Performance: {employee.performance}</p>
              </div>
              <div className="staff-actions">
                <button className="delete-button" onClick={() => removeStaff(employee.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1, 'staff')}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>
          <span>Page {currentPage} / {totalStaffPages}</span>
          <button
            onClick={() => paginate(currentPage + 1, 'staff')}
            disabled={indexOfLastStaff >= filteredStaff.length}
          >
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Gestion des Stocks - Version améliorée */}
      <section className="inventory-section">
        <h2><FaTshirt /> Gestion des Stocks</h2>
        
        <div className="inventory-controls">
          <div className="search-filter-bar">
            <div className="filter-bar">
              <FaFilter />
              <select value={inventoryFilter} onChange={(e) => setInventoryFilter(e.target.value)}>
                <option value="all">Tous les produits</option>
                <option value="needsRestock">À réapprovisionner</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="inventory-list">
          {currentInventory.map((item) => (
            <div key={item.id} className={`inventory-card ${item.needsRestock ? 'needs-restock' : ''}`}>
              <h3>{item.item}</h3>
              <p>Catégorie: {item.category}</p>
              <p>Quantité: {item.quantity} / Min: {item.minQuantity}</p>
              <div className="inventory-actions">
                <button 
                  className="restock-button small"
                  onClick={() => orderProduct(item.id, 5)}
                >
                  +5 unités
                </button>
                <button 
                  className="restock-button small"
                  onClick={() => orderProduct(item.id, 10)}
                >
                  +10 unités
                </button>
                <button 
                  className="restock-button small"
                  onClick={() => orderProduct(item.id, item.minQuantity)}
                >
                  Réappro. min
                </button>
              </div>
              {item.needsRestock && (
                <div className="restock-alert">
                  <FaBell /> Réapprovisionnement nécessaire
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="pagination">
          <button
            onClick={() => paginate(currentInventoryPage - 1, 'inventory')}
            disabled={currentInventoryPage === 1}
          >
            <FaArrowLeft />
          </button>
          <span>Page {currentInventoryPage} / {totalInventoryPages}</span>
          <button
            onClick={() => paginate(currentInventoryPage + 1, 'inventory')}
            disabled={indexOfLastInventory >= filteredInventory.length}
          >
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Planification des Nettoyages */}
      <section className="task-section">
        <h2><FaClipboardList /> Planification des Nettoyages</h2>
        <div className="add-task-form">
          <h3>Ajouter une nouvelle tâche</h3>
          <input
            type="text"
            placeholder="Numéro de chambre"
            value={newTask.room}
            onChange={(e) => setNewTask({ ...newTask, room: e.target.value })}
          />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="pending">En attente</option>
            <option value="completed">Terminé</option>
          </select>
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          >
            <option value="">Sélectionner un employé</option>
            {staff.map((employee) => (
              <option key={employee.id} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
          <button className="add-task-button" onClick={addTask}>
            <FaPlus /> Ajouter la tâche
          </button>
        </div>
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>Chambre {task.room}</h3>
              <p>Assigné à: {task.assignedTo}</p>
              <p>Statut: {task.status}</p>
              <button
                className={`action-button ${task.status === 'completed' ? 'disabled' : ''}`}
                onClick={() => completeTask(task.id)}
                disabled={task.status === 'completed'}
              >
                Marquer comme terminé
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Demandes Spéciales */}
      <section className="special-request-section">
        <h2><FaStar /> Demandes Spéciales</h2>
        <div className="special-request-list">
          {specialRequests.map((request) => (
            <div key={request.id} className="special-request-card">
              <h3>{request.request}</h3>
              <p>Statut: {request.status}</p>
              <button
                className={`action-button ${request.status === 'completed' ? 'disabled' : ''}`}
                onClick={() => setSpecialRequests(specialRequests.map(r => 
                  r.id === request.id ? {...r, status: 'completed'} : r
                ))}
                disabled={request.status === 'completed'}
              >
                Marquer comme terminé
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Historique des Actions */}
      <section className="history-section">
        <h2><FaHistory /> Historique des Actions</h2>
        <div className="history-list">
          {history.length > 0 ? (
            history.map((action, index) => (
              <div key={index} className="history-card">
                <p>{action}</p>
              </div>
            ))
          ) : (
            <p>Aucune action enregistrée pour le moment.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default CleaningService;