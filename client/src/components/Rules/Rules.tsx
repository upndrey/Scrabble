import { Button, Divider, Paper, Slide, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react'
import RulesSteps from '../RulesSteps/RulesSteps';

type Props = {
  isRulesOpen: boolean
}

const Rules = ({isRulesOpen}: Props) => {
  useEffect(() => {
  })
  
  return ( 
    <Slide direction="down" unmountOnExit  in={isRulesOpen}>
      <Paper 
        sx={{ 
          width: '100%', 
          maxWidth: 560,
          marginTop: '30px',
          backgroundColor: 'secondary.main',
          zIndex: 9999,
          display: 'inline-block',
          position: 'relative',
          mt:1,
          mr:1,
        }}
      >
        <Typography 
          variant='h6' 
          sx={{
            padding: '10px 20px 10px 20px',
            color: 'primary.contrastText'
          }}
        >
          Правила
        </Typography>
        <Divider sx={{
          color: 'primary.contrastText',
          mb: 2
        }}/>
        <RulesSteps />
      </Paper>
    </Slide>
  );
}

export default Rules