import {
	Card,
	CardContent,
	CardActions,
	CardMedia,
	Typography,
	IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const PantryItemCard = ({
	item,
	handleEdit,
	handleDelete,
	handleQuantityChange,
}) => (
	<Card
		sx={{
			width: 200,
			display: "flex",
			flexDirection: "column",
			borderRadius: "8px",
			borderColor: "#03a9f4",
			boxShadow: 1,
		}}
	>
		{item.image && (
			<CardMedia
				component="img"
				image={item.image}
				alt={item.name}
				height="140"
				sx={{
					borderTopLeftRadius: "8px",
					borderTopRightRadius: "8px",
					objectFit: "cover",
				}}
			/>
		)}
		<CardContent sx={{ flexGrow: 1, p: 1 }}>
			<Typography gutterBottom variant="h6" component="div">
				{item.name}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				Quantity: {item.quantity}
			</Typography>
		</CardContent>
		<CardActions sx={{ justifyContent: "space-between", p: 1 }}>
			<IconButton
				onClick={() => handleQuantityChange(item.id, 1)}
				color="primary"
				sx={{ fontSize: "small" }}
			>
				<AddIcon />
			</IconButton>
			<IconButton
				onClick={() => handleQuantityChange(item.id, -1)}
				color="primary"
				sx={{ fontSize: "small" }}
			>
				<RemoveIcon />
			</IconButton>
			<IconButton
				onClick={() => handleEdit(item)}
				color="primary"
				sx={{ fontSize: "small" }}
			>
				<EditIcon />
			</IconButton>
			<IconButton
				onClick={() => handleDelete(item.id)}
				color="secondary"
				sx={{ fontSize: "small" }}
			>
				<DeleteIcon />
			</IconButton>
		</CardActions>
	</Card>
);

export default PantryItemCard;
