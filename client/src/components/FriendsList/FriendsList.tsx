import { Avatar, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { FunctionComponent } from "react";
import { theme } from '../../features/themes';


interface FriendsListProps {
  
}
 
const FriendsList: FunctionComponent<FriendsListProps> = () => {
  return ( 
    <List 
      dense 
      sx={{ width: '100%', maxWidth: 360, backgroundColor: theme.palette.primary.main }}>
    {[0, 1, 2, 3].map((value) => {
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
            <ListItemText id={labelId} primary={`Friend ${value + 1}`} />
          </ListItemButton>
        </ListItem>
      );
    })}
  </List>
  );
}
 
export default FriendsList;