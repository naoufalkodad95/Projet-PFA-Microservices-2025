// src/components/team/EditTeamModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import theme from '../../styles/theme';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.large};
  width: 90%;
  max-width: 500px;
  padding: ${theme.spacing.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${theme.colors.textSecondary};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  font-size: ${theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(37, 165, 95, 0.2);
  }
`;

const ImagePreview = styled.div`
  display: ${props => props.hasImage ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  margin-top: ${theme.spacing.sm};
`;

const PreviewImage = styled.img`
  max-width: 150px;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing.xs};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const EditTeamModal = ({ isOpen, onClose, team, onSave }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    logo: null
  });
  const [previewURL, setPreviewURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convertir l'image binaire en URL si elle existe
  React.useEffect(() => {
    if (team?.logo) {
      const blob = new Blob([new Uint8Array(team.logo)], { type: 'image/png' });
      setPreviewURL(URL.createObjectURL(blob));
    }
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));

      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setPreviewURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convertir le logo en tableau d'octets si nécessaire
      let logoBytes = null;
      if (formData.logo && formData.logo instanceof File) {
        const arrayBuffer = await formData.logo.arrayBuffer();
        logoBytes = Array.from(new Uint8Array(arrayBuffer));
      }

      // Créer l'objet à envoyer au service
      const teamData = {
        name: formData.name,
        logo: logoBytes
      };

      await onSave(teamData);
      onClose();
    } catch (error) {
      console.error('Error saving team:', error);
      // Vous pourriez ajouter un état d'erreur et l'afficher ici
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
      <ModalOverlay onClick={onClose}>
        <ModalContainer onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Edit Team</ModalTitle>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Team Name</Label>
              <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="logo">Team Logo</Label>
              <Input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
              />

              <ImagePreview hasImage={previewURL}>
                <PreviewImage src={previewURL} alt="Team Logo Preview" />
                <Button
                    type="button"
                    buttonType="text"
                    variant="secondary"
                    size="small"
                    onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
              </ImagePreview>
            </FormGroup>

            <ButtonsContainer>
              <Button
                  type="button"
                  buttonType="outlined"
                  onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </ButtonsContainer>
          </Form>
        </ModalContainer>
      </ModalOverlay>
  );
};

export default EditTeamModal;