import { Divider, List, ListItem, ListItemText, Paper, Slide, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { UserData } from "../../interfaces/UserData";

interface LobbyProps {
  login: string
  lobby: UserData["lobby"]
}

const Lobby: FunctionComponent<LobbyProps> = (props) => {
  const {login, lobby} = props;
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
            <ListItemText>{lobby?.slot1_info?.login}</ListItemText>
            <ListItemText>{lobby?.slot2_info?.login}</ListItemText>
            <ListItemText>{lobby?.slot3_info?.login}</ListItemText>
            <ListItemText>{lobby?.slot4_info?.login}</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </Slide>
  );
}
 
export default Lobby;