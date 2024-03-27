/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import db from "../../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useState } from 'react';

interface FireOrder {
  id: string;
  date: string;
  status: string;
  customer: {
    initial: string;
    name: string;
    email: string;
  };
}

async function fetchOrders(): Promise<FireOrder[]> {
  const ordersCollectionRef = collection(db, 'orders');
  const ordersSnapshot = await getDocs(ordersCollectionRef);
  
  // Map over the documents and transform them into objects of type FireOrder
  const rows: FireOrder[] = ordersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      date: data.date,
      status: data.status,
      customer: data.customer
    };
  });

  return rows;
}

const rows = await fetchOrders();
console.log(rows);

interface StatusDropdownProps {
  currentStatus: string;
  orderId: string;
  handleStatusChange: (orderId: string, newStatus: string) => void;
}

function StatusDropdown({ currentStatus, orderId, handleStatusChange }: StatusDropdownProps) {
  const handleChange = (newStatus) => {
    handleStatusChange(orderId, newStatus);
  };

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <ArrowDropDownIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 120 }}>
        <MenuItem onClick={() => handleChange('paid')} selected={currentStatus === 'paid'}>Paid</MenuItem>
        <MenuItem onClick={() => handleChange('pending')} selected={currentStatus === 'pending'}>Pending</MenuItem>
        <MenuItem onClick={() => handleChange('refunded')} selected={currentStatus === 'refunded'}>Refunded</MenuItem>
        <MenuItem onClick={() => handleChange('cancelled')} selected={currentStatus === 'cancelled'}>Cancelled</MenuItem>
      </Menu>
    </Dropdown>
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (orderBy === 'customer') {
    // For 'customer' property, extract the 'initial' property for comparison
    const initialA = (a[orderBy] as any).initial;
    const initialB = (b[orderBy] as any).initial;
    if (initialB < initialA) {
      return -1;
    }
    if (initialB > initialA) {
      return 1;
    }
    return 0;
  } else {
    // For other properties, use default comparison
    const valueA = typeof a[orderBy] === 'string' ? a[orderBy].toLowerCase() : a[orderBy];
    const valueB = typeof b[orderBy] === 'string' ? b[orderBy].toLowerCase() : b[orderBy];

    if (valueB < valueA) {
      return -1;
    }
    if (valueB > valueA) {
      return 1;
    }
    return 0;
  }
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
    
  );
}



export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof typeof rows[0]>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [modifiedStatuses, setModifiedStatuses] = useState<{ [id: string]: string }>({});

  const handleRequestSort = (property: keyof typeof rows[0]) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log(newStatus)
    setModifiedStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: newStatus,
    }));
  };

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filter by status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
          //onChange={(event) => handleStatusChange(row.id, event.target.value as string)}
        >
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
          <Option value="refunded">Refunded</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Category</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="refund">Refund</Option>
          <Option value="purchase">Purchase</Option>
          <Option value="debit">Debit</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Customer</FormLabel>
        <Select size="sm" placeholder="All">
          <Option value="all">All</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="marina">Marina Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hoper</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
        }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for order</FormLabel>
          <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
    
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  /*onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}*/
                  onClick={() => handleRequestSort('id')}
   
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Invoice
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>Date</th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleRequestSort('status')}
   

                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Status
                </Link>
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  /*onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}*/
                  onClick={() => handleRequestSort('customer')}

                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Customer
                </Link>
              </th>
              
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <tr key={row.id}>
                <td>
                <StatusDropdown 
                  currentStatus={modifiedStatuses[row.id] || row.status}
              orderId={row.id} 
              handleStatusChange={handleStatusChange} 
      />
            {/* <Select
              size="sm"
              value={modifiedStatuses[row.id] || row.status}
              //onChange={(event) => handleStatusChange(row.id, event.target.value as string)}
            >
              <Option value="paid">Paid</Option>
              <Option value="pending">Pending</Option>
              <Option value="refunded">Refunded</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select> */}
          </td>
                {/* <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td> */}
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.date}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Paid: <CheckRoundedIcon />,
                        Refunded: <AutorenewRoundedIcon />,
                        Cancelled: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Paid: 'success',
                        Refunded: 'neutral',
                        Cancelled: 'danger',
                      }[row.status] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">{row.customer.initial}</Avatar>
                    <div>
                      <Typography level="body-xs">{row.customer.name}</Typography>
                      <Typography level="body-xs">{row.customer.email}</Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button">
                      Download
                    </Link>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Previous
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
}


