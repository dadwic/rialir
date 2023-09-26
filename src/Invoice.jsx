import React, { useContext } from 'react';
import moment from 'moment-jalaali';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AppDispatchContext } from './context';
import { numFormat, persianNumber } from './utils';
import Logo from './Logo';
import URL from './URL';

moment.loadPersian({ usePersianDigits: true });

export default function Invoice({ store }) {
  const dispatch = useContext(AppDispatchContext);
  const subtotal =
    store.products.reduce((acc, object) => {
      return acc + parseInt(object.weight);
    }, 0) * 250;
  const invoiceTotal = subtotal + parseInt(store.cargo);

  const handleClick = () => {
    dispatch({ type: 'edit_mode' });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={2}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          onClick={handleClick}
        >
          <img src="/logo-2x.png" width={216} />
          <URL />
        </Box>
        <Typography
          variant="h6"
          textAlign="center"
          fontWeight={700}
          sx={{ mt: 2 }}
          gutterBottom
        >
          صورتحساب هزینه باربری
        </Typography>
        <Typography
          variant="subtitle2"
          textAlign="center"
          color="text.secondary"
        >
          {moment().format('dddd jD jMMMM jYYYY - H:mm')}
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table size="small">
            {store.tipax ? (
              <caption>هزینه تیپاکس پس‌کرایه بر عهده مشتری می باشد.</caption>
            ) : (
              <caption>
                مجموع صورتحساب شامل {numFormat(store.cargo)} تومان هزینه پیک می
                باشد.
              </caption>
            )}
            <TableHead>
              <TableRow>
                <TableCell width={40}>ردیف</TableCell>
                <TableCell>نام محصول</TableCell>
                <TableCell align="right">وزن محصول</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.products.map((product, index) => (
                <TableRow key={product.name}>
                  <TableCell>{persianNumber(index + 1)}</TableCell>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="right">
                    {numFormat(product.weight)} گرم
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography component="span" fontWeight={700}>
                    مجموع:&nbsp;
                  </Typography>
                  <Typography component="span">
                    {numFormat(invoiceTotal)} تومان
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container>
          <Grid item xs sx={{ pb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              مشخصات خریدار
            </Typography>
            <Typography gutterBottom>
              {store.firstName} {store.lastName}
            </Typography>
            <Typography gutterBottom>{persianNumber(store.mobile)}</Typography>
            <Typography>{store.address}</Typography>
          </Grid>
          <Divider flexItem orientation="vertical">
            <Logo />
          </Divider>
          <Grid item xs sx={{ pb: 2, pl: 2.5 }}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              روش پرداخت
            </Typography>
            <Typography gutterBottom>شماره کارت بانک سامان</Typography>
            <Typography fontWeight={700} gutterBottom>
              6219&nbsp;8619&nbsp;0609&nbsp;8149
            </Typography>
            <Typography>بنام مهرداد مهرعلیان</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2 }} />
        <Typography fontWeight={700} gutterBottom>
          توضیحات:
        </Typography>
        <ul>
          <Typography component="li" fontWeight={700} gutterBottom>
            حتما در توضیحات تراکنش ذکر شود: بابت پرداخت قرض و تادیه دیون
          </Typography>
          <Typography component="li" fontWeight={700}>
            مشتری گرامی بعد از پرداخت، تصویر فیش واریزی را برای پشتیبانی ریالیر
            ارسال کنید.
          </Typography>
        </ul>
      </Box>
    </Container>
  );
}
