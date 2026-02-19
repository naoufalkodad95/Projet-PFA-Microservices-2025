import React, { useState } from 'react';
import styled from 'styled-components';
import AdminLayout from '../../pages/Admin/AdminLayout';

// Styled Components avec dimensions et espacement améliorés
const VerificationContainer = styled.div`
  max-width: 1000px;
  margin: 30px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const VerificationHeader = styled.div`
  background-color: #f5f5f5;
  padding: 22px 30px;
  border-bottom: 1px solid #e0e0e0;
`;

const VerificationTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
`;

const VerificationContent = styled.div`
  padding: 30px;
`;

const Section = styled.div`
  margin-bottom: 35px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  
  &::before {
    content: "${props => props.number}";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: #25A55F;
    color: white;
    border-radius: 50%;
    margin-right: 12px;
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const SearchForm = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    border-color: #25A55F;
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
  }
`;

const Button = styled.button`
  background-color: ${props => props.secondary ? '#e0e0e0' : '#25A55F'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.secondary ? '#d0d0d0' : '#1c8048'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 14px;
  border: 1px solid #e0e0e0;
`;

const PlayerInfoCard = styled.div`
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #25A55F;
`;

const PlayerContact = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  color: #555;
`;

const FormGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  align-items: center;
  
  label {
    width: 150px;
    font-size: 1rem;
    color: #444;
    font-weight: 500;
  }
  
  input, select {
    flex: 1;
    min-width: 200px;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    
    &:focus {
      border-color: #25A55F;
      outline: none;
      box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
    }
  }
`;

const CurrencyInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  
  input {
    width: 100%;
    padding-right: 30px;
  }
  
  span {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const DateGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  label {
    width: 80px;
    font-size: 1rem;
    color: #444;
    font-weight: 500;
  }
  
  input {
    width: 140px;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  
  input {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    cursor: pointer;
  }
  
  label {
    width: auto;
    cursor: pointer;
  }
`;

const NotesGroup = styled.div`
  display: flex;
  margin-bottom: 30px;
  
  label {
    width: 80px;
    font-size: 1rem;
    color: #444;
    font-weight: 500;
    margin-top: 5px;
  }
  
  textarea {
    flex: 1;
    min-height: 80px;
    padding: 12px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    resize: vertical;
    
    &:focus {
      border-color: #25A55F;
      outline: none;
      box-shadow: 0 0 0 3px rgba(37, 165, 95, 0.1);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const ActionButton = styled(Button)`
  min-width: 160px;
  font-weight: 600;
  
  &:first-child {
    background-color: ${props => props.secondary ? '#e0e0e0' : '#25A55F'};
    
    &:hover {
      background-color: ${props => props.secondary ? '#d0d0d0' : '#1c8048'};
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
`;

const Footer = styled.div`
  text-align: center;
  padding: 15px;
  font-size: 0.9rem;
  color: #777;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
`;

// Mock data pour les abonnements
const subscriptionTypes = [
  { id: 1, name: "Abonnement Annuel", price: 120 },
  { id: 2, name: "Abonnement Semestriel", price: 70 },
  { id: 3, name: "Abonnement Trimestriel", price: 40 }
];

const PaymentVerificationForm = () => {
  // State pour gérer la recherche et l'affichage des résultats
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    subscriptionType: '',
    amount: '',
    startDate: '01/03/2025',
    endDate: '01/03/2026',
    cashPayment: true,
    notes: ''
  });
  const [searched, setSearched] = useState(false);

  // Fonction de recherche simulée
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearched(true);
    
    // Simuler une recherche en base de données
    if (searchQuery.toLowerCase().includes('dupont')) {
      const mockResults = [
        { id: 'J123', lastName: 'Dupont', firstName: 'Jean', team: 'Les Tigres', email: 'jean.dupont@email.com', phone: '06 12 34 56 78' },
        { id: 'J456', lastName: 'Dupont', firstName: 'Pierre', team: 'Les Lions', email: 'pierre.dupont@email.com', phone: '06 98 76 54 32' }
      ];
      setSearchResults(mockResults);
    } else if (searchQuery.toLowerCase().includes('martin')) {
      const mockResults = [
        { id: 'J789', lastName: 'Martin', firstName: 'Lucas', team: 'Les Eagles', email: 'lucas.martin@email.com', phone: '07 12 34 56 78' }
      ];
      setSearchResults(mockResults);
    } else {
      // Pas de résultats
      setSearchResults([]);
    }
  };
  
  // Fonction pour gérer la touche Entrée dans la recherche
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Sélection d'un joueur
  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    
    // Réinitialiser les informations de paiement
    setPaymentInfo({
      subscriptionType: '',
      amount: '',
      startDate: '01/03/2025',
      endDate: '01/03/2026',
      cashPayment: true,
      notes: ''
    });
  };

  // Mise à jour des informations de paiement
  const handlePaymentInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Mise à jour du type d'abonnement et du montant
  const handleSubscriptionChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const subscription = subscriptionTypes.find(sub => sub.id === selectedId);
    
    setPaymentInfo({
      ...paymentInfo,
      subscriptionType: e.target.value,
      amount: subscription ? subscription.price.toString() : ''
    });
    
    // Calcul de la date de fin en fonction du type d'abonnement
    const startDate = new Date();
    let endDate = new Date(startDate);
    
    if (selectedId === 1) { // Annuel
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else if (selectedId === 2) { // Semestriel
      endDate.setMonth(startDate.getMonth() + 6);
    } else if (selectedId === 3) { // Trimestriel
      endDate.setMonth(startDate.getMonth() + 3);
    }
    
    // Formater les dates
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    setPaymentInfo(prev => ({
      ...prev,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    }));
  };

  // Traitement du formulaire
  const handleSubmit = () => {
    // Vérifier si les champs obligatoires sont remplis
    if (!paymentInfo.subscriptionType || !paymentInfo.amount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Ici, vous enverriez les données au backend
    alert(`Paiement validé pour ${selectedPlayer.firstName} ${selectedPlayer.lastName}\nMontant: ${paymentInfo.amount}€\nPériode: du ${paymentInfo.startDate} au ${paymentInfo.endDate}`);
    
    // Réinitialiser le formulaire
    setSelectedPlayer(null);
    setSearchResults([]);
    setSearchQuery('');
    setSearched(false);
    setPaymentInfo({
      subscriptionType: '',
      amount: '',
      startDate: '01/03/2025',
      endDate: '01/03/2026',
      cashPayment: true,
      notes: ''
    });
  };
  
  // Fonction pour imprimer le reçu
  const handlePrintReceipt = () => {
    // Simuler l'impression - normalement vous utiliseriez window.print() ou une bibliothèque
    alert(`Impression du reçu pour ${selectedPlayer.firstName} ${selectedPlayer.lastName}`);
  };

  return (
        <AdminLayout>
    
    <VerificationContainer>
      <VerificationHeader>
        <VerificationTitle>Vérification Paiement Abonnement</VerificationTitle>
      </VerificationHeader>
      
      <VerificationContent>
        {/* Section de recherche */}
        <Section>
          <SectionTitle number="1">Rechercher un joueur</SectionTitle>
          <SearchForm>
            <Input 
              type="text" 
              placeholder="Nom du joueur" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch}>Rechercher</Button>
          </SearchForm>
          
          {searched && searchResults.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Nom</Th>
                  <Th>Prénom</Th>
                  <Th>Équipe</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map(player => (
                  <tr key={player.id}>
                    <Td>{player.id}</Td>
                    <Td>{player.lastName}</Td>
                    <Td>{player.firstName}</Td>
                    <Td>{player.team}</Td>
                    <Td>
                      <Button 
                        secondary 
                        onClick={() => handleSelectPlayer(player)}
                      >
                        Sélectionner
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          {searched && searchResults.length === 0 && (
            <NoResults>
              Aucun joueur trouvé pour "{searchQuery}"
            </NoResults>
          )}
        </Section>
        
        {/* Section d'informations de paiement */}
        {selectedPlayer && (
          <Section>
            <SectionTitle number="2">Informations de paiement</SectionTitle>
            
            <PlayerInfoCard>
              <PlayerName>
                Joueur sélectionné: {selectedPlayer.lastName} {selectedPlayer.firstName} ({selectedPlayer.id}) - {selectedPlayer.team}
              </PlayerName>
              <PlayerContact>
                <span>Email: {selectedPlayer.email}</span>
                <span>Téléphone: {selectedPlayer.phone}</span>
              </PlayerContact>
            </PlayerInfoCard>
            
            <FormGroup>
              <label>Type d'abonnement:</label>
              <select 
                name="subscriptionType" 
                value={paymentInfo.subscriptionType}
                onChange={handleSubscriptionChange}
              >
                <option value="">Sélectionner...</option>
                {subscriptionTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              
              <label>Montant:</label>
              <CurrencyInput>
                <Input 
                  type="text" 
                  name="amount" 
                  value={paymentInfo.amount}
                  onChange={handlePaymentInfoChange}
                />
                <span>€</span>
              </CurrencyInput>
            </FormGroup>
            
            <FormGroup>
              <DateGroup>
                <label>Date début:</label>
                <Input 
                  type="text" 
                  name="startDate" 
                  value={paymentInfo.startDate}
                  onChange={handlePaymentInfoChange}
                />
              </DateGroup>
              
              <DateGroup>
                <label>Date fin:</label>
                <Input 
                  type="text" 
                  name="endDate" 
                  value={paymentInfo.endDate}
                  onChange={handlePaymentInfoChange}
                />
              </DateGroup>
              
              <CheckboxGroup>
                <input 
                  type="checkbox" 
                  name="cashPayment" 
                  checked={paymentInfo.cashPayment}
                  onChange={handlePaymentInfoChange}
                  id="cashPayment"
                />
                <label htmlFor="cashPayment">Payé en espèces</label>
              </CheckboxGroup>
            </FormGroup>
            
            <NotesGroup>
              <label>Notes:</label>
              <textarea 
                name="notes" 
                value={paymentInfo.notes}
                onChange={handlePaymentInfoChange}
                placeholder="Informations complémentaires..."
              />
            </NotesGroup>
            
            <ButtonGroup>
              <ActionButton onClick={handleSubmit}>Valider Paiement</ActionButton>
              <ActionButton secondary onClick={handlePrintReceipt}>Imprimer Reçu</ActionButton>
              <ActionButton secondary onClick={() => setSelectedPlayer(null)}>Annuler</ActionButton>
            </ButtonGroup>
          </Section>
        )}
      </VerificationContent>
      
      <Footer>
        © 2025 Futsal Center - Module Admin
      </Footer>
    </VerificationContainer>
        </AdminLayout>
    
  );
};

export default PaymentVerificationForm;