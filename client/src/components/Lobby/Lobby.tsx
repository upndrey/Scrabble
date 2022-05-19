import { Divider, List, ListItem, ListItemText, Paper, Slide, Typography } from "@mui/material";
import { FunctionComponent } from "react";

interface LobbyProps {
  login: string
}

const Lobby: FunctionComponent<LobbyProps> = (props) => {
  const {login} = props;
  return ( 
    <Slide direction="down" in={true}>
      <Paper
        sx={{ 
          minWidth: '500px', 
          maxWidth: '100%',
          marginTop: '0px',
          backgroundColor: 'primary.main',
          zIndex: 999,
          height: '399px',
          overflow: 'hidden',
          display: 'inline-block',
          position: 'relative',
          mt:1,
          }}
      >
        <Typography
          variant='h6' 
          sx={{
            padding: '10px 20px 10px 20px',
            color: 'primary.contrastText'
          }}
        >
          Лобби
        </Typography>
        <Divider sx={{
          color: 'primary.contrastText'
        }}/>
        <List>
          <ListItem>
            <ListItemText>{login}</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Slide>
  );
}
 
export default Lobby;