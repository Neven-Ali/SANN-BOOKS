import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false); // حالة لإدارة تعطيل زر إعادة الإرسال

  const handleSendCode = () => {
    // هنا يمكنك إضافة منطق إرسال الرمز إلى البريد الإلكتروني
    // مثلاً، استدعاء API لإرسال الرمز
    setMessage('تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
    setIsCodeSent(true);
    setIsResendDisabled(true); // تعطيل زر إعادة الإرسال بعد الإرسال الأول

    // تمكين زر إعادة الإرسال بعد 60 ثانية (مثال)
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 60000); // 60 ثانية
  };

  const handleResendCode = () => {
    // هنا يمكنك إعادة إرسال الرمز
    setMessage('تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني.');
    setIsResendDisabled(true); // تعطيل الزر مرة أخرى

    // تمكين زر إعادة الإرسال بعد 60 ثانية (مثال)
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 60000); // 60 ثانية
  };

  const handleVerifyCode = () => {
    // هنا يمكنك إضافة منطق التحقق من الرمز
    // مثلاً، استدعاء API للتحقق من الرمز
    if (code === '123456') { // هذا مجرد مثال، يجب أن يكون الرمز ديناميكيًا
      setMessage('تم التحقق من البريد الإلكتروني بنجاح!');
    } else {
      setMessage('رمز التحقق غير صحيح.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          تحقق من البريد الإلكتروني
        </Typography>
        <TextField
          fullWidth
          label="البريد الإلكتروني"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendCode}
          sx={{ mt: 2 }}
          disabled={!email || isCodeSent} // تعطيل الزر إذا كان البريد الإلكتروني فارغًا أو إذا تم إرسال الرمز بالفعل
        >
          إرسال رمز التحقق
        </Button>

        {isCodeSent && (
          <>
            <Typography variant="body1" sx={{ mt: 2, color: 'green' }}>
              تم إرسال رمز التحقق إلى بريدك الإلكتروني.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleResendCode}
              sx={{ mt: 2 }}
              disabled={isResendDisabled} // تعطيل الزر إذا كان معطلًا
            >
              إعادة إرسال الرمز
            </Button>
            <TextField
              fullWidth
              label="رمز التحقق"
              variant="outlined"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleVerifyCode}
              sx={{ mt: 2 }}
            >
              تحقق من الرمز
            </Button>
          </>
        )}

        {message && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default EmailVerification;