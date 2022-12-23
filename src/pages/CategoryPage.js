import {Helmet} from 'react-helmet-async';
import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import {useEffect, useState} from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Dialog
} from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
// sections
import {CategoryListHead, CategoryToolbar} from '../sections/@dashboard/category';
import message from "../utils/messageUtil";
import {addCategory, editCategory, getAllCategory} from "../api/modules/category";
import Iconify from "../components/iconify";
import {addUser} from "../api/modules/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'nickname', label: '分类名', alignRight: false},
    {id: 'createTime', label: '创建时间', alignRight: false},
    {id: 'operation', label: '操作', alignRight: false},
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_category) => _category.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function CategoryPage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [categories, setCategory] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

    const [categoryName, setCategoryName] = useState('');

    const [categoryId, setCategoryId] = useState(0);

    const categoryList = async () => {
        try {
            const {data} = await getAllCategory();
            setCategory(data)
            setSelected([]);
        } catch (e) {
            message.error(e)
        }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = categories.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };


    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleClickOpen = (event) => {
        setOpenDialog(true);
    };

    const handleClickOpenUpdate = (id) => {
        return ()=>{
            setOpenUpdateDialog(true);
            setCategoryId(id)
        }
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleUpdateClose = () => {
        setOpenUpdateDialog(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const add = async () => {
        if (!categoryName){
            message.error('参数不允许为空')
            return
        }
        const categoryInfo = {
            name:categoryName,
        }
        try {
            const {data} = await addCategory(categoryInfo)
            setOpenDialog(false)
            message.success(data)
            categoryList()
        } catch (e) {
            message.error(e)
        }
    }

    const edit = async () => {
        if (!categoryName || !categoryId) {
            message.error('参数不允许为空')
            return
        }
        const categoryInfo = {
            id:categoryId,
            name:categoryName,
        }
        try {
            const {data} = await editCategory(categoryInfo)
            setOpenUpdateDialog(false)
            message.success(data)
            categoryList()
        } catch (e) {
            message.error(e)
        }
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

    const filteredCatrgory = applySortFilter(categories, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredCatrgory.length && !!filterName;

    useEffect(()=>{
        categoryList()
    },[])

    return (
        <>
            <Helmet>
                <title> 分类管理 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        分类管理
                    </Typography>
                     <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill"/>}>
                        添加分类
                     </Button>
                </Stack>

                <Dialog open={openDialog} onClose={handleClose}>
                    <DialogTitle>添加分类信息</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            onChange={(event) => {
                                setCategoryName(event.target.value)
                            }}
                            label="分类名"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={add}>添加</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openUpdateDialog} onClose={handleUpdateClose}>
                    <DialogTitle>修改分类信息</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            onChange={(event) => {
                                setCategoryName(event.target.value)
                            }}
                            label="分类名"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={edit}>修改</Button>
                    </DialogActions>
                </Dialog>
                <Card>
                     <CategoryToolbar categoryList={categoryList} selectCategory={selected} numSelected={selected.length}
                                      filterName={filterName}
                                      onFilterName={handleFilterByName}/>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <CategoryListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={categories.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredCatrgory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, createdTime, name} = row;
                                        const selectedCategory = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedCategory}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedCategory}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell align="left">{id}</TableCell>
                                                <TableCell align="left">{name}</TableCell>
                                                <TableCell align="left">{createdTime}</TableCell>
                                                <TableCell align="left">
                                                    <Button sx={{m: 1}} onClick={handleClickOpenUpdate(id)}
                                                            variant="contained">修改分类名</Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>


                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        无结果
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        暂无当前分类 &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>
                                                        <br/> 请尝试其他分类名
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={categories.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

        </>
    );
}
