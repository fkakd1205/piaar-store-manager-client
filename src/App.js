import { useEffect, Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoadingTrue, setUserLoadingFalse, setUserInfo } from './redux/actions/user';
// component
import FullPageLoading from './component/loading/FullPageLoading';
import HomeMain from './component/home/HomeMain';
import WaybillMain from './component/waybill/WaybillMain';
import LoginMain from './component/login/LoginMain';

// component : account book
import AccountBookMain from './component/account_book/AccountBookMain';
import IncomeMain from './component/account_book/IncomeMain';
import ExpenditureMain from './component/account_book/ExpenditureMain';

// data connect
import { userDataConnect } from './data_connect/userDataConnect';
import CommuteRecordMain from './component/commute_record/CommuteRecordMain';

// refactor
import SalesAnalysisPage from './pages/sales_analysis/SalesAnalysisPage';
import ProductDetailPage from './pages/product_detail/ProductDetailPage';
import ProductCreatePage from './pages/product_create/ProductCreatePage';
import ExcelTranslatorPage from './pages/excel_translator/ExcelTranslatorPage';
import ErpManagementOrderUploadPage from './pages/erp/management/order-upload/ErpManagementOrderUploadPage';
import ErpManagementOrderPage from './pages/erp/management/order/ErpManagementOrderPage';
import ErpManagementSalesPage from './pages/erp/management/sales/ErpManagementSalesPage';
import ErpManagementReleaseCompletePage from './pages/erp/management/release-complete/ErpManagementReleaseCompletePage';
import ErpManagementExcelFormPage from './pages/erp/management/excel/ErpManagementExcelFormPage';
import ProductManagePage from './pages/product_manage/ProductManagePage';
import StockAnalysisPage from './pages/stock_analysis/SalesAnalysisPage';
import ErpManagementDashboardPage from './pages/erp/management/dashboard/ErpManagementDashboardPage';
import SalesPerformancePage from './pages/sales_performance/SalesPerformancePage';
import StockCyclePage from './pages/stock_cycle/StockCyclePage';
import ErpReturnManagementRegistrationPage from './pages/erp/return-management/registration/ErpReturnManagementRegistrationPage';
import ErpReturnManagementCollectingPage from './pages/erp/return-management/collecting/ErpReturnManagementCollectingPage';
import ErpReturnManagementCollectedPage from './pages/erp/return-management/collected/ErpReturnManagementCollectedPage';
import ErpReturnManagementCompletedPage from './pages/erp/return-management/completed/ErpReturnManagementCompletedPage';
import ErpReturnManagementRejectedPage from './pages/erp/return-management/rejected/ErpReturnManagementRejectedPage';


const theme = unstable_createMuiStrictModeTheme();

const AppContainer = styled.div`
    animation: fadein 1.5s;
    -moz-animation: fadein 1.5s; /* Firefox */
    -webkit-animation: fadein 1.5s; /* Safari and Chrome */
    -o-animation: fadein 1.5s; /* Opera */
`;

