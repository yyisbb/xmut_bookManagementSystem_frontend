import PropTypes from 'prop-types';
// @mui
import {styled, alpha} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment} from '@mui/material';
// component
import {useState} from "react";
import Iconify from '../../../components/iconify';
import {deleteUser, getAllUser} from "../../../api/modules/user";
import message from "../../../utils/messageUtil";

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({theme}) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
    userList: PropTypes.func,
    selectStu: PropTypes.array,
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
};

export default function UserListToolbar({userList,selectStu, numSelected, filterName, onFilterName}) {

    const deleteSelectStu = async () => {
        if (!selectStu.length) {
            message.error('参数不允许为空')
            return
        }
        try {
            const {data} = await deleteUser(selectStu)
            message.success(data)
            userList()
        } catch (e) {
            message.error(e)
        }
    }
    return (
        <StyledRoot
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <StyledSearch
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="学号搜索"
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{color: 'text.disabled', width: 20, height: 20}}/>
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={deleteSelectStu}>
                        <Iconify icon="eva:trash-2-fill"/>
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list"/>
                    </IconButton>
                </Tooltip>
            )}
        </StyledRoot>
    );
}
