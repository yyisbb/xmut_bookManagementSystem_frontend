import {Helmet} from 'react-helmet-async';
import {faker} from '@faker-js/faker';
// @mui
import {useTheme} from '@mui/material/styles';
import {Grid, Container, Typography} from '@mui/material';
// components
import {useEffect, useState} from "react";
import Iconify from '../components/iconify';
// sections
import {
    AppTasks,
    AppNewsUpdate,
    AppOrderTimeline,
    AppCurrentVisits,
    AppWebsiteVisits,
    AppTrafficBySite,
    AppWidgetSummary,
    AppCurrentSubject,
    AppConversionRates,
} from '../sections/@dashboard/app';
import message from "../utils/messageUtil";
import {getPlatformInfo} from "../api/modules/info";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
    const theme = useTheme();
    const [platformInfo, setPlatformInfo] = useState({});

    const getInfo = async () => {
        try {
            const {data} = await getPlatformInfo();
            setPlatformInfo(data)
        } catch (e) {
            message.error(e)
        }
    }

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <>
            <Helmet>
                <title> 主页 </title>
            </Helmet>

            <Container maxWidth={"xl"}>
                <Typography variant="h4" sx={{mb: 5}}>
                    图书管理系统
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="待归还图书总数" total={platformInfo.returnedBookNum || 0}
                                          icon={'ant-design:star-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="总图书数" total={platformInfo.bookTotal || 0} color="info"
                                          icon={'ant-design:ordered-list-outlined'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="学生总数" total={platformInfo.userTotal || 0} color="warning"
                                          icon={'ant-design:user-outlined'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="图书分类数" total={platformInfo.categoryTotal || 0} color="error"
                                          icon={'ant-design:gift-filled'}/>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>

                        <AppCurrentSubject
                            title="Current Subject"
                            chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
                            chartData={[
                                {name: 'Series 1', data: [80, 50, 30, 40, 100, 20]},
                                {name: 'Series 2', data: [20, 30, 40, 80, 20, 80]},
                                {name: 'Series 3', data: [44, 76, 78, 13, 43, 10]},
                            ]}
                            chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <AppCurrentVisits
                            title="Current Visits"
                            chartData={[
                                {label: 'America', value: 4344},
                                {label: 'Asia', value: 5435},
                                {label: 'Europe', value: 1443},
                                {label: 'Africa', value: 4443},
                            ]}
                            chartColors={[
                                theme.palette.primary.main,
                                theme.palette.info.main,
                                theme.palette.warning.main,
                                theme.palette.error.main,
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
