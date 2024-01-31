import React, { useEffect, useState } from "react";
import cookies from "js-cookie";
import client from "../../utils/build-client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const Books = () => {
  const [books, setBooks] = useState([]);
  const [mode, setMode] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = (book) => {
    setOpen(true);
    setFormData(book);
  };
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", formData.image);
      console.log(formDataToSend);

      const response = await client.post("/book", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // important
        },
      });
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("image", formData.image);
      console.log(formDataToSend);

      const response = await client.put(
        `/book/${selectedBook._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // important
          },
        }
      );

      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (book) => {
    console.log(book);
    await client.delete(`/book/${book._id}`);
    window.location.reload();
    try {
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function getBooks() {
      try {
        const response = await client.get("/book");
        console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getBooks();
  }, []);

  return (
    <div>
      {cookies.get("isAdmin") === "true" ? (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Image</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books?.map((book) => (
                  <TableRow
                    key={book._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {book.title}
                    </TableCell>
                    <TableCell>{book.description}</TableCell>
                    <TableCell align="right">
                      <img
                        src={`http://localhost:3001/${book.image}`}
                        style={{ maxWidth: 100 }}
                        alt=""
                      />
                    </TableCell>
                    <TableCell align="right">
                      <button
                        onClick={() => handleOpen(book)}
                        onMouseEnter={() => {
                          setMode("Edit");
                          setSelectedBook(book);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(book)}>Delete</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <button onClick={handleOpen} onMouseEnter={() => setMode("Add")}>
            Add
          </button>
          {/* Add and Edit Modal */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {mode === "Add" ? (
                <form onSubmit={handleAdd}>
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                  <br />
                  <label htmlFor="description">Description:</label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                  <br />
                  <label htmlFor="image">Image Upload:</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                  <br />
                  <button type="submit">Submit</button>
                </form>
              ) : (
                <form onSubmit={(e) => handleEdit(e)}>
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                    }}
                  />
                  <br />
                  <label htmlFor="description">Description:</label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                    }}
                  />
                  <br />
                  <label htmlFor="image">Image Upload:</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <br />
                  <button type="submit">Submit</button>
                </form>
              )}
            </Box>
          </Modal>
        </div>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books?.map((book) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {book.title}
                    </TableCell>
                    <TableCell>{book.description}</TableCell>
                    <TableCell align="right">{book.image}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};
