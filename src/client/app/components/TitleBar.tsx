import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Image from "next/image";
import { useState } from "react";

export default function TitleBar() {
  const pages = [];
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Button href="/" sx={{ textDecoration: "none", color: "white" }} variant="text">
        <Image src="/mctcg_white_transparent.png" alt="McTCG Logo" width={70} height={40} style={{ margin: "0 4px"}} />
      </Button>
      <Divider />
      <List>
        {pages.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      <AppBar component="nav">
        <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <Button href="/" sx={{ textDecoration: "none", color: "white" }} variant="text">
              <Image src="/mctcg_white_transparent.png" alt="McTCG Logo" width={70} height={40} style={{ margin: "0 4px"}} />
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {pages.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  )
}