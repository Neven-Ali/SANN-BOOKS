import React, { useEffect, useState } from "react";
import { Switch, FormControlLabel, IconButton } from "@mui/material";
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
import AddIcon from "@mui/icons-material/Add"; // استيراد أيقونة الإضافة

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
  country_state_id: Yup.string().required("This field is required"),
  currency_id: Yup.string().required("This field is required"),
  time_zone_id: Yup.string().required("This field is required"),
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
  plan_id: Yup.string().required("This field is required"),
  plan_price_id: Yup.string().required("This field is required"),
  plan_type: Yup.string().required("This field is required"),
  street1: Yup.string(), // إضافة الحقل الجديد
  street2: Yup.string(), // إضافة الحقل الجديد
  city: Yup.string(), // إضافة الحقل الجديد
});

const RegisterPage2 = () => {
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [showVatFields, setShowVatFields] = useState(false);
  const [states, setStates] = useState([]);
  const [plans, setPlans] = useState([]);
  const [prices, setPrices] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false); // حالة جديدة لتتبع ظهور الحقول الإضافية
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `https://books.sann-erp.com/api/auth/register`,
        values,
        {
          headers: {
            "x-api-key": "SANN_BOOKS",
          },
        }
      );

      console.log("API Response:", response.data);
      alert(response.data.message || "Registration successful!");
    } catch (error) {
      console.error(
        "Failed to register:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      industry_id: "",
      language: "",
      organization_name_en: "",
      organization_name_ar: "",
      email: "",
      password: "",
      country_id: "",
      country_state_id: "",
      currency_id: "",
      time_zone_id: "",
      registered_for_vat: false,
      tax_registration_number_label: "",
      tax_registration_number: "",
      vat_registered_on: "",
      plan_id: "",
      plan_price_id: "",
      plan_type: "",
      street1: "", // إضافة الحقل الجديد
      street2: "", // إضافة الحقل الجديد
      city: "", // إضافة الحقل الجديد
      postal_code: "", // إضافة الحقل الجديد
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  // جلب بيانات الدول
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

        console.log("Countries API Response:", response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          setCountries(response.data.data);
        } else {
          console.error("Countries data is not an array:", response.data);
          setCountries([]);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setCountries([]);
      }
    };

    fetchCountries();
  }, []);

  // جلب بيانات العملات
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

  // جلب بيانات المناطق الزمنية
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

  // جلب بيانات الصناعات
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

  // جلب بيانات الخطط
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "https://books.sann-erp.com/api/subscription/plans",
          {
            headers: {
              "x-api-key": "SANN_BOOKS",
            },
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          setPlans(response.data.data);
        } else {
          console.error("Plans data is not an array:", response.data);
          setPlans([]);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        setPlans([]);
      }
    };

    fetchPlans();
  }, []);

  // تحديث حالة showVatFields عند تغيير قيمة registered_for_vat
  useEffect(() => {
    setShowVatFields(formik.values.registered_for_vat);
  }, [formik.values.registered_for_vat]);

  // تحديث العملة المقابلة للدولة المحددة
  useEffect(() => {
    if (formik.values.country_id) {
      const selectedCountry = countries.find(
        (country) => country.id === formik.values.country_id
      );

      if (selectedCountry) {
        formik.setFieldValue("currency_id", selectedCountry.currency);
      } else {
        formik.setFieldValue("currency_id", "");
      }
    } else {
      formik.setFieldValue("currency_id", "");
    }
  }, [formik.values.country_id, countries]);

  // تحديث قائمة الولايات عند تغيير الدولة المحددة
  useEffect(() => {
    if (formik.values.country_id) {
      const selectedCountry = countries.find(
        (country) => country.id === formik.values.country_id
      );
      if (selectedCountry) {
        setStates(selectedCountry.country_states);
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
    }
  }, [formik.values.country_id, countries]);

  // تحديث قائمة الأسعار عند تغيير الخطة المحددة
  useEffect(() => {
    if (formik.values.plan_id) {
      const selectedPlan = plans.find(
        (plan) => plan.id === formik.values.plan_id
      );
      if (selectedPlan) {
        setPrices(selectedPlan.prices);
      } else {
        setPrices([]);
      }
    } else {
      setPrices([]);
    }
  }, [formik.values.plan_id, plans]);
  useEffect(() => {
    if (formik.values.country_id && formik.values.country_state_id) {
      const selectedCountry = countries.find(
        (country) => country.id === formik.values.country_id
      );

      if (selectedCountry) {
        const selectedState = selectedCountry.country_states.find(
          (state) => state.id === formik.values.country_state_id
        );

        if (selectedState) {
          formik.setFieldValue("postal_code", selectedState.zip_code);
        } else {
          formik.setFieldValue("postal_code", "");
        }
      } else {
        formik.setFieldValue("postal_code", "");
      }
    } else {
      formik.setFieldValue("postal_code", "");
    }
  }, [formik.values.country_id, formik.values.country_state_id, countries]);

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

        {/* حقل country_state_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            id="country_state_id"
            name="country_state_id"
            value={formik.values.country_state_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.country_state_id &&
              Boolean(formik.errors.country_state_id)
            }
            label="State"
          >
            {states.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {formik.values.language === "ar"
                  ? state.name_ar
                  : state.name_en}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.country_state_id &&
            formik.errors.country_state_id && (
              <Typography color="error" variant="body2">
                {formik.errors.country_state_id}
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
            disabled
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

        {/* حقل time_zone_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="timezone-label">Timezone</InputLabel>
          <Select
            labelId="timezone-label"
            id="time_zone_id"
            name="time_zone_id"
            value={formik.values.time_zone_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.time_zone_id && Boolean(formik.errors.time_zone_id)
            }
            label="Timezone"
          >
            {timezones.map((timezone) => (
              <MenuItem key={timezone.id} value={timezone.id}>
                {timezone.name} ({timezone.offset})
              </MenuItem>
            ))}
          </Select>
          {formik.touched.time_zone_id && formik.errors.time_zone_id && (
            <Typography color="error" variant="body2">
              {formik.errors.time_zone_id}
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

        {/* زر إضافة الحقول الإضافية */}
        <Box display="flex" alignItems="center" mt={2}>
          <IconButton
            onClick={() => setShowAdditionalFields(!showAdditionalFields)}
            color="primary"
          >
            <AddIcon />
          </IconButton>
          <Typography variant="body1">Add Address Fields</Typography>
        </Box>

        {/* الحقول الإضافية تظهر فقط إذا تم النقر على الزر */}
        {showAdditionalFields && (
          <>
            {/* حقل street1 */}
            <TextField
              fullWidth
              label="Street 1"
              name="street1"
              value={formik.values.street1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.street1 && Boolean(formik.errors.street1)}
              helperText={formik.touched.street1 && formik.errors.street1}
              margin="normal"
            />

            {/* حقل street2 */}
            <TextField
              fullWidth
              label="Street 2"
              name="street2"
              value={formik.values.street2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.street2 && Boolean(formik.errors.street2)}
              helperText={formik.touched.street2 && formik.errors.street2}
              margin="normal"
            />

            {/* حقل city */}
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              margin="normal"
            />
          </>
        )}

        {/* حقل plan_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="plan-label">Plan</InputLabel>
          <Select
            labelId="plan-label"
            id="plan_id"
            name="plan_id"
            value={formik.values.plan_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.plan_id && Boolean(formik.errors.plan_id)}
            label="Plan"
          >
            {plans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {formik.values.language === "ar"
                  ? plan.plan_name_ar
                  : plan.plan_name_en}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.plan_id && formik.errors.plan_id && (
            <Typography color="error" variant="body2">
              {formik.errors.plan_id}
            </Typography>
          )}
        </FormControl>

        {/* حقل plan_price_id */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="plan-price-label">Plan Price</InputLabel>
          <Select
            labelId="plan-price-label"
            id="plan_price_id"
            name="plan_price_id"
            value={formik.values.plan_price_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.plan_price_id &&
              Boolean(formik.errors.plan_price_id)
            }
            label="Plan Price"
          >
            {prices.map((price) => (
              <MenuItem key={price.id} value={price.id}>
                {formik.values.language === "ar"
                  ? price.monthly_price_ar
                  : price.monthly_price_en}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.plan_price_id && formik.errors.plan_price_id && (
            <Typography color="error" variant="body2">
              {formik.errors.plan_price_id}
            </Typography>
          )}
        </FormControl>

        {/* حقل plan_type */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="plan-type-label">Plan Type</InputLabel>
          <Select
            labelId="plan-type-label"
            id="plan_type"
            name="plan_type"
            value={formik.values.plan_type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.plan_type && Boolean(formik.errors.plan_type)}
            label="Plan Type"
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </Select>
          {formik.touched.plan_type && formik.errors.plan_type && (
            <Typography color="error" variant="body2">
              {formik.errors.plan_type}
            </Typography>
          )}
        </FormControl>

        {/* زر الإرسال */}
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default RegisterPage2;
