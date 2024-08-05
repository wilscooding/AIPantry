// components/Header.js
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = ({ onToggleForm, showAddItem }) => (
	<AppBar position="static" sx={{ mb: 4 }}>
		<Toolbar>
			<Typography variant="h6" sx={{ flexGrow: 1 }}>
				My Pantry
			</Typography>
			<Button
				color="inherit"
				onClick={onToggleForm}
				sx={{ backgroundColor: "#6200ea" }}
			>
				{showAddItem ? "Cancel" : "Add Item"}
			</Button>
		</Toolbar>
	</AppBar>
);

export default Header;
