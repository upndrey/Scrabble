import { Button, Divider, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'

type Props = {
  points: number,
  setPoints: Function
}

const GamePoints = ({points, setPoints}: Props) => {

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      <Button variant="contained" onClick={() => {if(points !== 0) setPoints(points-1)}}>-</Button>
      <TextField
        required
        label="Количество очков"
        value={points}
        type='number'
      />
      <Button variant="contained" onClick={() => {setPoints(points+1)}}>+</Button>
    </Stack>
  )
}

export default GamePoints