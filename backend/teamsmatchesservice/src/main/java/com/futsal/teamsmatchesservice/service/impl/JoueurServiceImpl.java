//// JoueurServiceImpl.java
//package com.futsal.teamsmatchesservice.service.impl;
//
//import com.futsal.teamsmatchesservice.dto.request.JoueurRequestDto;
//import com.futsal.teamsmatchesservice.dto.response.JoueurResponseDto;
//import com.futsal.teamsmatchesservice.exception.ResourceNotFoundException;
//import com.futsal.teamsmatchesservice.exception.UnauthorizedException;
//import com.futsal.teamsmatchesservice.model.Equipe;
//import com.futsal.teamsmatchesservice.model.Joueur;
//import com.futsal.teamsmatchesservice.model.StatutEnum;
//import com.futsal.teamsmatchesservice.repository.EquipeRepository;
//import com.futsal.teamsmatchesservice.repository.JoueurRepository;
//import com.futsal.teamsmatchesservice.service.JoueurService;
//import com.futsal.teamsmatchesservice.util.DtoMapper;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class JoueurServiceImpl implements JoueurService {
//
//    private final JoueurRepository joueurRepository;
//    private final EquipeRepository equipeRepository;
//    private final DtoMapper dtoMapper;
//
//    @Override
//    public List<JoueurResponseDto> getAllJoueurs() {
//        return joueurRepository.findAll().stream()
//                .map(dtoMapper::toJoueurResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public JoueurResponseDto getJoueurById(Long id) {
//        Joueur joueur = findJoueurById(id);
//        return dtoMapper.toJoueurResponseDto(joueur);
//    }
//
//    @Override
//    @Transactional
//    public JoueurResponseDto createJoueur(JoueurRequestDto joueurDto) {
//        // Vérifier si un joueur avec cet email existe déjà
//        if (joueurRepository.existsByEmail(joueurDto.getEmail())) {
//            throw new IllegalArgumentException("Un joueur avec cet email existe déjà");
//        }
//
//        Joueur joueur = new Joueur();
//        joueur.setNom(joueurDto.getNom());
//        joueur.setPrenom(joueurDto.getPrenom());
//        joueur.setDateNaissance(joueurDto.getDateNaissance());
//        joueur.setEmail(joueurDto.getEmail());
//        joueur.setTelephone(joueurDto.getTelephone());
//        joueur.setEstCapitaine(joueurDto.isEstCapitaine());
//        joueur.setPosition(joueurDto.getPosition());
//        joueur.setNiveau(joueurDto.getNiveau());
//
//        Joueur savedJoueur = joueurRepository.save(joueur);
//        return dtoMapper.toJoueurResponseDto(savedJoueur);
//    }
//
//    @Override
//    @Transactional
//    public JoueurResponseDto updateJoueur(Long id, JoueurRequestDto joueurDto) {
//        Joueur joueur = findJoueurById(id);
//
//        // Vérifier si un autre joueur utilise déjà cet email
//        if (!joueur.getEmail().equals(joueurDto.getEmail()) &&
//                joueurRepository.existsByEmail(joueurDto.getEmail())) {
//            throw new IllegalArgumentException("Un autre joueur utilise déjà cet email");
//        }
//
//        joueur.setNom(joueurDto.getNom());
//        joueur.setPrenom(joueurDto.getPrenom());
//        joueur.setDateNaissance(joueurDto.getDateNaissance());
//        joueur.setEmail(joueurDto.getEmail());
//        joueur.setTelephone(joueurDto.getTelephone());
//        joueur.setPosition(joueurDto.getPosition());
//        joueur.setNiveau(joueurDto.getNiveau());
//
//        // Ne pas modifier le statut de capitaine ici (utiliser nommerCapitaine)
//
//        Joueur updatedJoueur = joueurRepository.save(joueur);
//        return dtoMapper.toJoueurResponseDto(updatedJoueur);
//    }
//
//    @Override
//    @Transactional
//    public void deleteJoueur(Long id) {
//        Joueur joueur = findJoueurById(id);
//
//        // Vérifier si le joueur est capitaine d'une équipe
//        if (joueur.isEstCapitaine() && joueur.getEquipe() != null) {
//            throw new UnauthorizedException("Impossible de supprimer le capitaine d'une équipe");
//        }
//
//        joueurRepository.delete(joueur);
//    }
//
//    @Override
//    @Transactional
//    public JoueurResponseDto demanderRejoindreEquipe(Long joueurId, Long equipeId) {
//        Joueur joueur = findJoueurById(joueurId);
//
//        // Vérifier que l'équipe existe
//        Equipe equipe = equipeRepository.findById(equipeId)
//                .orElseThrow(() -> new ResourceNotFoundException("Équipe non trouvée avec l'ID: " + equipeId));
//
//        // Vérifier que le joueur n'est pas déjà dans une équipe
//        if (joueur.getEquipe() != null) {
//            throw new UnauthorizedException("Le joueur fait déjà partie d'une équipe");
//        }
//
//        // Vérifier qu'il n'a pas déjà une demande en cours
//        if (joueur.getDemandeEquipeId() != null && joueur.getStatutDemande() == StatutEnum.EN_ATTENTE) {
//            throw new UnauthorizedException("Le joueur a déjà une demande en cours pour une équipe");
//        }
//
//        // Créer la demande
//        joueur.setDemandeEquipeId(equipeId);
//        joueur.setStatutDemande(StatutEnum.EN_ATTENTE);
//
//        Joueur updatedJoueur = joueurRepository.save(joueur);
//        return dtoMapper.toJoueurResponseDto(updatedJoueur);
//    }
//
//    @Override
//    @Transactional
//    public void annulerDemandeRejoindreEquipe(Long joueurId) {
//        Joueur joueur = findJoueurById(joueurId);
//
//        // Vérifier que le joueur a bien une demande en cours
//        if (joueur.getDemandeEquipeId() == null || joueur.getStatutDemande() != StatutEnum.EN_ATTENTE) {
//            throw new UnauthorizedException("Le joueur n'a pas de demande en cours");
//        }
//
//        joueur.setDemandeEquipeId(null);
//        joueur.setStatutDemande(StatutEnum.AUCUNE);
//
//        joueurRepository.save(joueur);
//    }
//
//    @Override
//    public List<JoueurResponseDto> searchJoueurs(String position, Integer niveauMin) {
//        List<Joueur> joueurs;
//
//        if (position != null && niveauMin != null) {
//            joueurs = joueurRepository.findByPositionAndNiveauGreaterThanEqual(position, niveauMin);
//        } else if (position != null) {
//            joueurs = joueurRepository.findByPositionAndNiveauGreaterThanEqual(position, 1);
//        } else if (niveauMin != null) {
//            joueurs = joueurRepository.findAll().stream()
//                    .filter(j -> j.getNiveau() >= niveauMin)
//                    .collect(Collectors.toList());
//        } else {
//            joueurs = joueurRepository.findAll();
//        }
//
//        return joueurs.stream()
//                .map(dtoMapper::toJoueurResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public List<JoueurResponseDto> getJoueursSansEquipe() {
//        return joueurRepository.findByEquipeIsNull().stream()
//                .map(dtoMapper::toJoueurResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    // Dans JoueurServiceImpl.java
//    @Override
//    @Transactional
//    public JoueurResponseDto nommerCapitaine(Long joueurId) {
//        Joueur joueur = findJoueurById(joueurId);
//
//        // Vérifier que le joueur appartient à une équipe
//        if (joueur.getEquipe() == null) {
//            throw new UnauthorizedException("Le joueur n'appartient à aucune équipe");
//        }
//
//        // Récupérer l'équipe du joueur
//        Equipe equipe = joueur.getEquipe();
//
//        // Modifier cette ligne pour récupérer tous les capitaines au lieu d'un seul
//        // Au lieu de:
//        // Optional<Joueur> ancienCapitaine = joueurRepository.findByEquipeIdAndEstCapitaineTrue(equipe.getId());
//
//        // Utilisez cette approche:
//        List<Joueur> anciensCapitaines = joueurRepository.findAllByEquipeIdAndEstCapitaineTrue(equipe.getId());
//
//        // Rétrograder tous les anciens capitaines
//        anciensCapitaines.forEach(capitaine -> {
//            capitaine.setEstCapitaine(false);
//            joueurRepository.save(capitaine);
//        });
//
//        // Nommer le nouveau capitaine
//        joueur.setEstCapitaine(true);
//        Joueur updatedJoueur = joueurRepository.save(joueur);
//
//        return dtoMapper.toJoueurResponseDto(updatedJoueur);
//    }
//
//    @Override
//    @Transactional
//    public JoueurResponseDto updateStatistiquesJoueur(Long joueurId, int butsMarques) {
//        Joueur joueur = findJoueurById(joueurId);
//
//        joueur.setNbrButs(joueur.getNbrButs() + butsMarques);
//
//        Joueur updatedJoueur = joueurRepository.save(joueur);
//        return dtoMapper.toJoueurResponseDto(updatedJoueur);
//    }
//
//    @Override
//    public List<JoueurResponseDto> getTopButeurs(int limit) {
//        return joueurRepository.findTopScorers().stream()
//                .limit(limit)
//                .map(dtoMapper::toJoueurResponseDto)
//                .collect(Collectors.toList());
//    }
//
//    // Méthode utilitaire pour trouver un joueur par ID
//    private Joueur findJoueurById(Long id) {
//        return joueurRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Joueur non trouvé avec l'ID: " + id));
//    }
//}