import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import "./Login.css";

const theme = createTheme();

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // لحفظ رسائل الخطأ
  const [success, setSuccess] = useState(""); // لحفظ رسائل النجاح
  const [openDialog, setOpenDialog] = useState(false); // حالة إدارة ظهور الشاشة المنبثقة

  const handleSubmit = async (event) => {
    event.preventDefault();

    // تحقق من أن الحقول ليست فارغة
    if (!email.trim() || !password.trim()) {
      setError("the fields is empty");
      return;
    }

    try {
      // إرسال البيانات إلى الخادم
      const response = await axios.post(
        "https://books.sann-erp.com/api/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "x-api-key": "SANN_BOOKS",
          },
        }
      );

      // إذا كان الرد ناجحًا
      if (response.data.success) {
        setSuccess("Login Successfully");
        setError(""); // مسح أي رسائل خطأ
        setOpenDialog(true); // فتح الشاشة المنبثقة
        console.log("Response From Server", response.data);
      } else {
        setError(response.data.message || "error ");
        setOpenDialog(true); // فتح الشاشة المنبثقة لعرض الخطأ
      }
    } catch (err) {
      // إذا كان هناك خطأ في الاتصال أو من الخادم
      setError(err.response?.data?.message || "حدث خطأ في الاتصال بالخادم.");
      setOpenDialog(true); // فتح الشاشة المنبثقة لعرض الخطأ
      console.error("حدث خطأ:", err);
    }
  };

  // إغلاق الشاشة المنبثقة
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // تحقق من أن الحقول ليست فارغة
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography component="h1" variant="h5">
            Login Page
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isFormValid} // تعطيل الزر إذا لم يتم تعبئة الحقول
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>

      {/* الشاشة المنبثقة */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>{success ? "Login Successfully!" : "Error!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {success || error} {/* عرض رسالة النجاح أو الخطأ */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoginPage;
