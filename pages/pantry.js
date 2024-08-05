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
import { Container, Grid, Box } from "@mui/material";
import Header from "../components/Header";
import AddItemForm from "../components/AddItemForm";
import PantryItemCard from "../components/PantryItemCard";
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
		setImageSrc(imageSrc);
	};

	const handleImageUpload = async (file) => {
		try {
			const storageRef = ref(storage, `images/${file.name}`);
			await uploadBytes(storageRef, file);
			const downloadURL = await getDownloadURL(storageRef);
			return downloadURL;
		} catch (error) {
			console.error("Error uploading image:", error);
			throw error;
		}
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
		setShowAddItem(true);
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
			maxWidth="md"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				mt: 4,
				mb: 4,
			}}
		>
			<Header
				onToggleForm={handleToggleForm}
				showAddItem={showAddItem}
				sx={{ width: "100%" }}
			/>
			{showAddItem && (
				<AddItemForm
					item={item}
					handleChange={handleChange}
					handleSubmit={handleSubmit}
					cameraMode={cameraMode}
					setCameraMode={setCameraMode}
					selectedFile={selectedFile}
					handleFileChange={handleFileChange}
					handleCapture={handleCapture}
					imageSrc={imageSrc}
					setImageSrc={setImageSrc}
					editItem={editItem}
				/>
			)}
			<Box sx={{ width: "100%", overflow: "auto" }}>
				<Grid container spacing={2}>
					{items.map((item) => (
						<Grid item xs={12} sm={6} md={4} key={item.id}>
							<PantryItemCard
								item={item}
								handleEdit={handleEdit}
								handleDelete={handleDelete}
								handleQuantityChange={handleQuantityChange}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</Container>
	);
};

export default Pantry;
