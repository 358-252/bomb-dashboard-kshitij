import React,{useCallback}  from "react";
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
import useRedeem from "../../hooks/useRedeem";
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
import ExchangeCard from "../Bond/components/ExchangeCard";
import { useTransactionAdder } from "../../state/transactions/hooks";
import useTokenBalance from "../../hooks/useTokenBalance";
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import useBondsPurchasable from "../../hooks/useBondsPurchasable";
import useBank from "../../hooks/useBank";
import useStatsForPool from "../../hooks/useStatsForPool";
import useEarnings from "../../hooks/useEarnings";
import useHarvest from "../../hooks/useHarvest";
import useStakedBalance from "../../hooks/useStakedBalance";
import useWallet from "use-wallet";
import UnlockWallet from "../../components/UnlockWallet";
import { AddIcon, RemoveIcon } from "../../components/icons";
import IconButton from "../../components/IconButton";
import useModal from "../../hooks/useModal";
import DepositModal from "../Bank/components/DepositModal";
import ZapModal from "../Bank/components/ZapModal";
import WithdrawModal from "../Bank/components/WithdrawModal";
import useStake from "../../hooks/useStake";
import useZap from "../../hooks/useZap";
import useWithdraw from "../../hooks/useWithdraw";

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
    const totalStaked = useTotalStakedOnBoardroom();
    const earnings = useEarningsOnBoardroom();
    const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);
    const bombStats = useBombStats();
    const bShareStats = usebShareStats();
    const tBondStats = useBondStats();
    const TVL = useTotalValueLocked();
    const bombFinance = useBombFinance(); 

    //for data regarding three currencies in summary section
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
    
    //For  Boardroom
    const boardroomAPR = useFetchBoardroomAPR(); //to get Daily Return 
    // For Buttons in Boardroom
    const {onReward} = useHarvestFromBoardroom();
    const { onRedeem } = useRedeemOnBoardroom();
    const canClaimReward = useClaimRewardCheck();
    const canWithdraw = useWithdrawCheck();
    const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);
    
    //For Farm related calls
    const bank1 = useBank("BombBtcbLPBShareRewardPool");
    const bank2 = useBank("BshareBnbLPBShareRewardPool");
    const earnings1 = useEarnings(bank1.contract, bank1.earnTokenName, bank1.poolId);
    const earnings2 = useEarnings(bank2.contract, bank2.earnTokenName, bank2.poolId);
    const stakedBalance1 = useStakedBalance(bank1.contract, bank1.poolId);
    const stakedBalance2 = useStakedBalance(bank2.contract, bank2.poolId);
    const [approveStatus1, approve1] = useApprove(bank1.depositToken, bank1.address);
    const [approveStatus2, approve2] = useApprove(bank2.depositToken, bank2.address);
    const {onStake1} = useStake(bank1);
    const {onZap1} = useZap(bank1);
    const {onWithdraw1} = useWithdraw(bank1);
    const {onStake2} = useStake(bank2);
    const {onZap2} = useZap(bank2);
    const {onWithdraw2} = useWithdraw(bank2);
    const tokenBalance1 = useTokenBalance(bank1.depositToken);
    const tokenBalance2 = useTokenBalance(bank2.depositToken);
    const [onPresentDeposit1, onDismissDeposit1] = useModal(
        <DepositModal
          max={tokenBalance1}
          decimals={bank1.depositToken.decimal}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onStake1(amount);
            onDismissDeposit1();
          }}
          tokenName={bank1.depositTokenName}
        />,
      );
    
      const [onPresentZap1, onDissmissZap1] = useModal(
        <ZapModal
          decimals={bank1.depositToken.decimal}
          onConfirm={(zappingToken, tokenName, amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onZap1(zappingToken, tokenName, amount);
            onDissmissZap1();
          }}
          tokenName={bank1.depositTokenName}
        />,
      );
    
      const [onPresentWithdraw1, onDismissWithdraw1] = useModal(
        <WithdrawModal
          max={stakedBalance1}
          decimals={bank1.depositToken.decimal}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onWithdraw1(amount);
            onDismissWithdraw1();
          }}
          tokenName={bank2.depositTokenName}
        />,
      );
      const [onPresentDeposit2, onDismissDeposit2] = useModal(
        <DepositModal
          max={tokenBalance2}
          decimals={bank2.depositToken.decimal}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onStake2(amount);
            onDismissDeposit2();
          }}
          tokenName={bank2.depositTokenName}
        />,
      );
    
      const [onPresentZap2, onDissmissZap2] = useModal(
        <ZapModal
          decimals={bank2.depositToken.decimal}
          onConfirm={(zappingToken, tokenName, amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onZap2(zappingToken, tokenName, amount);
            onDissmissZap2();
          }}
          tokenName={bank2.depositTokenName}
        />,
      );
    
      const [onPresentWithdraw2, onDismissWithdraw2] = useModal(
        <WithdrawModal
          max={stakedBalance2}
          decimals={bank2.depositToken.decimal}
          onConfirm={(amount) => {
            if (Number(amount) <= 0 || isNaN(Number(amount))) return;
            onWithdraw2(amount);
            onDismissWithdraw2();
          }}
          tokenName={bank2.depositTokenName}
        />,
      );
    //console.log(bank);
    let statsOnPool1 = useStatsForPool(bank1);
    let statsOnPool2 = useStatsForPool(bank2);
    //Farm button calls
    const { onRedeem1 } = useRedeem(bank1);
    const { onRedeem2 } = useRedeem(bank2);
    //
    const redeemAl = () =>{
        onRedeem1();
        onRedeem2();
    };
    const {onReward1} = useHarvest(bank1);
    const {onReward2} = useHarvest(bank2);

    //For bond related calls
    const addTransaction = useTransactionAdder();
    const bondBalance = useTokenBalance(bombFinance?.BBOND);
    const bondStat = useBondStats();
    const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
    const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
    const bondsPurchasable = useBondsPurchasable();
    const handleRedeemBonds = useCallback(
        async (amount) => {
          const tx = await bombFinance.redeemBonds(amount);
          addTransaction(tx, {summary: `Redeem ${amount} BBOND`});
        },
        [bombFinance, addTransaction],
    );
    const handleBuyBonds = useCallback(
        async (amount) => {
            const tx = await bombFinance.buyBonds(amount);
            addTransaction(tx, {
            summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
            });
    },
        [bombFinance, addTransaction],
      );

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
                <Box sx={{ display: 'flex', margin: '20px' }} mt = {5}>
                    
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
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', margin: '20px' }} mt = {5}>
                    <Card className = {classes.gridItem} style={{ flex: '2', height: '250px', marginRight: '20px'}}>
                    {/* , width: '600px' */}
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
                    
                    <Card className = {classes.gridItem} style={{ flex: '1', height: '250px'}}>
                    {/* width: '200px' */}
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
                <Box sx={{ display: 'flex',  margin: '20px' }} mt = {5}>
                    <Card className = {classes.gridItem} style={{ width: '800px', height: '500px'}}>
                        <CardContent style = {{align: 'center'}}>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                Bomb Farms
                            </Typography>
                            <Typography>
                                <small>
                                    Stake your LP tokens in our farms to start earning $BSHARE
                                </small>
                            </Typography>
                            <Button onClick={redeemAl} className="shinyButtonSecondary"> Claim All</Button>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                <small>Bomb-BTCB</small>
                            </Typography>
                            <Typography align = 'right'><small>TVL: ${statsOnPool1?.TVL}</small></Typography>
                            <Typography align = 'left'>
                                Daily Returns: {bank1.closedForStaking ? '0.00' : statsOnPool1?.dailyAPR} %
                            </Typography>
                            <Typography align = 'left'>
                                Your Stake: {getDisplayBalance(stakedBalance1, bank1.depositToken.decimal)}
                            </Typography>
                            <Typography align = 'left'>
                                Earned: {getDisplayBalance(earnings1)}
                            </Typography>
                            {approveStatus1 !== ApprovalState.APPROVED ? (
                                <Button
                                    disabled={
                                    bank1.closedForStaking ||
                                    approveStatus1 === ApprovalState.PENDING ||
                                    approveStatus1 === ApprovalState.UNKNOWN
                                    }
                                    onClick={approve1}
                                    className={
                                    bank1.closedForStaking ||
                                    approveStatus1 === ApprovalState.PENDING ||
                                    approveStatus1 === ApprovalState.UNKNOWN
                                        ? 'shinyButtonDisabled'
                                        : 'shinyButton'
                                    }
                                >
                                    Deposit
                                </Button>
                            ) : (
                                <>
                                    <IconButton onClick={onPresentWithdraw1}>
                                    <RemoveIcon />
                                    </IconButton>
                                    <IconButton
                                    disabled={
                                        bank1.closedForStaking ||
                                        bank1.depositTokenName === 'BOMB-BSHARE-LP' ||
                                        bank1.depositTokenName === 'BOMB' ||
                                        bank1.depositTokenName === 'BOMB-BTCB-LP' ||
                                        bank1.depositTokenName === '80BOMB-20BTCB-LP' ||
                                        bank1.depositTokenName === '80BSHARE-20WBNB-LP' ||
                                        bank1.depositTokenName === 'BUSM-BUSD-LP' ||
                                        bank1.depositTokenName === 'BBOND'

                                    }
                                    onClick={() => (bank1.closedForStaking ? null : onPresentZap1())}
                                    >
                                    </IconButton>
                                    <IconButton
                                    disabled={bank1.closedForStaking}
                                    onClick={() => (bank1.closedForStaking ? null : onPresentDeposit1())}
                                    >
                                    <AddIcon />
                                    </IconButton>
                                </>
                            )}
                            <Button onClick={onRedeem1} className="shinyButtonSecondary">Withdraw</Button>
                            <Button 
                                onClick={onReward1}
                                disabled={earnings1.eq(0)}
                                className={earnings1.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
                            >Claim Rewards</Button>

                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                <small>BSHARE-BNB</small>
                            </Typography>
                            <Typography align = 'right'><small>TVL: ${statsOnPool2?.TVL}</small></Typography>
                            <Typography align = 'left'>
                                Daily Returns:  {bank2.closedForStaking ? '0.00' : statsOnPool2?.dailyAPR} %
                            </Typography>
                            <Typography align = 'left'>
                                Your Stake: {getDisplayBalance(stakedBalance2, bank2.depositToken.decimal)}
                            </Typography>
                            <Typography align = 'left'>
                                Earned: {getDisplayBalance(earnings2)}
                            </Typography>
                            {approveStatus2 !== ApprovalState.APPROVED ? (
                                <Button
                                    disabled={
                                    bank2.closedForStaking ||
                                    approveStatus2 === ApprovalState.PENDING ||
                                    approveStatus2 === ApprovalState.UNKNOWN
                                    }
                                    onClick={approve2}
                                    className={
                                    bank2.closedForStaking ||
                                    approveStatus2 === ApprovalState.PENDING ||
                                    approveStatus2 === ApprovalState.UNKNOWN
                                        ? 'shinyButtonDisabled'
                                        : 'shinyButton'
                                    }
                                >
                                    Deposit
                                </Button>
                            ) : (
                                <>
                                    <IconButton onClick={onPresentWithdraw2}>
                                    <RemoveIcon />
                                    </IconButton>
                                    <IconButton
                                    disabled={
                                        bank2.closedForStaking ||
                                        bank2.depositTokenName === 'BOMB-BSHARE-LP' ||
                                        bank2.depositTokenName === 'BOMB' ||
                                        bank2.depositTokenName === 'BOMB-BTCB-LP' ||
                                        bank2.depositTokenName === '80BOMB-20BTCB-LP' ||
                                        bank2.depositTokenName === '80BSHARE-20WBNB-LP' ||
                                        bank2.depositTokenName === 'BUSM-BUSD-LP' ||
                                        bank2.depositTokenName === 'BBOND'

                                    }
                                    onClick={() => (bank2.closedForStaking ? null : onPresentZap2())}
                                    >
                                    </IconButton>
                                    <IconButton
                                    disabled={bank2.closedForStaking}
                                    onClick={() => (bank2.closedForStaking ? null : onPresentDeposit2())}
                                    >
                                    <AddIcon />
                                    </IconButton>
                                </>
                                )}
                            <Button onClick={onRedeem2} className="shinyButtonSecondary">Withdraw</Button>
                            <Button
                                onClick={onReward2}
                                disabled={earnings2.eq(0)}
                                className={earnings2.eq(0) ? 'shinyButtonDisabled' : 'shinyButton'}
                            >Claim Rewards</Button>

                        </CardContent>
                    </Card>
                </Box>
            </Grid>
                
            <Grid container justifyContent="center" spacing = {10}>
                <Box sx={{ display: 'flex' ,  margin: '20px'}} mt = {5}>
                    <Card className = {classes.gridItem} style={{ width: '800px', height: '750px'}}>
                        <CardContent>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                Bonds
                            </Typography>
                            <Typography color="textPrimary" align="left" variant="h6" gutterBottom>
                                <small>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1</small>
                            </Typography>
                            <Typography align = 'left'>Current Price: (BOMB)^2</Typography>
                            <Typography align = 'left'>BBOND = {Number(bondStat?.tokenInFtm).toFixed(4) || '-'} BTCB</Typography>
                            <ExchangeCard
                                action="Redeem"
                                fromToken={bombFinance.BBOND}
                                fromTokenName="BBOND"
                                toToken={bombFinance.BOMB}
                                toTokenName="BOMB"
                                priceDesc={`${getDisplayBalance(bondBalance)} BBOND Available in wallet`}
                                onExchange={handleRedeemBonds}
                                disabled={!bondStat || bondBalance.eq(0) || !isBondRedeemable}
                                disabledDescription={!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null}
                            />
                            <ExchangeCard
                                action="Purchase"
                                fromToken={bombFinance.BOMB}
                                fromTokenName="BOMB"
                                toToken={bombFinance.BBOND}
                                toTokenName="BBOND"
                                priceDesc={
                                    !isBondPurchasable
                                    ? 'BOMB is over peg'
                                    : getDisplayBalance(bondsPurchasable, 18, 4) + ' BBOND available for purchase'
                                }
                                onExchange={handleBuyBonds}
                                disabled={!bondStat || isBondRedeemable}
                            />
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Page>
    );
};

export default Dashboard;