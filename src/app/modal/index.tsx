
import { Container, Typography, Box, Button, Modal } from '@mui/material';
import EditSection from "../edit/[id]/editSection";




const ModalBox = ({ 
    open, onClose, modalWidth, settingHeight, settingWidth, setGrayscale, grayscale, 
    setBlur, blur, setDimensions, dimensions, handleEditedImageDownload
}: {
    open: boolean,
    onClose: () => void,
    dimensions: { width: number, height: number },
    setDimensions: ({ width, height }: { width: number, height: number }) => void,
    modalWidth: number,
    settingHeight: number,
    settingWidth: number,
    setGrayscale: (value: boolean) => void, 
    grayscale: boolean,
    setBlur: (value: number) => void, 
    blur: number,
    handleEditedImageDownload: () => void,
}) => {



    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        // bgcolor: "background.paper",
        bgcolor: "#bbb",
        border: "2px solid #000",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        width: modalWidth,
        height: "80%",
        maxWidth: 800,
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center",
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Image
                </Typography>
    
                <Container 
                    sx={{ 
                        width: "100%", 
                        height: "100%", 
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: 1,
                    }}
                >
                    {/* <Stage 
                        ref={stageRef} 
                        width={dimensions.width} 
                        height={dimensions.height} 
                    >
                        <Layer>
                            {image && (
                                <>
                                    <KonvaImage
                                        ref={imageRef}
                                        image={image}
                                        draggable
                                        onTransformEnd={handleTransformEnd}
                                        onClick={() => setSelected(!selected)}
                                        onTap={() => setSelected(!selected)}
                                        onDragMove={handleDragMove}
                                        onDragEnd={handleDragEnd}
                                        x={imagePosition.x} 
                                        y={imagePosition.y}
                                        width={dimensions.width}
                                        height={dimensions.height}
                                    />
                                    { selected && <Transformer borderEnabled={true} ref={transformerRef} /> }
                                </>
                            )}
                        </Layer>
                    </Stage> */}
                    <EditSection 
                        settingHeight={settingHeight} 
                        settingWidth={settingWidth} 
                        setGrayscale={setGrayscale}
                        grayscale={grayscale}
                        setBlur={setBlur}
                        blur={blur}
                        setDimensions={setDimensions}
                        dimensions={dimensions}
                    />
                </Container>
    
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        width: "60%",
                        mt: 2,
                    }}
                >
                    <Button variant="contained" color="primary" onClick={handleEditedImageDownload}>
                        Download
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalBox;








