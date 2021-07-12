import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoadingTrue, setUserLoadingFalse, setUserInfo } from './redux/actions/user';
// component
import FullPageLoading from './component/loading/FullPageLoading';
import HomeMain from './component/home/HomeMain';
import OrderConfirmMain from './component/order_confirm/OrderConfirmMain';
import WaybillMain from './component/waybill/WaybillMain';
import LoginMain from './component/login/LoginMain';
import SalesRateNaverMain from './component/sales_rate/naver/SalesRateNaverMain';
import ProductManageMain from './component/product_manage/ProductManageMain';

// component : shipment
import SPackingListNaverMain from './component/shipment/packing-list/naver/SPackingListNaverMain';
import SPackingListCoupangMain from './component/shipment/packing-list/coupang/SPackingListCoupangMain';

// component : account book
import AccountBookMain from './component/account_book/AccountBookMain';
import IncomeMain from './component/account_book/IncomeMain';
import ExpenditureMain from './component/account_book/ExpenditureMain';

// data connect
import { userDataConnect } from './data_connect/userDataConnect';


const theme = unstable_createMuiStrictModeTheme();

const AppContainer = styled.div`
    animation: fadein 1.5s;
    -moz-animation: fadein 1.5s; /* Firefox */
    -webkit-animation: fadein 1.5s; /* Safari and Chrome */
    -o-animation: fadein 1.5s; /* Opera */
    
`;

function App(props) {
    const userRdx = useSelector(state => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        async function userCheckInit() {
            await userDataConnect().loginCheck()
                .then(res => {
                    if (res.status == 200 && res.data.message == 'loged') {
                        dispatch(setUserInfo(res.data.data))
                    }
                })
                .catch(err => {
                    console.log(err.response);
                })
            dispatch(setUserLoadingFalse());

        }
        userCheckInit();
    }, [props.location])
    return (
        <>
            <ThemeProvider theme={theme}>
                <Suspense fallback={<FullPageLoading></FullPageLoading>}>
                    <AppContainer>
                        {userRdx.isLoading == false ? (

                            <Switch>
                                {/* {console.log(userRdx.userInfo.roles.includes("ROLE_MANAGER"))} */}
                                {/* Home */}
                                <Route exact path='/'>
                                    {userRdx.userInfo ? <HomeMain></HomeMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                {/* OrderManage */}
                                <Route exact path='/order-confirm'>
                                    {userRdx.userInfo ? <OrderConfirmMain></OrderConfirmMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                <Route exact path='/waybill' component={WaybillMain}>
                                    {userRdx.userInfo ? <WaybillMain></WaybillMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                {/* Login Signup etc.. */}
                                <Route exact path='/login'>
                                    {userRdx.userInfo ? <Redirect to={'/'}></Redirect> : <LoginMain></LoginMain>}
                                </Route>
                                {/* Account book */}
                                <Route exact path='/account-book'>
                                    {
                                        userRdx.userInfo && (userRdx.userInfo.roles.includes("ROLE_ADMIN") || userRdx.userInfo.roles.includes("ROLE_MANAGER"))
                                            ?
                                            <AccountBookMain></AccountBookMain>
                                            :
                                            <Redirect to={'/login'}></Redirect>
                                    }
                                </Route>
                                <Route exact path='/account-book/income'>
                                    {userRdx.userInfo && (userRdx.userInfo.roles.includes("ROLE_ADMIN") || userRdx.userInfo.roles.includes("ROLE_MANAGER")) ? <IncomeMain></IncomeMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                <Route exact path='/account-book/expenditure'>
                                    {userRdx.userInfo && (userRdx.userInfo.roles.includes("ROLE_ADMIN") || userRdx.userInfo.roles.includes("ROLE_MANAGER")) ? <ExpenditureMain></ExpenditureMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                {/* Sales Rate */}
                                <Route exact path='/sales-rate/naver'>
                                    {userRdx.userInfo ? <SalesRateNaverMain></SalesRateNaverMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                {/* Product Manage */}
                                <Route exact path='/products'>
                                    {userRdx.userInfo ? <ProductManageMain></ProductManageMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                {/* Shipment */}
                                <Route exact path='/shipment/packing-list/naver'>
                                    {userRdx.userInfo ? <SPackingListNaverMain></SPackingListNaverMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                                <Route exact path='/shipment/packing-list/coupang'>
                                    {userRdx.userInfo ? <SPackingListCoupangMain></SPackingListCoupangMain> : <Redirect to={'/login'}></Redirect>}
                                </Route>
                            </Switch>
                        )
                            :
                            (
                                <>로딩중</>
                            )
                        }
                    </AppContainer>
                </Suspense>
            </ThemeProvider>
        </>
    );
}

export default withRouter(App);
