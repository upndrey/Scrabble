import { Box, Checkbox, Divider, List, ListItem, ListItemButton, ListItemText, Paper, Slide, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import './LobbyList.css'

interface LobbyListProps {
}

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText 
          primary={`Item ${index + 1}`} 
          sx={{
            color: 'primary.contrastText'
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

 
const LobbyList: FunctionComponent<LobbyListProps> = (props) => {
  return (
    <Slide direction="down" in={true}>
      <Paper 
        sx={{ 
          minWidth: '600px', 
          maxWidth: '100%',
          marginTop: '0px',
          backgroundColor: 'primary.main',
          zIndex: 999,
          display: 'inline-block',
          position: 'relative',
          mt:1
          }}
      >
        <Typography
          variant='h6' 
          sx={{
            padding: '10px 20px 10px 20px',
            color: 'primary.contrastText'
          }}
        >
          Список лобби
        </Typography>
        <Divider sx={{
          color: 'primary.contrastText'
        }}/>
        <FixedSizeList
          height={330}
          width={600}
          itemSize={46}
          itemCount={200}
          overscanCount={5}
          className='styledFixedSizeList'
          style={{
            color: 'primary.contrastText',
            width: '100%',
            height: '345px',
            overflow: 'auto'
          }}  
        >
          {renderRow}
        </FixedSizeList>
      </Paper>
    </Slide>
  );
}
 
export default LobbyList;