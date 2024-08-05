import {
	Box,
	TextField,
	Button,
	ToggleButton,
	ToggleButtonGroup,
} from "@mui/material";
import Webcam from "react-webcam";
import React, { useRef } from "react";

const AddItemForm = ({
	item,
	handleChange,
	handleSubmit,
	cameraMode,
	setCameraMode,
	selectedFile,
	handleFileChange,
	handleCapture,
	imageSrc,
	setImageSrc,
	editItem,
}) => {
	const webcamRef = useRef(null);

	return (
		<Box
			component="form"
			onSubmit={handleSubmit}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				width: "100%",
				maxWidth: "600px",
				mb: 4,
			}}
		>
			<TextField
				name="name"
				label="Item Name"
				value={item.name}
				onChange={handleChange}
				required
				fullWidth
			/>
			<TextField
				name="quantity"
				label="Quantity"
				type="number"
				value={item.quantity || ""}
				onChange={handleChange}
				required
				fullWidth
			/>
			<ToggleButtonGroup
				value={cameraMode ? "camera" : "upload"}
				exclusive
				onChange={(e, newCameraMode) =>
					setCameraMode(newCameraMode === "camera")
				}
				aria-label="camera mode"
				sx={{ alignSelf: "center", mb: 2 }}
			>
				<ToggleButton value="camera" aria-label="use camera">
					Use Camera
				</ToggleButton>
				<ToggleButton value="upload" aria-label="upload file">
					Upload File
				</ToggleButton>
			</ToggleButtonGroup>
			{cameraMode ? (
				<Box
					sx={{
						position: "relative",
						width: "100%",
						height: "200px",
						mb: 2,
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
						style={{ borderRadius: "8px" }}
					/>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							mt: 2,
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={handleCapture}
							sx={{
								backgroundColor: "#03a9f4",
							}}
						>
							Capture Photo
						</Button>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							sx={{
								backgroundColor: editItem ? "#ff9800" : "#4caf50",
							}}
						>
							{editItem ? "Update Item" : "Add Item"}
						</Button>
					</Box>
				</Box>
			) : (
				<>
					<Button
						variant="outlined"
						component="label"
						sx={{ width: "100%", mb: 2 }}
					>
						Upload File
						<input
							type="file"
							accept="image/*"
							hidden
							onChange={handleFileChange}
						/>
					</Button>
					{imageSrc && (
						<Box mt={2} sx={{ textAlign: "center" }}>
							<img
								src={imageSrc}
								alt="Captured"
								style={{
									maxWidth: "100%",
									maxHeight: "200px",
									borderRadius: "8px",
								}}
							/>
						</Box>
					)}
					<Button
						type="submit"
						variant="contained"
						color="primary"
						sx={{
							backgroundColor: editItem ? "#ff9800" : "#4caf50",
						}}
					>
						{editItem ? "Update Item" : "Add Item"}
					</Button>
				</>
			)}
		</Box>
	);
};

export default AddItemForm;
