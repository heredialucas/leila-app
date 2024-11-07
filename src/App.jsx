import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import { menu } from "./menu";

export default function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [currentCommentItem, setCurrentCommentItem] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const savedItems = localStorage.getItem("selectedItems");
    if (savedItems) {
      setSelectedItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const filteredMenu = menu.filter(
    (item) =>
      item.position.toString().includes(filter) ||
      item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (item) => {
    setSelectedItem(item);
    setFilter(`${item.position} - ${item.name}`);
  };

  const handleAdd = () => {
    if (selectedItem) {
      setSelectedItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.position === selectedItem.position
        );
        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        } else {
          return [...prevItems, { ...selectedItem, quantity, comment: "" }];
        }
      });
      setSelectedItem(null);
      setQuantity(1);
      setFilter("");
    }
  };

  const handleQuantityChange = (position, newQuantity) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.position === position ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDelete = (position) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((item) => item.position !== position)
    );
  };

  const handleOpenCommentDialog = (item) => {
    setCurrentCommentItem(item);
    setComment(item.comment || "");
    setCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
    setCurrentCommentItem(null);
    setComment("");
  };

  const handleSaveComment = () => {
    if (currentCommentItem) {
      setSelectedItems((prevItems) =>
        prevItems.map((item) =>
          item.position === currentCommentItem.position
            ? { ...item, comment }
            : item
        )
      );
    } else {
      setSelectedItems((prevItems) =>
        prevItems.map((item) => ({ ...item, comment }))
      );
    }
    handleCloseCommentDialog();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 3 }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            {"Leila's orders"}
          </h1>

          <Box sx={{ display: "flex", marginBottom: 2, gap: 1 }}>
            <TextField
              label="Filter by name"
              variant="outlined"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              fullWidth
            />
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || "")}
              sx={{ width: "100px" }}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={!selectedItem}
            >
              Add
            </Button>
          </Box>

          <List
            component={Paper}
            sx={{ maxHeight: "200px", overflow: "auto", marginBottom: 2 }}
          >
            {filteredMenu.map((item) => (
              <ListItem
                key={item.position}
                button
                onClick={() => handleSelect(item)}
                selected={selectedItem?.position === item.position}
                style={{
                  backgroundColor: `${item.color}`,
                  fontWeight: "bolder",
                }}
              >
                <ListItemText primary={`${item.position} - ${item.name}`} />
              </ListItem>
            ))}
          </List>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow
                    style={{
                      backgroundColor: `${item.color}`,
                      fontWeight: "bolder",
                    }}
                    key={item.position}
                  >
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.position,
                            parseInt(e.target.value) || ""
                          )
                        }
                        sx={{ width: "60px" }}
                      />
                    </TableCell>
                    <TableCell>{item.comment}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenCommentDialog(item)}>
                        <CommentIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.position)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Dialog open={commentDialogOpen} onClose={handleCloseCommentDialog}>
        <DialogTitle>
          {currentCommentItem
            ? `Comentario para ${currentCommentItem.name}`
            : "Comentario para todos los ítems"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentario"
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommentDialog}>Cancelar</Button>
          <Button onClick={handleSaveComment}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
