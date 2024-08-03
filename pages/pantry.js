import { useEffect, useRef, useState } from "react";
import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
	getDoc,
} from "firebase/firestore";
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../lib/firebase";
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
	Grid,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { searchPhotos } from "../lib/unsplash";
import Webcam from "react-webcam";

const Pantry = () => {
	const [items, setItems] = useState([]);
	const [item, setItem] = useState({ name: "", quantity: 1 });
	const [editItem, setEditItem] = useState(null);
	const [showAddItem, setShowAddItem] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [cameraMode, setCameraMode] = useState(false);
	const [imageSrc, setImageSrc] = useState(null);
	const webcamRef = useRef(null);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "pantry"));
				const itemsList = querySnapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				console.log("Fetched Items:", itemsList);
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

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
		setImageSrc(null);
	};

	const handleCapture = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		console.log("Captured Image Src:", imageSrc);
		setImageSrc(imageSrc);
	};

	const handleImageUpload = async (file) => {
		const storageRef = ref(storage, `images/${file.name}`);
		console.log("Uploading image:", file.name);
		await uploadBytes(storageRef, file);
		console.log("Image Download URL:", downloadURL);
		return await getDownloadURL(storageRef);
	};

	const handleToggleForm = () => {
		setShowAddItem(!showAddItem);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!item.quantity) item.quantity = 1;
			const capitalizeFirstLetter = (str) =>
				str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
			const CapitalizedItemName = capitalizeFirstLetter(item.name);
			let imageUrl;

			if (selectedFile) {
				imageUrl = await handleImageUpload(selectedFile);
			} else if (imageSrc) {
				const imageBlob = await (await fetch(imageSrc)).blob();
				const file = new File([imageBlob], "captured_image.jpg", {
					type: "image/jpeg",
				});
				imageUrl = await handleImageUpload(file);
			} else {
				imageUrl = await searchPhotos(CapitalizedItemName);
			}
			console.log("Image URL:", imageUrl);
			if (editItem) {
				const itemRef = doc(db, "pantry", editItem.id);
				await updateDoc(itemRef, {
					quantity: item.quantity,
					image: imageUrl,
					name: CapitalizedItemName,
				});
				setEditItem(null);
			} else {
				const existingItem = items.find((i) => i.name === CapitalizedItemName);
				if (existingItem) {
					const itemRef = doc(db, "pantry", existingItem.id);
					await updateDoc(itemRef, { quantity: existingItem.quantity + 1 });
				} else {
					await addDoc(collection(db, "pantry"), {
						name: CapitalizedItemName,
						quantity: 1,
						image: imageUrl,
					});
				}
			}
			setItem({ name: "", quantity: 1 });
			setSelectedFile(null);
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
							<Grid item xs={12}>
								<ToggleButtonGroup
									value={cameraMode ? "camera" : "upload"}
									exclusive
									onChange={(e, newCameraMode) =>
										setCameraMode(newCameraMode === "camera")
									}
									aria-label="camera mode"
								>
									<ToggleButton value="camera" aria-label="use camera">
										Use Camera
									</ToggleButton>
									<ToggleButton value="upload" aria-label="upload file">
										Upload File
									</ToggleButton>
								</ToggleButtonGroup>
							</Grid>
							<Grid item xs={12}>
								{cameraMode ? (
									<Box
										sx={{
											position: "relative",
											width: "100%",
											height: "200px",
											overflow: "hidden",
										}}
									>
										<Webcam
											audio={false}
											ref={webcamRef}
											screenshotFormat="image/jpeg"
											width="100%"
											videoConstraints={{
												facingMode: "user",
											}}
										/>
										<Button
											variant="contained"
											color="primary"
											onClick={handleCapture}
											sx={{ mt: 2 }}
										>
											Capture Photo
										</Button>
									</Box>
								) : (
									<input
										type="file"
										accept="image/*"
										onChange={handleFileChange}
									/>
								)}
								{imageSrc && (
									<Box mt={2}>
										<img src={imageSrc} alt="Captured" width="100%" />
									</Box>
								)}
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
									{item.image && (
										<img
											src={item.image}
											alt={item.name}
											style={{
												width: "100px",
												height: "auto",
												marginRight: "16px",
											}}
										/>
									)}
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
