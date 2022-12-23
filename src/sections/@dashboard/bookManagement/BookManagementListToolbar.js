import PropTypes from 'prop-types';
// @mui
import {styled, alpha} from '@mui/material/styles';
import {Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment} from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import message from "../../../utils/messageUtil";
import {deleteBooks} from "../../../api/modules/book";

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

BookManagementListToolbar.propTypes = {
    allBook: PropTypes.func,
    selectBook: PropTypes.array,
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
};

export default function BookManagementListToolbar({allBook, selectBook, numSelected, filterName, onFilterName}) {

    const deleteSelectBook = async () => {
        if (selectBook.length===0){
            message.error('参数不允许为空')
            return
        }
        try {
            const {data} = await deleteBooks(selectBook)
            message.success(data)
            allBook()
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
                    placeholder="图书搜索"
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{color: 'text.disabled', width: 20, height: 20}}/>
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={deleteSelectBook}>
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
