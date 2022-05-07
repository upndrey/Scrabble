import { Avatar, Checkbox, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { FunctionComponent } from "react";


interface FriendsListProps {
  
}
 
const FriendsList: FunctionComponent<FriendsListProps> = () => {
  return ( 
    <Paper 
      sx={{ 
        width: '100%', 
        maxWidth: 360,
        mt: 3,
        backgroundColor: 'primary.main',
        }}
    >
      <Typography 
        variant='h6' 
        sx={{
          padding: '10px 20px 10px 20px',
          color: 'primary.contrastText'
        }}
      >
        Друзья
      </Typography>
      <Divider sx={{
        mb:1,
        color: 'primary.contrastText'
      }}/>
      <List 
        dense 
        sx={{ 
          width: '100%', 
          height: '330px',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.3)',
            borderRadius:'25px',
          }
          }}
      >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              <Checkbox
                edge="end"
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText 
                id={labelId} 
                sx={{
                  color: 'primary.contrastText'
                }}
                primary={`Friend ${value + 1}`} 
              />
            </ListItemButton>
          </ListItem>
        );
      })}
      </List>
    </Paper>
  );
}
 
export default FriendsList;