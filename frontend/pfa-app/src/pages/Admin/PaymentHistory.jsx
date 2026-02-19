// src/pages/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HeaderJ from '../../components/layout/HeaderJ';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
`;

const PageDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const TotalCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  color: #666;
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #25A55F;
`;

const FilterContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
`;

const FilterSelect = styled.select`
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  font-size: 0.9rem;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;

  th {
    padding: 12px 16px;
    text-align: left;
    font-size: 0.85rem;
    font-weight: 600;
    color: #495057;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e9ecef;

    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: #f8f9fa;
    }
  }

  td {
    padding: 12px 16px;
    font-size: 0.9rem;
    color: #333;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px;
  color: #666;
`;

const PaymentStatus = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => props.status === 'Payé' ? 'rgba(37, 165, 95, 0.1)' : '#f8f9fa'};
  color: ${props => props.status === 'Payé' ? '#25A55F' : '#666'};
`;

const SimplePagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? 'rgba(37, 165, 95, 0.1)' : 'white'};
  color: ${props => props.active ? '#25A55F' : '#666'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [monthFilter, setMonthFilter] = useState('all');

  // Simuler le chargement des données
  useEffect(() => {
    const fetchPayments = async () => {
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));

      // Données statiques pour la démonstration (uniquement paiements en espèces)
      const mockPayments = [
        {
          id: 'ESP-001',
          date: new Date(2025, 3, 20),
          description: 'Réservation terrain - 2 heures',
          amount: 300,
          status: 'Payé'
        },
        {
          id: 'ESP-002',
          date: new Date(2025, 3, 5),
          description: 'Cotisation mensuelle',
          amount: 100,
          status: 'Payé'
        },
        {
          id: 'ESP-003',
          date: new Date(2025, 2, 18),
          description: 'Réservation terrain - 1 heure',
          amount: 150,
          status: 'Payé'
        },
        {
          id: 'ESP-004',
          date: new Date(2025, 2, 3),
          description: 'Cotisation mensuelle',
          amount: 100,
          status: 'Payé'
        },
        {
          id: 'ESP-005',
          date: new Date(2025, 1, 22),
          description: 'Participation équipement',
          amount: 200,
          status: 'Payé'
        },
        {
          id: 'ESP-006',
          date: new Date(2025, 1, 5),
          description: 'Cotisation mensuelle',
          amount: 100,
          status: 'Payé'
        },
        {
          id: 'ESP-007',
          date: new Date(2025, 0, 19),
          description: 'Réservation terrain - 2 heures',
          amount: 300,
          status: 'Payé'
        },
        {
          id: 'ESP-008',
          date: new Date(2025, 0, 5),
          description: 'Cotisation mensuelle',
          amount: 100,
          status: 'Payé'
        }
      ];

      setPayments(mockPayments);
      setLoading(false);
    };

    fetchPayments();
  }, []);

  // Filtrer les paiements par mois
  const getFilteredPayments = () => {
    if (monthFilter === 'all') {
      return payments;
    }

    const [year, month] = monthFilter.split('-');
    return payments.filter(payment => {
      return payment.date.getFullYear() === parseInt(year) &&
          payment.date.getMonth() === parseInt(month) - 1;
    });
  };

  const filteredPayments = getFilteredPayments();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Calculer le total des paiements
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);

  // Générer les options pour le filtre de mois
  const generateMonthOptions = () => {
    const options = [];
    const months = {};

    // Ajouter tous les mois disponibles dans les données
    payments.forEach(payment => {
      const year = payment.date.getFullYear();
      const month = payment.date.getMonth();
      const key = `${year}-${month + 1}`;

      if (!months[key]) {
        months[key] = {
          value: key,
          label: format(payment.date, 'MMMM yyyy', { locale: fr })
        };
      }
    });

    // Trier par date décroissante
    options.push(...Object.values(months).sort((a, b) => {
      const [yearA, monthA] = a.value.split('-');
      const [yearB, monthB] = b.value.split('-');
      return yearB - yearA || monthB - monthA;
    }));

    return options;
  };

  const monthOptions = generateMonthOptions();

  return (
      <PageContainer>
        <HeaderJ />
        <ContentContainer>
          <PageHeader>
            <PageTitle>Paiements</PageTitle>
            <PageDescription>Historique de vos paiements</PageDescription>
          </PageHeader>

          <TotalCard>
            <TotalLabel>Total des paiements</TotalLabel>
            <TotalAmount>{totalAmount} MAD</TotalAmount>
          </TotalCard>

          <FilterContainer>
            <FilterLabel>Filtrer par mois:</FilterLabel>
            <FilterSelect
                value={monthFilter}
                onChange={(e) => {
                  setMonthFilter(e.target.value);
                  setCurrentPage(1);
                }}
            >
              <option value="all">Tous les mois</option>
              {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </FilterSelect>
          </FilterContainer>

          {loading ? (
              <EmptyState>Chargement des paiements...</EmptyState>
          ) : filteredPayments.length === 0 ? (
              <EmptyState>Aucun paiement trouvé pour cette période</EmptyState>
          ) : (
              <>
                <Table>
                  <TableHead>
                    <tr>
                      <th>Date</th>
                      <th>Référence</th>
                      <th>Description</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </TableHead>
                  <TableBody>
                    {currentItems.map(payment => (
                        <tr key={payment.id}>
                          <td>{format(payment.date, 'dd/MM/yyyy', { locale: fr })}</td>
                          <td>{payment.id}</td>
                          <td>{payment.description}</td>
                          <td>{payment.amount} MAD</td>
                          <td><PaymentStatus status={payment.status}>{payment.status}</PaymentStatus></td>
                        </tr>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                    <SimplePagination>
                      <PageButton
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        Précédent
                      </PageButton>

                      {Array.from({ length: totalPages }).map((_, index) => (
                          <PageButton
                              key={index + 1}
                              active={currentPage === index + 1}
                              onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PageButton>
                      ))}

                      <PageButton
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Suivant
                      </PageButton>
                    </SimplePagination>
                )}
              </>
          )}
        </ContentContainer>
      </PageContainer>
  );
};

export default PaymentHistory;