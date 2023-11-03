import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoneyIcon from '@mui/icons-material/Money';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { AppContext, AppDispatchContext } from '../../context';
import AppContainer from '../../AppContainer';
import Input from '../../Input';
import Waybill from './';

const schema = yup
  .object({
    customer: yup.object().shape({
      firstName: yup.string().required('نام الزامی است.'),
      lastName: yup.string().required('نام خانوادگی الزامی است.'),
      mobile: yup.string().required('شماره موبایل الزامی است.'),
      address: yup.string().required('آدرس الزامی است.'),
    }),
    barcode: yup.string().required('بارکد الزامی است.'),
    subtotal: yup.string().required('قیمت محصولات الزامی است.'),
  })
  .required();

export default function WaybillForm() {
  const dispatch = useContext(AppDispatchContext);
  const { customer, waybill } = useContext(AppContext);
  const [editMode, setEditMode] = useState(true);
  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { customer, ...waybill },
  });
  const { subtotal, decimal } = watch();

  const onSubmit = ({ customer, ...data }) => {
    dispatch({ type: 'set_waybill', customer, data });
    setEditMode(false);
  };

  if (!editMode) return <Waybill onEdit={() => setEditMode(true)} />;

  return (
    <AppContainer>
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <ReceiptIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          صدور بارنامه
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
            <Grid item xs={12}>
              <Input
                fullWidth
                control={control}
                name="barcode"
                id="barcode"
                label="بارکد"
                inputProps={{ dir: 'ltr' }}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                control={control}
                type="tel"
                id="subtotal"
                name="subtotal"
                label="قیمت محصولات (₺)"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      edge="end"
                      title="پاک کردن"
                      onClick={() => setValue('subtotal', '')}
                    >
                      <CloseIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                type="tel"
                id="decimal"
                name="decimal"
                label="کروش (kr)"
                control={control}
                inputProps={{ maxLength: 5 }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      edge="end"
                      title="Set decimal"
                      disabled={!decimal}
                      onClick={() => {
                        setValue('subtotal', `${subtotal}.${decimal}`);
                        setValue('decimal', '');
                      }}
                    >
                      <MoneyIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            type="submit"
            size="large"
            variant="contained"
            sx={{ my: 2 }}
          >
            صدور
          </Button>
          <Button
            fullWidth
            LinkComponent={Link}
            variant="outlined"
            size="large"
            to="/shipping"
          >
            محاسبه گر هزینه باربری
          </Button>
        </Box>
      </Box>
    </AppContainer>
  );
}
