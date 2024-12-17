import React from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import ExplicitIcon from '@mui/icons-material/Explicit';

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const handleFormat = (event, newFormat) => {
    if (newFormat !== null) {
      i18n.changeLanguage(newFormat);
    }
  };

  return (
    <ToggleButtonGroup
      value={i18n.language}
      onChange={handleFormat}
      aria-label='text formatting'
      exclusive
    >
      <ToggleButton
        value='fr'
        aria-label='french'
        sx={{
          color: 'white',
          backgroundColor: 'primary.secondary',
          '&.Mui-selected': {
            backgroundColor: 'secondary.dark',
            color: 'white',
          },
        }}
      >
        <LanguageIcon />
        Français
      </ToggleButton>
      <ToggleButton
        value='en'
        aria-label='english'
        sx={{
          color: 'white',
          backgroundColor: 'primary.secondary',
          '&.Mui-selected': {
            color: 'white',
            backgroundColor: 'secondary.dark',
          },
        }}
      >
        <ExplicitIcon />
        English
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageSwitch;
