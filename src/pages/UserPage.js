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
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination, Dialog, DialogTitle, DialogContent, TextField, DialogActions, DialogContentText,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead, UserListToolbar} from '../sections/@dashboard/user';
import {addUser, disableUser, getAllUser, resetPassword} from "../api/modules/user";
import message from "../utils/messageUtil";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'avatr', label: '头像', alignRight: false},
    {id: 'createTime', label: '注册时间', alignRight: false},
    {id: 'username', label: '账号', alignRight: false},
    {id: 'nickname', label: '姓名', alignRight: false},
    {id: 'studentId', label: '学号', alignRight: false},
    {id: 'status', label: '状态', alignRight: false},
    {id: 'reset', label: '操作', alignRight: false},
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
        return filter(array, (_user) => _user.studentId.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [users, setUsers] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);

    const [username, setUserName] = useState('');
    const [nickname, setNickName] = useState('');
    const [studentId, setStudentId] = useState('');


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClickOpen = (event) => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    const userList = async () => {
        try {
            const {data} = await getAllUser();
            setUsers(data)
            setSelected([]);
        } catch (e) {
            message.error(e)
        }
    }

    const addStudent = async () => {
        if (!username || !nickname || !studentId) {
            message.error('参数不允许为空')
            return
        }
        const stuInfo = {
            username,
            nickname,
            studentId
        }
        try {
            const {data} = await addUser(stuInfo)
            setOpenDialog(false)
            message.customMsg({content: '新增学生成功,初始密码是: '.concat(data), data, duration: 10000});
            userList()
        } catch (e) {
            message.error(e)
        }
    }

    const resetPwd = (id) => {
        return async () => {
            if (!id) {
                message.error('参数不允许为空')
                return
            }
            try {
                const {data} = await resetPassword(id)
                message.customMsg({content: '重置密码成功,初始密码是: '.concat(data), data, duration: 10000});
                userList()
            } catch (e) {
                message.error(e)
            }
        }
    }
    const disableStu = (id) => {
        return async () => {
            if (!id) {
                message.error('参数不允许为空')
                return
            }
            try {
                await disableUser(id)
                message.success('修改成功')
                userList()
            } catch (e) {
                message.error(e)
            }
        }
    }

    // 获取用户信息
    useEffect(() => {
        userList()
    }, [])
    return (
        <>
            <Helmet>
                <title> 学生管理 </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        学生管理
                    </Typography>
                    <Button variant="contained" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill"/>}>
                        添加学生账号
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar userList={userList} selectStu={selected} numSelected={selected.length}
                                     filterName={filterName}
                                     onFilterName={handleFilterByName}/>
                    <Dialog open={openDialog} onClose={handleClose}>
                        <DialogTitle>添加学生信息</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                添加成功后显示初始学生密码
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="username"
                                onChange={(event) => {
                                    setUserName(event.target.value)
                                }}
                                label="学生账号"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="nickname"
                                label="学生姓名"
                                onChange={(event) => {
                                    setNickName(event.target.value)
                                }}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="studentId"
                                label="学生学号"
                                onChange={(event) => {
                                    setStudentId(event.target.value)
                                }}
                                fullWidth
                                variant="standard"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={addStudent}>添加</Button>
                        </DialogActions>
                    </Dialog>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={users.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, createdTime, username, nickname, status, studentId, avatar} = row;
                                        const selectedUser = selected.indexOf(id) !== -1;
                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox"
                                                      selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser}
                                                              onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={'avatar'} src={avatar}/>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{createdTime}</TableCell>
                                                <TableCell align="left">{username}</TableCell>

                                                <TableCell align="left">{nickname}</TableCell>

                                                <TableCell align="left">{studentId}</TableCell>

                                                <TableCell align="left">
                                                    <Label
                                                        color={(status === 0 && 'error') || 'success'}>{
                                                        status === 1 ? '启用' : '禁用'
                                                    }</Label>
                                                </TableCell>

                                                <TableCell align="left">
                                                    <Button sx={{m: 1}} onClick={resetPwd(id)}
                                                            variant="contained">重置密码</Button>
                                                    <Button sx={{m: 1}} onClick={disableStu(id)} variant="contained"
                                                            color={
                                                                status === 1 ? 'error' : 'primary'
                                                            }>
                                                        {

                                                            status === 1 ? '禁用账户' : '启用账户'
                                                        }
                                                    </Button>
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
                                                        暂无当前学号的学生 &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>
                                                        <br/> 请尝试其他学号
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
                        count={users.length}
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