function App(props) {
    const userRdx = useSelector(state => state.user);
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        async function userCheckInit() {
            await userDataConnect().loginCheck()
                .then(res => {
                    // console.log(res);
                    if (res.status == 200 && res.data.message == 'loged') {
                        dispatch(setUserInfo(res.data.data))
                    }
                })
                .catch(err => {
                    if(!err.response){
                        alert('페이지에 연결할 수 없습니다. 서버 연결이 끊겼습니다.');
                    }
                    console.log(err.response);
                })
            dispatch(setUserLoadingFalse());

        }
        userCheckInit();
    }, [location])

    return (
        <>
            <ThemeProvider theme={theme}>
                <Suspense fallback={<FullPageLoading></FullPageLoading>}>
                    <AppContainer>
                        {(userRdx.isLoading == false ? (
                            userRdx.userInfo ? (
                                userRdx.userInfo.roles.includes("ROLE_LOGISTICS") ? (
                                    <Routes>
                                        <Route path="*" element={<HomeMain />} />
                                        <Route path="/" element={<HomeMain />} />
                                        <Route path='/login' element={<LoginMain />} />
                                        <Route path='/products' element={<ProductManagePage />} />
                                        <Route path='/product-detail' element={<ProductDetailPage />} />
                                    </Routes>
                                )
                                    : (
                                        <Routes>
                                            {/* {console.log(userRdx.userInfo.roles.includes("ROLE_MANAGER"))} */}
                                            {/* 올바르지 않은 url 입력 or 접근 제한되었을 때 */}
                                            <Route path="*" element={<HomeMain />} />

                                            {/* Home */}
                                            <Route path="/" element={<HomeMain />} />

                                            {/* Login Signup etc.. */}
                                            <Route path='/login' element={<LoginMain />} />

                                            {/* refactor page 5 - /products -> /ex/products */}
                                            {/* Product Manage */}
                                            {/* <Route path='/ex/products' element={<ProductManageMain />} /> */}
                                            <Route path='/products' element={<ProductManagePage />} />

                                            {/* refactor page 2 - /product-detail -> /ex/product-detail */}
                                            {/* <Route path='/ex/product-detail' element={<ProductDetailMain />} /> */}
                                            <Route path='/product-detail' element={<ProductDetailPage />} />

                                            {/* OrderManage */}
                                            {/* <Route path="/order-confirm" element={<OrderConfirmMain />} /> */}

                                            <Route path="/waybill" element={<WaybillMain />} />

                                            {/* Account book */}
                                            {(userRdx.userInfo.roles.includes("ROLE_ADMIN") || userRdx.userInfo.roles.includes("ROLE_MANAGER")) &&
                                                <>
                                                    <Route path='/account-book' element={<AccountBookMain />} />
                                                    <Route path='/account-book/income' element={<IncomeMain />} />
                                                    <Route path='/account-book/expenditure' element={<ExpenditureMain />} />
                                                </>
                                            }

                                            {/* Sales Rate */}
                                            {/* <Route path='/sales-rate/naver' element={<SalesRateNaverMain />} /> */}

                                            {/* refactor page 3 - /product/create -> /ex/product/create */}
                                            {/* <Route path='/ex/products/create' element={<CreateMain />} /> */}
                                            <Route path='/products/create' element={<ProductCreatePage />} />

                                            {/* Shipment */}
                                            {/* <Route path='/shipment/packing-list/naver' element={<SPackingListNaverMain />} />

                                            <Route path='/shipment/packing-list/coupang' element={<SPackingListCoupangMain />} /> */}

                                            {/* DeliveryReady - NAVER */}
                                            {/* <Route path='/delivery-ready/naver' element={<DeliveryReadyUploadNaverMain />} /> */}

                                            {/* DeliveryReady - COUPANG */}
                                            {/* <Route path='/delivery-ready/coupang' element={<DeliveryReadyUploadCoupangMain />} /> */}

                                            {/* DeliveryReady - PIAAR */}
                                            {/* <Route path='/delivery-ready/piaar' element={<DeliveryReadyUploadPiaarMain />} /> */}

                                            {/* {(userRdx.userInfo.roles.includes("ROLE_ADMIN") || userRdx.userInfo.roles.includes("ROLE_MANAGER")) &&
                                                <>
                                                    <Route path='/delivery-ready/naver/view' element={<DeliveryReadyViewNaverMain />} />
                                                    <Route path='/delivery-ready/coupang/view' element={<DeliveryReadyViewCoupangMain />} />
                                                    <Route path='/delivery-ready/piaar/view' element={<DeliveryReadyViewPiaarMain />} />
                                                </>
                                            } */}

                                            {/* <Route path='/order-registration/naver' element={<OrderRegistrationNaverMain />} /> */}

                                            <Route path='/commute-record' element={<CommuteRecordMain />} />

                                            {/* refactor page 4 - /excel-translator -> /ex/excel-translator */}
                                            {/* <Route path='/ex/excel-translator' element={<ExcelTranslatorMain />} /> */}
                                            <Route path='/excel-translator' element={<ExcelTranslatorPage />} />

                                            {/* refactor page 1 - /sales-analysis -> /ex/sales-analysis */}
                                            {/* <Route path='/ex/sales-analysis' element={<SalesAnalysisMain />} /> */}
                                            <Route path='/sales-analysis' element={<SalesAnalysisPage />} />

                                            <Route path='/stock-analysis' element={<StockAnalysisPage />} />

                                            <Route path='/sales-performance' element={<SalesPerformancePage />} />

                                            <Route path='/stock-cycle' element={<StockCyclePage />} />

                                            {/* PiaarErpManagement */}
                                            <Route path='/erp/management/dashboard' element={<ErpManagementDashboardPage />} />
                                            <Route path='/erp/management/order-upload' element={<ErpManagementOrderUploadPage />} />
                                            <Route path='/erp/management/order' element={<ErpManagementOrderPage />} />
                                            <Route path='/erp/management/sales' element={<ErpManagementSalesPage />} />
                                            <Route path='/erp/management/release-complete' element={<ErpManagementReleaseCompletePage />} />
                                            <Route path='/erp/management/excel' element={<ErpManagementExcelFormPage />} />

                                            {/* PiaarErpReturnManagement */}
                                            <Route path='/erp/return-management/registration' element={<ErpReturnManagementRegistrationPage />} />
                                            <Route path='/erp/return-management/collecting' element={<ErpReturnManagementCollectingPage />} />
                                            <Route path='/erp/return-management/collected' element={<ErpReturnManagementCollectedPage />} />
                                            <Route path='/erp/return-management/rejected' element={<ErpReturnManagementRejectedPage />} />
                                            <Route path='/erp/return-management/completed' element={<ErpReturnManagementCompletedPage />} />
                                        </Routes>
                                    )
                            )
                                :
                                <>
                                    <Routes>
                                        <Route path="*" element={<LoginMain />} />
                                    </Routes>
                                </>
                        )
                            :
                            (
                                <>로딩중</>
                            )
                        )}
                    </AppContainer>
                </Suspense>
            </ThemeProvider>
        </>
    );
}

export default App;
