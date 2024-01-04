import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNavsAsync } from "../slices/navSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  styled,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SpeedIcon from "@mui/icons-material/Speed";

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Dashboard = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const nav = useSelector((state) => state.nav.nav);
  // const status = useSelector((state) => state.auth.status);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchNavsAsync(token));
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  const handleToggleParent = (parentIndex) => {
    setExpandedParents((prevExpandedParents) => {
      const newExpandedParents = [...prevExpandedParents];
      newExpandedParents[parentIndex] = !newExpandedParents[parentIndex];
      return newExpandedParents;
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ThemeProvider theme={darkTheme}>
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
            <IconButton
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
              sx={{ marginLeft: "auto" }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {nav &&
            nav
              .filter(
                (item) => item.isView && item.isActive && item.parentId === "0"
              )
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((parentItem, parentIndex) => (
                <React.Fragment key={parentIndex}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                      onClick={() => handleToggleParent(parentIndex)}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {parentIndex % 3 === 0 ? (
                          <InboxIcon />
                        ) : parentIndex % 3 === 1 ? (
                          <MailIcon />
                        ) : (
                          <SpeedIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={parentItem.tabName}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {expandedParents[parentIndex] ? (
                        <ExpandMoreIcon />
                      ) : (
                        <ExpandLessIcon />
                      )}
                    </ListItemButton>
                  </ListItem>

                  {nav
                    .filter(
                      (childItem) =>
                        childItem.parentId === parentItem.encryptedTabId && childItem.isView && childItem.isActive
                    )
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((childItem, childIndex) => (
                      <ListItem
                        key={`${parentIndex}-${childIndex}`}
                        disablePadding
                        sx={{
                          display: expandedParents[parentIndex]
                            ? "block"
                            : "none",
                          paddingLeft: 2,
                        }}
                      >
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: "initial",
                            px: 2.5,
                          }}
                        >
                          <Link
                            to={`/dashboard${childItem.webPage}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <ListItemText
                              primary={childItem.tabName}
                              sx={{ opacity: 1 }}
                            />
                          </Link>
                        </ListItemButton>
                      </ListItem>
                    ))}
                </React.Fragment>
              ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
      </Box>
    </Box>
  );
};
export default Dashboard;
