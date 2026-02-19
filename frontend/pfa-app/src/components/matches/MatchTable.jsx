import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const TableTitle = styled.div`
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f5f5f5;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #555;
`;

const FilterSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const FilterInput = styled.input`
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  font-weight: 600;
  background-color: #f5f5f5;
  position: relative;
  cursor: ${props => props.sortable ? 'pointer' : 'default'};
  
  &:after {
    content: ${props => props.sorted === 'asc' ? '"↑"' : props.sorted === 'desc' ? '"↓"' : '""'};
    position: absolute;
    right: 5px;
    top: 12px;
  }
  
  &:hover {
    background-color: ${props => props.sortable ? '#ebebeb' : '#f5f5f5'};
  }
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
`;

const TdCenter = styled(Td)`
  text-align: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.color || '#666'};
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const EditButton = styled(ActionButton)`
  color: #2196f3;
`;

const DeleteButton = styled(ActionButton)`
  color: #f44336;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#25A55F' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#1c8048' : '#f0f0f0'};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  color: #666;
`;

const LoadingState = styled.div`
  padding: 30px;
  text-align: center;
  color: #666;
`;

const MatchTable = ({ matches, loading, onEdit, onDelete }) => {
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    team: '',
    field: ''
  });
  const [sorting, setSorting] = useState({
    column: 'date',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [fields, setFields] = useState(['Tous', 'Terrain 1', 'Terrain 2', 'Terrain 3']);
  const [teams, setTeams] = useState([]);
  const matchesPerPage = 5;

  // Extraire la liste unique des équipes à partir des matchs
  useEffect(() => {
    if (matches.length > 0) {
      const uniqueTeams = new Set();

      matches.forEach(match => {
        uniqueTeams.add(match.equipeDomicileNom);
        uniqueTeams.add(match.equipeExterieurNom);
      });

      setTeams(['Toutes', ...Array.from(uniqueTeams).sort()]);
    }
  }, [matches]);

  // Filtrer et trier les matchs
  useEffect(() => {
    let result = [...matches];

    // Filtre par date
    if (filters.date) {
      const filterDate = new Date(filters.date);
      result = result.filter(match => {
        const matchDate = new Date(match.dateMatch);
        return matchDate.toDateString() === filterDate.toDateString();
      });
    }

    // Filtre par équipe
    if (filters.team && filters.team !== 'Toutes') {
      result = result.filter(match =>
          match.equipeDomicileNom === filters.team ||
          match.equipeExterieurNom === filters.team
      );
    }

    // Filtre par terrain
    if (filters.field && filters.field !== 'Tous') {
      result = result.filter(match => match.terrain === filters.field);
    }

    // Tri
    result.sort((a, b) => {
      let valueA, valueB;

      switch (sorting.column) {
        case 'date':
          valueA = new Date(a.dateMatch);
          valueB = new Date(b.dateMatch);
          break;
        case 'hometeam':
          valueA = a.equipeDomicileNom;
          valueB = b.equipeDomicileNom;
          break;
        case 'awayteam':
          valueA = a.equipeExterieurNom;
          valueB = b.equipeExterieurNom;
          break;
        case 'field':
          valueA = a.terrain;
          valueB = b.terrain;
          break;
        default:
          valueA = new Date(a.dateMatch);
          valueB = new Date(b.dateMatch);
      }

      if (valueA < valueB) return sorting.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredMatches(result);
    setCurrentPage(1); // Retour à la première page après filtrage
  }, [matches, filters, sorting]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSort = (column) => {
    setSorting(prev => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Pagination
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Formatage de la date et de l'heure
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
      <TableContainer>
        <TableTitle>Prochains matchs</TableTitle>

        <FiltersContainer>
          <FilterGroup>
            <FilterLabel>Date:</FilterLabel>
            <FilterInput
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Équipe:</FilterLabel>
            <FilterSelect
                name="team"
                value={filters.team}
                onChange={handleFilterChange}
            >
              {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Terrain:</FilterLabel>
            <FilterSelect
                name="field"
                value={filters.field}
                onChange={handleFilterChange}
            >
              {fields.map(field => (
                  <option key={field} value={field}>{field}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FiltersContainer>

        {loading ? (
            <LoadingState>Chargement des matchs...</LoadingState>
        ) : filteredMatches.length === 0 ? (
            <EmptyState>Aucun match planifié correspondant aux critères</EmptyState>
        ) : (
            <>
              <Table>
                <thead>
                <tr>
                  <Th sortable onClick={() => handleSort('date')} sorted={sorting.column === 'date' ? sorting.direction : null}>Date</Th>
                  <Th>Heure</Th>
                  <Th sortable onClick={() => handleSort('hometeam')} sorted={sorting.column === 'hometeam' ? sorting.direction : null}>Équipe Domicile</Th>
                  <Th>Score</Th>
                  <Th sortable onClick={() => handleSort('awayteam')} sorted={sorting.column === 'awayteam' ? sorting.direction : null}>Équipe Extérieur</Th>
                  <Th sortable onClick={() => handleSort('field')} sorted={sorting.column === 'field' ? sorting.direction : null}>Terrain</Th>
                  <Th>Actions</Th>
                </tr>
                </thead>
                <tbody>
                {currentMatches.map(match => (
                    <tr key={match.id}>
                      <Td>{formatDate(match.dateMatch)}</Td>
                      <Td>{formatTime(match.dateMatch)}</Td>
                      <Td>{match.equipeDomicileNom}</Td>
                      <TdCenter>
                        {match.scoreDomicile !== null && match.scoreExterieur !== null
                            ? `${match.scoreDomicile} - ${match.scoreExterieur}`
                            : '-'}
                      </TdCenter>
                      <Td>{match.equipeExterieurNom}</Td>
                      <Td>{match.terrain}</Td>
                      <TdCenter>
                        <EditButton onClick={() => onEdit(match)} title="Modifier">
                          ✎
                        </EditButton>
                        <DeleteButton onClick={() => onDelete(match)} title="Supprimer">
                          ✕
                        </DeleteButton>
                      </TdCenter>
                    </tr>
                ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                  <Pagination>
                    <PageButton
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                      ◀
                    </PageButton>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map(page => (
                            <React.Fragment key={page}>
                              {page !== 1 && page === currentPage - 1 && currentPage > 3 && (
                                  <PageButton disabled>...</PageButton>
                              )}
                              <PageButton
                                  active={currentPage === page}
                                  onClick={() => paginate(page)}
                              >
                                {page}
                              </PageButton>
                              {page !== totalPages && page === currentPage + 1 && currentPage < totalPages - 2 && (
                                  <PageButton disabled>...</PageButton>
                              )}
                            </React.Fragment>
                        ))
                    }

                    <PageButton
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                      ▶
                    </PageButton>
                  </Pagination>
              )}
            </>
        )}
      </TableContainer>
  );
};

export default MatchTable;