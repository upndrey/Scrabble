import { Box } from '@mui/system'
import React from 'react'

type Props = {
  width: string,
  height: string,
  position: Array<string>
}

const Controls = ({width, height, position}: Props) => {
  return (
    <Box
      sx={{
        width: width,
        height: height,
        position: 'absolute',
        left: position[0],
        top: position[1],
      }}
    >
      text
    </Box>
  )
}

export default Controls