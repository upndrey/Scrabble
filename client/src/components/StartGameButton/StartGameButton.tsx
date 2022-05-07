import { Button, ClickAwayListener, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { FunctionComponent, ReactNode, useState } from "react";

interface StartGameButtonProps {
  
}


const StartGameButton: FunctionComponent<StartGameButtonProps> = () => {
  const [gameMenu, setGameMenu] = useState<null | ReactNode>(null);

  const handleClickOpen = () => {
    setGameMenu(renderMenu);
  };

  const handleClose = () => {
    setGameMenu(null);
  };

  const renderMenu = (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper
        sx={{
          display:'flex', 
          flexDirection:'column',
          padding:1,
          boxSizing:'border-box',
          width:300,
          mb:1
        }}
      >
        <Button 
          variant="contained"
          size="medium"
          sx={{
            mb:1
          }}
          onClick={handleClose}
        >
          Своя игра
        </Button>
        <Button 
          variant="contained"
          size="medium"
          sx={{
            mb:1
          }}
          onClick={handleClose}
        >
          Быстрый поиск
        </Button>
        <Button 
          variant="contained"
          size="medium"
          disabled
          onClick={handleClose}
        >
          Рейтинговая игра
        </Button>
      </Paper>
    </ClickAwayListener>
  );

  return (
    <Box 
      id="startGameButton"
      sx={{position: 'fixed', right: 10, bottom: 10}}
    >
      {gameMenu}
      <Button 
        variant="contained"
        size="large"
        color={Boolean(gameMenu) ? "error" : "primary"}
        sx={{
          width: 300, height: 60,
        }}
        onClick={handleClickOpen}
      >
        {Boolean(gameMenu) ? "Закрыть" : "Начать игру"}
      </Button>
    </Box>
  );
}
 
export default StartGameButton;