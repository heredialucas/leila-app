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

const menu = [
  // Cold Mezze Section
  { position: 12, name: "Hummus" },
  { position: 13, name: "Hummus with sun-dried tomatoes" },
  { position: 14, name: "Hummus with Pesto sauce" },
  { position: 15, name: "Hummus tartufo" },
  { position: 16, name: "Maghmour" },
  { position: 17, name: "Baba Ghanouj" },
  { position: 18, name: "Muhammara" },
  { position: 19, name: "Labneh" },
  { position: 20, name: "Labneh Bi Thoum" },
  { position: 21, name: "Labneh W Zaatar" },
  { position: 22, name: "Makdous" },
  { position: 23, name: "Shanklish" },
  { position: 24, name: "Warak Enab - Stuffed grape leaves" },
  { position: 25, name: "Rahib" },
  // Hot Mezze Section
  { position: 26, name: "Hummus Lahmeh" },
  { position: 27, name: "Hummus Awarma" },
  { position: 28, name: "Hummus with Chicken liver" },
  { position: 29, name: "Batata Kouzbara" },
  { position: 30, name: "Batata Harra" },
  { position: 31, name: "Fatteh hummus" },
  { position: 32, name: "Fatteh Batenjen" },
  { position: 33, name: "Fatteh with Meat" },
  { position: 34, name: "Chicken liver" },
  { position: 35, name: "Kebbeh 4 pcs" },
  { position: 36, name: "Cheese Rakakat 4 pcs" },
  { position: 37, name: "Sambousik meat 4 pcs" },
  { position: 38, name: "Falafel with Taratour Sauce" },
  { position: 39, name: "Fatayer 4 pcs" },
  { position: 40, name: "Makanek" },
  { position: 41, name: "Acquadella" },
  { position: 42, name: "Fried Cauliflower" },

  // Grill Section
  { position: 43, name: "Chicken Tawouk" },
  { position: 44, name: "Kafta" },
  { position: 45, name: "Grilled Lamb" },
  { position: 46, name: "Kastaleta" },
  { position: 47, name: "Mix grill plate" },
  { position: 48, name: "Double Mix grill plate" },
  { position: 49, name: "Shawarma meat plate" },
  { position: 50, name: "Arayes" },

  // Oven Section
  { position: 51, name: "Sfíha" },
  { position: 52, name: "Manakish Zaatar" },
  { position: 53, name: "Manakish jebne" },
  { position: 54, name: "Fokhara Djej" },
  { position: 55, name: "Fokhara Lahme" },
  { position: 56, name: "Fokhara Khodra" },

  // Salads Section
  { position: 57, name: "Tabbouleh" },
  { position: 58, name: "Tabbouleh Quinoa" },
  { position: 59, name: "Fattouche" },
  { position: 60, name: "Rokka dates salad" },

  // Soups Section
  { position: 61, name: "Lentil Soup" },

  // Siders Section
  { position: 62, name: "French fries" },
  { position: 63, name: "Rice" },
  { position: 64, name: "Gluten free Bread" },
  { position: 65, name: "Lebanese Bread (2 pcs)" },
  { position: 66, name: "Mixed pickles" },
  { position: 67, name: "Garlic Cream" },

  // Desserts Section
  { position: 68, name: "Baklava" },
  { position: 69, name: "Mohallabieyeh" },
  { position: 70, name: "Halawet El Jibn" },
  { position: 71, name: "Mafroukeh" },
  { position: 72, name: "Kunafa" },

  // Kids Menu
  {
    position: 73,
    name: "Chicken Nuggets with fries, ketchup & glass of juice (200ml)",
  },
];

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
            Orders Leilas
          </h1>

          <Box sx={{ display: "flex", marginBottom: 2, gap: 1 }}>
            <TextField
              label="Filtrar por posición o nombre"
              variant="outlined"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              fullWidth
            />
            <TextField
              label="Cantidad"
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
              >
                <ListItemText primary={`${item.position} - ${item.name}`} />
              </ListItem>
            ))}
          </List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<CommentIcon />}
              onClick={() => handleOpenCommentDialog(null)}
            >
              Comments
            </Button>
          </Box>

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
                  <TableRow key={item.position}>
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
