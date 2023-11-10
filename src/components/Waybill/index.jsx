import React, { useContext } from 'react';
import moment from 'moment-jalaali';
import Barcode from 'react-barcode';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { persianNumber } from '../../utils';
import { AppContext } from '../../context';
import { getQRCode } from '../../utils';

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

export default function Waybill({ onEdit }) {
  const { customer, waybill } = useContext(AppContext);
  const qrValue = getQRCode(waybill.qrcode);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" onClick={onEdit}>
        <div>
          <img src="/logo-2x-000.png" width={128} />
          <Typography
            variant="body2"
            textAlign="center"
            fontFamily="IRANYekan"
            fontWeight={700}
          >
            ریالیر | خرید از ترکیه
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            fontWeight={700}
            letterSpacing={2}
          >
            www.rialir.com
          </Typography>
        </div>
        <img src={qrValue} width={120} height={120} />
      </Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 0, borderColor: '#000' }}
      >
        <Table size="small">
          <TableBody
            sx={{
              tr: {
                td: {
                  fontFamily: 'IRANYekan',
                  fontWeight: 700,
                  borderColor: '#000',
                },
              },
            }}
          >
            <TableRow>
              <TableCell>تاریخ:</TableCell>
              <TableCell>
                {moment().zone('+0330').format('dddd jD jMMMM jYYYY - HH:mm')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>گیرنده:</TableCell>
              <TableCell>
                {customer.firstName} {customer.lastName}
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell>آدرس:</TableCell>
              <TableCell>{persianNumber(customer.address)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <center>
        <Barcode value={waybill.barcode} height={32} />
      </center>
    </Box>
  );
}
