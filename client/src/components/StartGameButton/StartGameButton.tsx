import { Button, ClickAwayListener, Paper, Slide } from "@mui/material";
import { Box } from "@mui/system";
import { FunctionComponent, useState } from "react";

interface StartGameButtonProps {
  
}


const StartGameButton: FunctionComponent<StartGameButtonProps> = () => {
  const [isGameMenuStartOpen, startOpenGameMenu] = useState<boolean>(false);
  const [isGameMenuEndOpen, endOpenGameMenu] = useState<boolean>(false);


  const handleClickOpen = () => {
    startOpenGameMenu(true);
  };

  const handleClose = () => {
    startOpenGameMenu(false);
    endOpenGameMenu(false);
  };
  const renderMenu = (
      <Slide 
        direction="left" 
        in={isGameMenuStartOpen} 
        addEndListener={() => {
          if(isGameMenuStartOpen)
            setTimeout(endOpenGameMenu.bind(this, true), 10);
        }}
      >
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
            onClick={isGameMenuEndOpen ? handleClose : () => {}}
          >
            Своя игра
          </Button>
          <Button 
            variant="contained"
            size="medium"
            sx={{
              mb:1
            }}
            onClick={isGameMenuEndOpen ? handleClose : () => {}}
          >
            Быстрый поиск
          </Button>
          <Button 
            variant="contained"
            size="medium"
            disabled
            onClick={isGameMenuEndOpen ? handleClose : () => {}}
          >
            Рейтинговая игра
          </Button>
        </Paper>
      </Slide>
  );

  const renderActiveMenu = (
    <ClickAwayListener onClickAway={isGameMenuEndOpen ? handleClose : () => {}}>{renderMenu}</ClickAwayListener>
  )

  return (
    <Box 
      id="startGameButton"
      sx={{position: 'fixed', right: 10, bottom: 10}}
    >
      {/* {isGameMenuOpen ? renderActiveMenu : renderActiveMenu} */}
      {renderActiveMenu}
      <Button 
        variant="contained"
        size="large"
        color={isGameMenuStartOpen ? "error" : "primary"}
        sx={{
          width: 300, height: 60,
        }}
        onClick={handleClickOpen}
      >
        {isGameMenuStartOpen ? "Закрыть" : "Начать игру"}
      </Button>
    </Box>
  );
}
 
export default StartGameButton;