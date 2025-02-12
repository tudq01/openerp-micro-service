import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Button, Chip, Icon } from '@mui/material';
import { colorStatus, menuIconMap } from 'config/menuconfig';
import { useHistory } from 'react-router-dom';
import { updateTrip } from 'api/TripAPI';

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

const headCells = [
    {
        id: 'code',
        numeric: false,
        disablePadding: false,
        label: 'Trip Code',
        width: '15%'
    },
    {
        id: 'totalOrder',
        numeric: false,
        disablePadding: false,
        label: 'Total order',
        width: '15%'
    },
    {
        id: 'totalDistant',
        numeric: false,
        disablePadding: false,
        label: 'Total Distant',
        width: '15%'
    },
    {
        id: 'totalTime',
        numeric: false,
        disablePadding: false,
        label: 'Total Time',
        width: '15%'
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        width: '15%'
    },
    {
        id: 'executedTime',
        numeric: false,
        disablePadding: false,
        label: 'Executed Time',
        width: '15%'
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: '',
        width: '10%'
    },
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'calories';

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        // sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell?.width}
                    >
                        {headCell.label}
                        {/* <TableSortLabel
              active={orderBy === headCell.id}
            //   direction={orderBy === headCell.id ? order : 'asc'}
            //   onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
               {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null} 
            </TableSortLabel> */}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function TableTrip({ trips, setExecutes, executed, type }) {
    const [order, setOrder] = React.useState(DEFAULT_ORDER);
    const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
    const [selected, setSelected] = React.useState([]);
    const [dense, setDense] = React.useState(false);
    const [visibleRows, setVisibleRows] = React.useState(null);
    const history = useHistory();

    //   const handleRequestSort = React.useCallback(
    //     (event, newOrderBy) => {
    //       const isAsc = orderBy === newOrderBy && order === 'asc';
    //       const toggledOrder = isAsc ? 'desc' : 'asc';
    //       setOrder(toggledOrder);
    //       setOrderBy(newOrderBy);

    //       const sortedRows = stableSort(trucks, getComparator(toggledOrder, newOrderBy));
    //       const updatedRows = sortedRows.slice(
    //         page * rowsPerPage,
    //         page * rowsPerPage + rowsPerPage,
    //       );

    //       setVisibleRows(updatedRows);
    //     },
    //     [order, orderBy, page, rowsPerPage],
    //   );

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = trips.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    //   const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    //   };

    //   const handleChangeRowsPerPage = (event) => {
    //     const updatedRowsPerPage = parseInt(event.target.value, 10);
    //     setRowsPerPage(updatedRowsPerPage);

    //     setPage(0);
    //   };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const handleDetail = (id) => {
        history.push({
            pathname: `/trip/detail/${type}/${id}`,
        })
    }
    const handleExecuted = (id) => {
        let data = {
            status: "EXECUTING"
        }
        updateTrip(id, data).then((res) => {
            setExecutes(!executed);
        })
    }
    const convertMillisecondsToHours = (milliseconds) => {
        const seconds = milliseconds / 1000;
        const hours = Math.floor((seconds / 3600) % 24);
        const minutes = Math.floor((seconds % 3600) / 60);
        const date = Math.floor(hours / 24);
        if(date > 0) {
            return `${date} ngày ${hours} giờ ${minutes} phút`;
        }
        return `${hours} giờ ${minutes} phút`;
      }
    return (
        <Box sx={{ width: '100%', display: "flex", justifyContent: "center", backgroundColor: "white" }}>
            <Paper sx={{ width: '95%', mb: 2, boxShadow: "none" }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            //   onRequestSort={handleRequestSort}
                            rowCount={trips.length}
                        />
                        <TableBody>
                            {trips
                                ? trips.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            // onClick={(event) => handleClick(event, row.name)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox"
                                                sx={{ width: '10%' }}>
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                    onClick={(event) => handleClick(event, row.id)}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                align="left"
                                            >
                                                {row.code}
                                            </TableCell>
                                            <TableCell align="left">{row?.orderIds.length}</TableCell>
                                            <TableCell align="left">{Number(row?.total_distant / 1000).toFixed(2)} (km)</TableCell>
                                            <TableCell align="left">{convertMillisecondsToHours(row?.total_time)}</TableCell>
                                            <TableCell align="left">
                                                <Chip label={row?.status} color={colorStatus.get(row?.status)} />
                                            </TableCell>
                                            <TableCell align="left">{new Date(row?.startTime).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex' }}>
                                                    {type === "Done" ? null : (
                                                        <Button
                                                            disabled={row.status !== "SCHEDULED" ? true : false}
                                                            variant="contained"
                                                            onClick={() => { handleExecuted(row.uid) }}
                                                        >
                                                            Executing
                                                        </Button>
                                                    )}
                                                    <Box sx={{ marginLeft: '16px' }}
                                                        onClick={() => { handleDetail(row?.uid) }} >
                                                        <Icon className='icon-view-screen'>{menuIconMap.get("RemoveRedEyeIcon")}</Icon>
                                                    </Box>
                                                </Box>

                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                                : null}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
