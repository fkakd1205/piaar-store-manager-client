import { useEffect, useState, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { withRouter } from 'react-router';
import styled from "styled-components";

// data connect
import { deliveryReadyPiaarDataConnect } from '../../../data_connect/deliveryReadyPiaarDataConnect';
import { deliveryReadyPiaarViewHeaderDataConnect } from '../../../data_connect/deliveryReadyPiaarViewHeaderDataConnect';

// component
import DrawerNavbarMain from '../../nav/DrawerNavbarMain';
import BackdropLoading from '../../loading/BackdropLoading';
import DeliveryReadyViewPiaarBar from './DeliveryReadyViewPiaarBar';
import DeliveryReadyOrderStatusPiaarBody from './DeliveryReadyOrderStatusPiaarBody';
import DeliveryReadySoldStatusPiaarBody from './DeliveryReadySoldStatusPiaarBody';
import DeliveryReadyReleasedStatusPiaarBody from './DeliveryReadyReleasedStatusPiaarBody';
import PiaarExcelViewCommonModal from './modal/PiaarExcelViewCommonModal';
import CreateExcelViewHeaderDetailComponent from './modal/CreateExcelViewHeaderDetailComponent';

const Container = styled.div`
    height: 100vh;
    /* background-color: #f2f5ff; */
`;

const BoardTitle = styled.div`
    font-size: 20px;
    /* color: rgba(000, 102, 153, 0.9); */
    font-weight: 700;
    display: grid;
    padding: 1% 3%;
    grid-template-columns: 4fr 1fr;
    align-items: center;

    @media only screen and (max-width: 992px){
        grid-template-columns: 1fr;
        row-gap: 10px;
    }
    
    @media only screen and (max-width:576px){
        font-size: 16px;
    }

    @media only screen and (max-width:320px){
        font-size: 14px;
    }
`;

const DataOptionBox = styled.span`
    @media only screen and (max-width: 992px) {
        padding: 1% 0%;
        column-gap: 20px;
    }
`;

const HeaderFormControlBtn = styled.button`
    padding: 10px;
    background:  #2C73D2;;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border:1px solid  #7DC2FF;;
    border-radius: 20px;
    float: right;
    width: 240px;
    border: none;


    @media only screen and (max-width: 992px){
        display: inline-block;
        padding: 4px;
        width: 100%;
    }

    @media only screen and (max-width:576px ){
        padding: 0;
    }

    &:hover{
        cursor: pointer;
        transition: 0.2s;
        transform: scale(1.05);
        background: #7DC2FF;
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);
    }
`;

const DeliveryReadyViewPiaarMain = (props) => {
    const [backdropLoading, setBackdropLoading] = useState(false);
    const [viewHeaderDetailList, setViewHeaderDetailList] = useState(null);
    const [excelOrderList, setExcelOrderList] = useState(null);
    const [combinedDeliveryItemList, setCombinedDeliveryItemList] = useState(null);
    const [createPiaarViewHeaderDetailModalOpen, setCreatePiaarViewHeaderDetailModalOpen] = useState(false);

    useEffect(() => {
        async function initViewHeaderDetailList() {

            if (excelOrderList) return;

            await __handleDataConnect().getViewExcelHeaderDetail();
            await __handleDataConnect().getExcelOrderList();
        }

        initViewHeaderDetailList();
    }, []);

    const onCreatePiaarViewHeaderDetailModalOpen = () => {
        setCreatePiaarViewHeaderDetailModalOpen(true);
    }

    const onCreatePiaarViewHeaderDetailModalClose = () => {
        setCreatePiaarViewHeaderDetailModalOpen(false);
    }

    const __handleDataConnect = () => {
        return {
            getViewExcelHeaderDetail: async function () {
                await deliveryReadyPiaarViewHeaderDataConnect().searchOneByUser()
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setViewHeaderDetailList(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;

                        // 등록된 헤더가 없는 경우
                        if (res.status === 404) return;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            },
            createViewExcelHeaderDetail: async function (headerDetails) {
                await deliveryReadyPiaarViewHeaderDataConnect().postOne(headerDetails)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('저장되었습니다.');
                            this.getViewExcelHeaderDetail();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            },
            changeViewExcelHeaderDetail: async function (headerDetails) {
                await deliveryReadyPiaarViewHeaderDataConnect().putOne(headerDetails)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('저장되었습니다.');
                            this.getViewExcelHeaderDetail();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            },
            getExcelOrderList: async function () {
                await deliveryReadyPiaarDataConnect().getOrderList()
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setExcelOrderList(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            },
            changeOrderDataToSold: async function (orderData) {
                await deliveryReadyPiaarDataConnect().updateListToSold(orderData)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('처리되었습니다.');
                            __handleDataConnect().getExcelOrderList();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            },
            changeSoldDataToReleased: async function (soldData) {
                await deliveryReadyPiaarDataConnect().updateListToReleased(soldData)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('처리되었습니다.');
                            __handleDataConnect().getExcelOrderList();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            },
            changeReleasedDataToCombinedDelivery: async function (releasedData) {
                await deliveryReadyPiaarDataConnect().getCombinedDeliveryItem(releasedData)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setCombinedDeliveryItemList(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        if (res.status === 500) {
                            alert('undefined error.');
                            return;
                        }
                        alert(res?.data?.message);
                    })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            movePage: function () {
                return {
                    deliveryReadyUpload: function () {
                        props.history.replace('/delivery-ready/piaar');
                    }
                }
            },
            piaarCustomizedHeader: function () {
                return {
                    submitHeader: async function(headerDetails){
                        if(viewHeaderDetailList){
                            await __handleDataConnect().changeViewExcelHeaderDetail(headerDetails);
                        }else{
                            await __handleDataConnect().createViewExcelHeaderDetail(headerDetails);
                        }
                        onCreatePiaarViewHeaderDetailModalClose();
                    }
                }
            }
        }
    }

    return (
        <>
            <Container>
                {/* Backdrop */}
                <BackdropLoading open={backdropLoading} />
                <DrawerNavbarMain></DrawerNavbarMain>

                {/* 피아르 엑셀 컨트롤 바 */}
                <DeliveryReadyViewPiaarBar

                    moveUploadPageControl={() => __handleEventControl().movePage().deliveryReadyUpload()}
                ></DeliveryReadyViewPiaarBar>

                {/* 주문현황 */}
                <div>
                    <BoardTitle>
                        <span>피아르 주문 현황 데이터</span>
                        <DataOptionBox>
                            <HeaderFormControlBtn type="button" onClick={(e) => onCreatePiaarViewHeaderDetailModalOpen(e)}>view 양식 설정</HeaderFormControlBtn>
                        </DataOptionBox>
                    </BoardTitle>

                    {/* 데이터 현황 보드 */}
                    <DeliveryReadyOrderStatusPiaarBody
                        viewHeaderDetailList={viewHeaderDetailList}
                        excelOrderList={excelOrderList}

                        changeOrderDataToSoldControl={(orderData) => __handleDataConnect().changeOrderDataToSold(orderData)}
                    ></DeliveryReadyOrderStatusPiaarBody>
                </div>

                {/* 판매현황 데이터 보드 */}
                <DeliveryReadySoldStatusPiaarBody
                    viewHeaderDetailList={viewHeaderDetailList}
                    excelOrderList={excelOrderList}

                    changeSoldDataToReleasedControl={(orderData) => __handleDataConnect().changeSoldDataToReleased(orderData)}
                ></DeliveryReadySoldStatusPiaarBody>

                {/* 출고현황 데이터 보드 */}
                <DeliveryReadyReleasedStatusPiaarBody
                    viewHeaderDetailList={viewHeaderDetailList}
                    excelOrderList={excelOrderList}
                    combinedDeliveryItemList={combinedDeliveryItemList}

                    changeReleasedDataToCombinedDeliveryControl={(releasedData) => __handleDataConnect().changeReleasedDataToCombinedDelivery(releasedData)}
                ></DeliveryReadyReleasedStatusPiaarBody>

            </Container>

            {/* Create Piaar View Header Form Modal */}
            <PiaarExcelViewCommonModal
                open={createPiaarViewHeaderDetailModalOpen}
                onClose={() => onCreatePiaarViewHeaderDetailModalClose()}
                maxWidth={'lg'}
                fullWidth={true}
            >
                <CreateExcelViewHeaderDetailComponent
                    viewHeaderDetailList={viewHeaderDetailList}

                    onCreatePiaarViewHeaderDetailModalOpen={() => onCreatePiaarViewHeaderDetailModalOpen()}
                    onCreatePiaarViewHeaderDetailModalClose={() => onCreatePiaarViewHeaderDetailModalClose()}
                    _onSubmitPiaarCustomizedHeaderControl={(headerDetails)=>__handleEventControl().piaarCustomizedHeader().submitHeader(headerDetails)}
                >
                </CreateExcelViewHeaderDetailComponent>

            </PiaarExcelViewCommonModal>
        </>
    )
}

export default withRouter(DeliveryReadyViewPiaarMain);