import React, {useEffect} from "react";
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
import useBondStats from "../../hooks/useBondStats";
import useCashPriceInLastTWAP from "../../hooks/useCashPriceInLastTWAP";
import useTotalValueLocked from "../../hooks/useTotalValueLocked";
import { useMemo } from "react";
import useBombStats from "../../hooks/useBombStats";
import usebShareStats from '../../hooks/usebShareStats';
import useFetchBoardroomAPR from "../../hooks/useFetchBoardroomAPR";
import useTotalStakedOnBoardroom from "../../hooks/useTotalStakedOnBoardroom";
import useEarningsOnBoardroom from "../../hooks/useEarningsOnBoardroom";
import useHarvestFromBoardroom from "../../hooks/useHarvestFromBoardroom";
import useRedeemOnBoardroom from "../../hooks/useRedeemOnBoardroom";
import useClaimRewardCheck from "../../hooks/boardroom/useClaimRewardCheck";
import useWithdrawCheck from "../../hooks/boardroom/useWithdrawCheck";
import useApprove , {ApprovalState} from "../../hooks/useApprove";
import useBombFinance from "../../hooks/useBombFinance";
import useBank from "../../hooks/useBank";
import { useParams } from "react-router-dom";
import useStatsForPool from "../../hooks/useStatsForPool";
import useWallet from "use-wallet";
import UnlockWallet from "../../components/UnlockWallet";

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
    const cashPrice = useCashPriceInLastTWAP();
    const boardroomAPR = useFetchBoardroomAPR();
    const totalStaked = useTotalStakedOnBoardroom();
    const earnings = useEarningsOnBoardroom();
    const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);
    const bombStats = useBombStats();
    const bShareStats = usebShareStats();
    const tBondStats = useBondStats();
    const bondStat = useBondStats();
    const TVL = useTotalValueLocked();
    const bombFinance = useBombFinance();
    const bombPriceInDollars = useMemo(
        () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
        [bombStats],
      );
    const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
    const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
    const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
    
    const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
    );
    const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
    );
    const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
    );
    const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

    const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
    );
    const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
    const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
    );
    const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
    
    //For button actions
    const {onReward} = useHarvestFromBoardroom();
    const { onRedeem } = useRedeemOnBoardroom();
    const canClaimReward = useClaimRewardCheck();
    const canWithdraw = useWithdrawCheck();
    const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);
    
    //For farm related calls
    // const {bankId} = useParams();
    // const bank = useBank(bankId);
    // const {account} = useWallet();
    // const statsOnPool = useStatsForPool();
    // let vaultUrl = "";
    // if (bank.depositTokenName.includes('BOMB-BTCB')) {
    //     vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bomb-btcb';
    // }
    
    // else if (bank.depositTokenName.includes('BOMB-BSHARE')) {
    //     vaultUrl = 'https://www.bomb.farm/#/bsc/';
    // }
    //     else if (bank.depositTokenName.includes('BSHARE-BNB')) {
    //     vaultUrl = 'https://www.bomb.farm/#/bsc/vault/bomb-bshare-wbnb';
    // }
    
    return(
        <>
        <Page>
            <BackgroundImage />
            <Helmet>
                <title>{TITLE}</title>
            </Helmet>
            <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
                DASHBOARD
            </Typography>
            <Grid container justify="center" spacing={10}>
                <Box sx={{ display: 'flex' }} mt = {5}>
                    
                    <Card className = {classes.gridItem} style={{ width: '500px', height: '240px'}}>
                        <CardContent style={{textAlign: 'left'}}>
                            <Typography color="textPrimary" align="center" variant="h6" gutterBottom>
                                Current Supply {"  "}|{"  "} Total Supply {"  "}|{"  "}  Price
                            </Typography>
                            <Typography align = 'left'>
                                $BOMB {bombCirculatingSupply/1000000}M {bombTotalSupply/1000000}M ${bombPriceInDollars}/{bombPriceInBNB} BNB
                            </Typography>
                            <Typography align = 'left'>
                                $BSHARE {bShareCirculatingSupply/1000000}M {bShareTotalSupply/1000000}M ${bSharePriceInDollars}/{bSharePriceInBNB} BNB
                            </Typography>
                            <Typography align = 'left'>
                                $BBond {tBondCirculatingSupply/1000000}M {tBondTotalSupply/1000000}M ${tBondPriceInDollars}/{tBondPriceInBNB} BNB
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className = {classes.gridItem} style={{ width: '500px', height: '240px'}}>
                        <CardContent style={{ textAlign: 'center' }}>
                            <Typography  color="textPrimary" align="center" variant="h6" gutterBottom>Bomb Finance Summary</Typography>
                            <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Next Epoch IN</Typography>
                            <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                            <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>Current Epoch</Typography>
                            <Typography>{Number(currentEpoch)}</Typography>
                            <Typography>Live TWAP:{Number(bondStat?.tokenInFtm).toFixed(4) || '-'}</Typography>
                            <Typography>TVL: ${TVL} </Typography>
                            <Typography>Last Epoch TWAP: {bondScale || '_'}</Typography>
                        </CardContent>
                    </Card>
                    
                </Box>
            </Grid>
            <Grid container justify="left" spacing={10}>
                <Box sx={{ display: 'flex' }} mt = {5}>
                    <Card className = {classes.gridItem} style={{ width: '600px', height: '250px'}}>
                        <CardContent style={{textAlign: 'left'}}>
                        <Typography  color="textPrimary" align="left" variant="h6" gutterBottom>Boardroom</Typography>
                        <Typography align = "left"><small>Stake BSHARE and earn BOMB every Epoch </small></Typography>
                        <Typography align = "right"><small>TVL: ${TVL}</small></Typography>
                        <Typography align ='left'><small>Daily Returns:</small>{boardroomAPR.toFixed(2)/365}%</Typography>
                        <Typography align = 'left'><small>Your Stake:</small>{getDisplayBalance(stakedBalance)}</Typography>
                        <Typography align = 'left'><small>Earned:</small>{getDisplayBalance(earnings)}</Typography>
                        <Typography align = 'right'><small>Total Staked:</small>{getDisplayBalance(totalStaked)}</Typography>
                        <Button
                            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                            className={approveStatus === ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
                            onClick={approve}
                        >Deposit</Button>
                        <Button disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                            onClick={onRedeem}
                            className={
                            stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)
                                ? 'shinyButtonDisabledSecondary'
                                : 'shinyButtonSecondary'
                            }
                        >Withdraw</Button>
                        <Button 
                            onClick={onReward}
                            className={
                                stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)
                                    ? 'shinyButtonDisabledSecondary'
                                    : 'shinyButtonSecondary'
                            }
                        >Claim Rewards</Button>
                        </CardContent>
                    </Card>
                    
                    <Card className = {classes.gridItem} style={{ width: '200px', height: '250px'}}>
                        <CardContent style = {{align: 'right'}}>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                Latest News
                            </Typography>
                            <Typography>Click down get all updates</Typography>
                            <Button
                                href="https://bombbshare.medium.com/the-bomb-cycle-how-to-print-forever-e89dc82c12e5"
                                target={'_blank'}
                                className="shinyButton"
                                style={{ margin: '10px' }}
                            > Click </Button>
                        </CardContent>
                    </Card>
                    
                </Box>
            </Grid>
            <Grid container justify = 'center' spacing = {10}>
                <Box sx={{ display: 'flex' }} mt = {5}>
                    <Card className = {classes.gridItem} style={{ width: '800px', height: '500px'}}>
                        <CardContent style = {{align: 'center'}}>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                Bomb Farms
                            </Typography>
                            <Typography>
                                <small>
                                    Stake your LP tokens in our farms to start earning $BSHARE
                                </small>
                            <Button> Claim All</Button>
                            </Typography>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                <small>Bomb-BTCB</small>
                            </Typography>
                            <Typography align = 'right'><small>TVL:</small></Typography>
                            <Typography align = 'left'>
                                Daily Returns: 
                            </Typography>
                            <Typography align = 'left'>
                                Your Stake: 
                            </Typography>
                            <Typography align = 'left'>
                                Earned: 
                            </Typography>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                <small>BSHARE-BNB</small>
                            </Typography>

                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Page>
        </>
    );
};

export default Dashboard;