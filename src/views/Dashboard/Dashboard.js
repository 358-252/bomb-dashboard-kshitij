import React from "react";
import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import { makeStyles } from '@material-ui/core/styles';
import Page from "../../components/Page";
import { Helmet } from 'react-helmet';
import ProgressCountdown from "../Boardroom/components/ProgressCountdown";
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import moment from 'moment';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const useStyles = makeStyles((theme) => ({
    gridItem: {
      height: '100%',
      [theme.breakpoints.up('md')]: {
        height: '90px',
      },
    },
  }));
const TITLE = 'Dashboard';
const Dashboard = () => {
    const stakedBalance = useStakedBalanceOnBoardroom();
    const classes = useStyles();
    const { to } = useTreasuryAllocationTimes();
    const currentEpoch = useCurrentEpoch();
    return(
        <Page>
            <BackgroundImage />
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                DASHBOARD
            </Typography>
            <Grid container justify="center" spacing={10}>
                <Box mt = {5} style={{ width: '600px' , height: '600px'}}>
                    <Card className = {classes.gridItem}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography>Bomb Finance Summary</Typography>
                            <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Next Epoch</Typography>
                            <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                            <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Current Epoch</Typography>
                            <Typography>{Number(currentEpoch)}</Typography>
                        </CardContent>
                    </Card>
                    
                </Box>
            </Grid>
        </Page>
        
    );
};

export default Dashboard;