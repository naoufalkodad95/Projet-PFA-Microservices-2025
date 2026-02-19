import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';

// Enregistrer la locale française
registerLocale('fr', fr);
setDefaultLocale('fr');

const DatePickerWrapper = styled.div`
    .react-datepicker-wrapper {
        width: 100%;
    }

    .react-datepicker {
        font-family: 'Arial', sans-serif;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .react-datepicker__header {
        background-color: white;
        border-bottom: 1px solid #f0f0f0;
        padding-top: 10px;
    }

    .react-datepicker__navigation {
        top: 12px;
    }

    .react-datepicker__current-month {
        font-weight: bold;
        font-size: 1rem;
        margin-bottom: 10px;
        color: #333;
    }

    .react-datepicker__day-name {
        color: #666;
        width: 2rem;
        margin: 0.2rem;
    }

    .react-datepicker__day {
        width: 2rem;
        height: 2rem;
        line-height: 2rem;
        margin: 0.2rem;
        border-radius: 50%;
        color: #333;
    }

    .react-datepicker__day--selected {
        background-color: #f8f8f8;
        color: #333;
        border: 2px solid #25A55F;
        font-weight: bold;
    }

    .react-datepicker__day--keyboard-selected {
        background-color: rgba(37, 165, 95, 0.1);
    }

    .react-datepicker__day--highlighted {
        background-color: #FFE0E0;
        color: #333;
    }

    .react-datepicker__day--highlighted-custom-1 {
        background-color: #FFB6B6;
        color: #333;
    }

    .react-datepicker__day--highlighted-custom-2 {
        background-color: #FFCDD2;
        color: #333;
    }

    .react-datepicker__day--disabled {
        color: #ccc;
    }

    .react-datepicker__day--outside-month {
        color: #ccc;
        background-color: #f9f9f9;
    }

    .react-datepicker__triangle {
        display: none;
    }

    .react-datepicker__day:hover {
        background-color: #f0f0f0;
    }

    .react-datepicker__input-container input {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
    }
`;

// Composant de date picker personnalisé
const CustomDatePicker = ({
                            selectedDate,
                            onChange,
                            highlightedDates = [], // Liste de dates (objets Date) à mettre en évidence
                            disabledDates = [], // Dates désactivées
                            minDate, // Date minimale sélectionnable
                            maxDate, // Date maximale sélectionnable
                            placeholderText = "JJ/MM/AAAA"
                          }) => {
  const [date, setDate] = useState(selectedDate || null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Mettre à jour la date sélectionnée si elle change via les props
    setDate(selectedDate);

    // Formater la date pour l'affichage si elle existe
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setInputValue(`${day}/${month}/${year}`);
    } else {
      setInputValue('');
    }
  }, [selectedDate]);

  // Fonction pour vérifier si une date est désactivée
  const isDateDisabled = (date) => {
    return disabledDates.some(d =>
        date.getDate() === d.getDate() &&
        date.getMonth() === d.getMonth() &&
        date.getFullYear() === d.getFullYear()
    );
  };

  // Gestionnaire pour la sélection de date via le calendrier
  const handleCalendarChange = (date) => {
    setDate(date);
    if (date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setInputValue(`${day}/${month}/${year}`);
    } else {
      setInputValue('');
    }

    if (onChange) {
      onChange(date);
    }
  };

  // Formater automatiquement l'entrée de l'utilisateur avec validation
  const formatDateInput = (value) => {
    // Vérifier que value est une chaîne de caractères
    if (!value || typeof value !== 'string') {
      return '';
    }

    // Supprimer tous les caractères non numériques
    const numbersOnly = value.replace(/[^\d]/g, '');

    // Gestion du jour (positions 0-1)
    let day = numbersOnly.slice(0, 2);
    if (day.length === 2) {
      // S'assurer que le jour est entre 01 et 31
      const dayValue = parseInt(day, 10);
      if (dayValue < 1) day = '01';
      if (dayValue > 31) day = '31';
    }

    // Gestion du mois (positions 2-3)
    let month = numbersOnly.slice(2, 4);
    if (month.length === 2) {
      // S'assurer que le mois est entre 01 et 12
      const monthValue = parseInt(month, 10);
      if (monthValue < 1) month = '01';
      if (monthValue > 12) month = '12';
    }

    // Année (positions 4-7)
    const year = numbersOnly.slice(4, 8);

    // Reconstruire la chaîne avec des séparateurs
    const parts = [];
    if (day) parts.push(day);
    if (month) parts.push(month);
    if (year) parts.push(year);

    // Formater avec des /
    return parts.join('/');
  };

  // Gestionnaire pour la saisie manuelle
  const handleInputChange = (e) => {
    // Vérifier si e est un événement valide avec une valeur
    if (!e || !e.target || e.target.value === undefined) {
      return;
    }

    const rawValue = e.target.value;

    // Formater l'entrée
    const formattedValue = formatDateInput(rawValue);
    setInputValue(formattedValue);

    // Essayer de convertir en date si complet
    if (formattedValue.length === 10) {
      const parts = formattedValue.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Mois commence à 0 en JavaScript
        const year = parseInt(parts[2], 10);

        // Vérifier si la date est valide
        const newDate = new Date(year, month, day);
        if (!isNaN(newDate.getTime()) &&
            newDate.getDate() === day &&
            newDate.getMonth() === month &&
            newDate.getFullYear() === year) {
          // Date valide - vérifier les restrictions min/max
          let isValid = true;
          if (minDate && newDate < minDate) isValid = false;
          if (maxDate && newDate > maxDate) isValid = false;
          if (isDateDisabled(newDate)) isValid = false;

          if (isValid) {
            setDate(newDate);
            if (onChange) {
              onChange(newDate);
            }
          }
        }
      }
    } else if (formattedValue === '') {
      // Effacer la date si le champ est vide
      setDate(null);
      if (onChange) {
        onChange(null);
      }
    }
  };

  return (
      <DatePickerWrapper>
        <DatePicker
            selected={date}
            onChange={handleCalendarChange}
            dateFormat="dd/MM/yyyy"
            locale="fr"
            placeholderText={placeholderText}
            minDate={minDate}
            maxDate={maxDate}
            highlightDates={highlightedDates}
            filterDate={date => !isDateDisabled(date)}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            popperModifiers={{
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: 'viewport'
              }
            }}
            popperPlacement="bottom-start"
            value={inputValue}
            onChangeRaw={handleInputChange}
            autoComplete="off"
        />
      </DatePickerWrapper>
  );
};

export default CustomDatePicker;