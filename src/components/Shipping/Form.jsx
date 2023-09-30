import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ShippingIcon from '@mui/icons-material/LocalShipping';
import { AppContext, AppDispatchContext } from '../../context';
import Copyright from '../../Copyright';
import Checkbox from '../../Checkbox';
import Input from '../../Input';
import Invoice from './Invoice';

const schema = yup
  .object({
    customer: yup.object().shape({
      firstName: yup.string().required('نام الزامی است.'),
      lastName: yup.string().required('نام خانوادگی الزامی است.'),
      mobile: yup.string().required('شماره موبایل الزامی است.'),
      address: yup.string().required('آدرس الزامی است.'),
    }),
    products: yup.array().of(
      yup.object().shape({
        name: yup.string().required('نام الزامی است.'),
        weight: yup.string().required('وزن الزامی است.'),
      })
    ),
  })
  .required();

export default function ShippingForm() {
  const dispatch = useContext(AppDispatchContext);
  const { customer, shipping } = useContext(AppContext);
  const [editMode, setEditMode] = useState(true);
  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customer, ...shipping },
  });
  const { tipax } = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const onSubmit = ({ customer, ...data }) => {
    dispatch({ type: 'set_shipping', customer, data });
    setEditMode(false);
  };

  if (!editMode) return <Invoice onEdit={() => setEditMode(true)} />;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <ShippingIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          محاسبه گر هزینه باربری
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                fullWidth
                control={control}
                name="customer.firstName"
                id="firstName"
                label="نام"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                control={control}
                name="customer.lastName"
                id="lastName"
                label="نام خانوادگی"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                control={control}
                type="tel"
                id="mobile"
                name="customer.mobile"
                inputProps={{ maxLength: 11 }}
                label="شماره موبایل"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                control={control}
                name="customer.address"
                id="address"
                label="آدرس"
              />
            </Grid>
            {fields.map((field, index) => (
              <React.Fragment key={index}>
                <Grid item xs={6}>
                  <Input
                    fullWidth
                    key={field.id}
                    id={field.id}
                    control={control}
                    name={`products.${index}.name`}
                    label="نام محصول"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Input
                    fullWidth
                    key={field.id}
                    id={field.id}
                    control={control}
                    name={`products.${index}.weight`}
                    label="وزن محصول (گرم)"
                    type="tel"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          color="error"
                          disabled={index === 0}
                          onClick={() => remove(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      ),
                    }}
                  />
                  {index === 0 && (
                    <Button
                      fullWidth
                      startIcon={<AddIcon />}
                      variant="outlined"
                      sx={{ mt: 2 }}
                      onClick={() => append({ name: '', weight: '' })}
                    >
                      محصول جدید
                    </Button>
                  )}
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={6}>
              <Checkbox
                id="tipax"
                name="tipax"
                color="primary"
                control={control}
                defaultChecked={tipax}
                label="تیپاکس"
              />
            </Grid>
            {!tipax && (
              <Grid item xs={6}>
                <Input
                  fullWidth
                  control={control}
                  type="tel"
                  id="courier"
                  name="courier"
                  label="هزینه پیک (تومان)"
                />
              </Grid>
            )}
          </Grid>
          <Button
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            sx={{ my: 2 }}
          >
            محاسبه
          </Button>
          <Button
            fullWidth
            LinkComponent={Link}
            variant="outlined"
            size="large"
            to="/"
          >
            محاسبه گر قیمت نهایی کالا
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />
    </Container>
  );
}
