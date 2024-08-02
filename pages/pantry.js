import { useEffect, useState } from "react";
import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
	getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
	Container,
	ListItem,
	Typography,
	TextField,
	Button,
	Box,
	List,
	IconButton,
	Divider,
	Paper,
	Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Pantry = () => {
	const [items, setItems] = useState([]);
	const [item, setItem] = useState({ name: "", quantity: 1 });
	const [editItem, setEditItem] = useState(null);
	const [showAddItem, setShowAddItem] = useState(false);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "pantry"));
				const itemsList = querySnapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setItems(itemsList);
			} catch (error) {
				console.error("Error fetching items: ", error);
			}
		};
		fetchItems();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setItem({
			...item,
			[name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
		});
	};

	const handleToggleForm = () => {
		setShowAddItem(!showAddItem);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!item.quantity) item.quantity = 1;
			if (editItem) {
				const itemRef = doc(db, "pantry", editItem.id);
				await updateDoc(itemRef, { quantity: item.quantity });
				setEditItem(null);
			} else {
				const existingItem = items.find((i) => i.name === item.name);
				if (existingItem) {
					const itemRef = doc(db, "pantry", existingItem.id);
					await updateDoc(itemRef, { quantity: existingItem.quantity + 1 });
				} else {
					await addDoc(collection(db, "pantry"), {
						name: item.name,
						quantity: 1,
					});
				}
			}
			setItem({ name: "", quantity: 1 });
			setShowAddItem(false);
			const querySnapshot = await getDocs(collection(db, "pantry"));
			const itemsList = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setItems(itemsList);
		} catch (error) {
			console.error("Error adding/updating document: ", error);
		}
	};

	const handleEdit = (item) => {
		setItem({ name: item.name, quantity: item.quantity });
		setEditItem(item);
	};

	const handleDelete = async (id) => {
		try {
			await deleteDoc(doc(db, "pantry", id));
			const querySnapshot = await getDocs(collection(db, "pantry"));
			const itemsList = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setItems(itemsList);
		} catch (error) {
			console.error("Error deleting document: ", error);
		}
	};

	const handleQuantityChange = async (id, change) => {
		try {
			const itemRef = doc(db, "pantry", id);
			const itemSnapshot = await getDoc(itemRef);
			const itemData = itemSnapshot.data();
			if (itemData.quantity + change <= 0) {
				await deleteDoc(itemRef);
			} else {
				await updateDoc(itemRef, { quantity: itemData.quantity + change });
			}
			const querySnapshot = await getDocs(collection(db, "pantry"));
			const itemsList = querySnapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setItems(itemsList);
		} catch (error) {
			console.error("Error updating quantity: ", error);
		}
	};

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100vh",
				overflow: "hidden",
			}}
		>
			<Button
				variant="contained"
				color="primary"
				onClick={handleToggleForm}
				sx={{ mt: 2 }}
			>
				{" "}
				{showAddItem ? "Cancel" : "Add Item"}{" "}
			</Button>
			<Box sx={{ width: "500px", p: 3, boxShadow: 3 }}>
				<Typography variant="h4" gutterBottom>
					Your Pantry Items
				</Typography>
				{showAddItem && (
					<Box component="form" onSubmit={handleSubmit} mb={3}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									name="name"
									label="Item Name"
									value={item.name}
									onChange={handleChange}
									required
									fullWidth
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									name="quantity"
									label="Quantity"
									type="number"
									value={item.quantity || ""}
									onChange={handleChange}
									required
									fullWidth
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{ mt: 2 }}
						>
							{editItem ? "Update Item" : "Add Item"}
						</Button>
					</Box>
				)}
				<Box sx={{ height: "300px", overflow: "auto", mt: 2 }}>
					<List>
						{items.map((item, index) => (
							<Box
								key={item.id}
								sx={{
									bgcolor: index % 2 === 0 ? "background.paper" : "grey.100",
								}}
							>
								<ListItem>
									<Grid container alignItems="center">
										<Grid item xs={6}>
											<Typography variant="body1">{item.name}</Typography>
										</Grid>
										<Grid item xs={6} container justifyContent="flex-end">
											<IconButton
												onClick={() => handleQuantityChange(item.id, 1)}
											>
												<AddIcon />
											</IconButton>
											<Box
												sx={{
													border: "1px solid #ccc",
													borderRadius: "4px",
													padding: "0 8px",
													display: "inline-block",
													minWidth: "30px",
													textAlign: "center",
												}}
											>
												{item.quantity}
											</Box>
											<IconButton
												onClick={() => handleQuantityChange(item.id, -1)}
											>
												<RemoveIcon />
											</IconButton>
											<IconButton
												onClick={() => handleEdit(item)}
												color="primary"
											>
												<EditIcon />
											</IconButton>
											<IconButton
												onClick={() => handleDelete(item.id)}
												color="secondary"
											>
												<DeleteIcon />
											</IconButton>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
							</Box>
						))}
					</List>
				</Box>
			</Box>
		</Container>
	);
};

export default Pantry;
