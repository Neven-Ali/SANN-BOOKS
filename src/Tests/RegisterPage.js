import React, { useEffect, useState } from "react";
import { Switch, FormControlLabel } from "@mui/material";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// تعريف schema للتحقق من صحة البيانات باستخدام Yup
const validationSchema = Yup.object({
  industry_id: Yup.string().required("This field is required"),
  language: Yup.string()
    .oneOf(["en", "ar"], "Language must be English (en) or Arabic (ar)")
    .required("This field is required"),
  organization_name_en: Yup.string().required("This field is required"),
  organization_name_ar: Yup.string().required("This field is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("This field is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("This field is required")
    .matches(
      /^(?=.*[a-z])/, // حرف صغير
      "The password must contain at least one lowercase letter."
    )
    .matches(
      /^(?=.*[A-Z])/, // حرف كبير
      "The password must contain at least one uppercase letter."
    )
    .matches(
      /^(?=.*\W)/, // رمز
      "The password must contain at least one symbol."
    ),

  country_id: Yup.string().required("This field is required"),
  currency_id: Yup.string().required("This field is required"),
  timezone_id: Yup.string().required("This field is required"),
  registered_for_vat: Yup.boolean(),
  tax_registration_number_label: Yup.string().when("registered_for_vat", {
    is: true,
    then: Yup.string().required("This field is required"),
    otherwise: Yup.string().notRequired(),
  }),
  tax_registration_number: Yup.string().when("registered_for_vat", {
    is: true,
    then: Yup.string().required("This field is required"),
    otherwise: Yup.string().notRequired(),
  }),
  vat_registered_on: Yup.string().when("registered_for_vat", {
    is: true,
    then: Yup.string().required("This field is required"),
    otherwise: Yup.string().notRequired(),
  }),
});
const RegisterPage = () => {
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [showVatFields, setShowVatFields] = useState(false); // حالة جديدة لإظهار الحقول الإضافية

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://books.sann-erp.com/api/auth/countries",
          {
            headers: {
              "x-api-key": "SANN_BOOKS",
            },
          }
        );
        if (response.data.success) {
          setCountries(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://books.sann-erp.com/api/auth/currencies",
          {
            headers: {
              "x-api-key": "SANN_BOOKS",
            },
          }
        );
        if (response.data.success) {
          setCurrencies(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await axios.get(
          "https://books.sann-erp.com/api/auth/time-zones",
          {
            headers: {
              "x-api-key": "SANN_BOOKS",
            },
          }
        );
        if (response.data.success) {
          setTimezones(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch timezones:", error);
      }
    };

    fetchTimezones();
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get(
          "https://books.sann-erp.com/api/auth/industries",
          {
            headers: {
              "x-api-key": "SANN_BOOKS",
            },
          }
        );
        if (response.data.success) {
          setIndustries(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch industries:", error);
      }
    };

    fetchIndustries();
  }, []);

  const formik = useFormik({
    initialValues: {
      industry_id: "",
      language: "",
      organization_name_en: "",
      organization_name_ar: "",
      email: "",
      password: "",
      country_id: "",
      currency_id: "",
      timezone_id: "",
      registered_for_vat: false,
      tax_registration_number_label: "",
      tax_registration_number: "",
      vat_registered_on: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
    },
  });

  // تحديث حالة showVatFields عند تغيير قيمة registered_for_vat
  useEffect(() => {
    setShowVatFields(formik.values.registered_for_vat);
  }, [formik.values.registered_for_vat]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Set up your organization profile
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h6" gutterBottom>
          ORGANIZATIONAL DETAILS
        </Typography>

        {/* حقل industry_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="industry-label">Industry</InputLabel>
          <Select
            labelId="industry-label"
            id="industry_id"
            name="industry_id"
            value={formik.values.industry_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.industry_id && Boolean(formik.errors.industry_id)
            }
            label="Industry"
          >
            {industries.map((industry) => (
              <MenuItem key={industry.id} value={industry.id}>
                {formik.values.language === "ar"
                  ? industry.name_ar
                  : industry.name_en}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.industry_id && formik.errors.industry_id && (
            <Typography color="error" variant="body2">
              {formik.errors.industry_id}
            </Typography>
          )}
        </FormControl>

        {/* حقل language */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="language-label">Language</InputLabel>
          <Select
            labelId="language-label"
            id="language"
            name="language"
            value={formik.values.language}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.language && Boolean(formik.errors.language)}
            label="Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ar">العربية</MenuItem>
          </Select>
          {formik.touched.language && formik.errors.language && (
            <Typography color="error" variant="body2">
              {formik.errors.language}
            </Typography>
          )}
        </FormControl>

        {/* حقل organization_name_en */}
        <TextField
          fullWidth
          label="organization_name_en"
          name="organization_name_en"
          value={formik.values.organization_name_en}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.organization_name_en &&
            Boolean(formik.errors.organization_name_en)
          }
          helperText={
            formik.touched.organization_name_en &&
            formik.errors.organization_name_en
          }
          margin="normal"
        />

        {/* حقل organization_name_ar */}
        <TextField
          fullWidth
          label="organization_name_ar"
          name="organization_name_ar"
          value={formik.values.organization_name_ar}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.organization_name_ar &&
            Boolean(formik.errors.organization_name_ar)
          }
          helperText={
            formik.touched.organization_name_ar &&
            formik.errors.organization_name_ar
          }
          margin="normal"
        />

        {/* حقل email */}
        <TextField
          fullWidth
          label="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        {/* حقل password */}
        <TextField
          fullWidth
          label="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />

        {/* حقل country_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            id="country_id"
            name="country_id"
            value={formik.values.country_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.country_id && Boolean(formik.errors.country_id)
            }
            label="Country"
          >
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {formik.values.language === "ar"
                  ? country.name_ar
                  : country.name_en}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.country_id && formik.errors.country_id && (
            <Typography color="error" variant="body2">
              {formik.errors.country_id}
            </Typography>
          )}
        </FormControl>

        {/* حقل currency_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="currency-label">Currency</InputLabel>
          <Select
            labelId="currency-label"
            id="currency_id"
            name="currency_id"
            value={formik.values.currency_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.currency_id && Boolean(formik.errors.currency_id)
            }
            label="Currency"
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.id} value={currency.id}>
                {formik.values.language === "ar"
                  ? currency.currency_name_ar
                  : currency.currency_name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.currency_id && formik.errors.currency_id && (
            <Typography color="error" variant="body2">
              {formik.errors.currency_id}
            </Typography>
          )}
        </FormControl>

        {/* حقل timezone_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="timezone-label">Timezone</InputLabel>
          <Select
            labelId="timezone-label"
            id="timezone_id"
            name="timezone_id"
            value={formik.values.timezone_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.timezone_id && Boolean(formik.errors.timezone_id)
            }
            label="Timezone"
          >
            {timezones.map((timezone) => (
              <MenuItem key={timezone.id} value={timezone.id}>
                {timezone.name} ({timezone.offset})
              </MenuItem>
            ))}
          </Select>
          {formik.touched.timezone_id && formik.errors.timezone_id && (
            <Typography color="error" variant="body2">
              {formik.errors.timezone_id}
            </Typography>
          )}
        </FormControl>

        {/* حقل registered_for_vat */}
        <FormControlLabel
          control={
            <Switch
              id="registered_for_vat"
              name="registered_for_vat"
              checked={formik.values.registered_for_vat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              color="primary"
            />
          }
          label="Registered for VAT"
        />

        {/* الحقول الإضافية تظهر فقط إذا كان registered_for_vat هو true */}
        {showVatFields && (
          <>
            {/* حقل tax_registration_number_label */}
            <TextField
              fullWidth
              label="Tax Registration Number Label"
              name="tax_registration_number_label"
              value={formik.values.tax_registration_number_label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.tax_registration_number_label &&
                Boolean(formik.errors.tax_registration_number_label)
              }
              helperText={
                formik.touched.tax_registration_number_label &&
                formik.errors.tax_registration_number_label
              }
              margin="normal"
            />

            {/* حقل tax_registration_number */}
            <TextField
              fullWidth
              label="Tax Registration Number"
              name="tax_registration_number"
              value={formik.values.tax_registration_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.tax_registration_number &&
                Boolean(formik.errors.tax_registration_number)
              }
              helperText={
                formik.touched.tax_registration_number &&
                formik.errors.tax_registration_number
              }
              margin="normal"
            />

            {/* حقل vat_registered_on */}
            <TextField
              fullWidth
              label="VAT Registered On"
              name="vat_registered_on"
              type="date"
              value={formik.values.vat_registered_on}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.vat_registered_on &&
                Boolean(formik.errors.vat_registered_on)
              }
              helperText={
                formik.touched.vat_registered_on &&
                formik.errors.vat_registered_on
              }
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        )}

        {/* زر الإرسال */}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default RegisterPage;
