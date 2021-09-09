import axios from 'axios';
import {useState, useEffect} from 'react';
import moment from 'moment';

// data connect
import { deliveryReadyDataConnect } from '../../data_connect/deliveryReadyDataConnect';

// component
import DrawerNavbarMain from '../nav/DrawerNavbarMain';
import DeliveryReadyViewBody from './DeliveryReadyViewBody';
import DeliveryReadyDateRangePickerModal from './modal/DeliveryReadyDateRangePickerModal';
import DeliveryReadyOptionInfoModal from './modal/DeliveryReadyOptionInfoModal';
import BackdropLoading from '../loading/BackdropLoading';

const DeliveryReadyViewMain = () => {
    const [unreleasedData, setUnreleasedData] = useState(null);
    const [releasedData, setReleasedData] = useState(null);
    const [unreleaseCheckedOrderList, setUnreleaseCheckedOrderList] = useState([]);
    const [releaseCheckedOrderList, setReleaseCheckedOrderList] = useState([]);
    const [downloadOrderList, setDownloadOrderList] = useState([]);
    const [backdropLoading, setBackdropLoading] = useState(false);
    const [selectionRange, setSelectionRange] = useState(
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    );
    const [deliveryReadyDateRangePickerModalOpen, setDeliveryReadyDateRangePickerModalOpen] = useState(false);
    const [deliveryReadyOptionInfoModalOpen, setDeliveryReadyOptionInfoModalOpen] = useState(false);
    const [selectedDateText, setSelectedDateText] = useState("날짜 선택");
    const [deliveryReadyOptionInfo, setDeliveryReadyOptionInfo] = useState(null);
    const [originOptionInfo, setOriginOptionInfo] = useState(null);
    const [originOptionManagementCode, setOriginOptionManagementCode] = useState(null);
    const [changedOptionManagementCode, setChangedOptionManagementCode] = useState(null);

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().getDeliveryReadyUnreleasedData();
            await __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate);
        }
        fetchInit();
    }, []);

    const __handleDataConnect = () => {
        return {
            getDeliveryReadyUnreleasedData: async function () {
                await deliveryReadyDataConnect().getUnreleasedData()
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setUnreleasedData(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyUnreleasedData');
                    })
            },
            getDeliveryReadyReleasedData: async function (start, end) {
                var date1 = new Date(start);
                date1 = moment(date1).format('YYYY-MM-DD 00:00:00');        // start date 00:00:00 설정

                var date2 = new Date(end);
                date2 = moment(date2).format('YYYY-MM-DD 23:59:59');        // end date 23:59:59 설정

                setReleaseCheckedOrderList([]);

                await deliveryReadyDataConnect().getSelectedReleasedData(date1, date2)
                    .then(res => {
                        if (res.status == 200 && res.data && res.data.message == 'success') {
                            setReleasedData(res.data.data);
                        }
                        setSelectedDateText(date1.substring(0, 10) + " ~ " + date2.substring(1, 11));
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getDeliveryReadyReleased');
                    })

                setDeliveryReadyDateRangePickerModalOpen(false);
            },
            deleteOrderData: async function (itemCid) {
                await deliveryReadyDataConnect().deleteUnreleasedData(itemCid)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : deleteOrderData');
                    })
            },
            changeToUnreleaseData: async function (itemCid) {
                await deliveryReadyDataConnect().updateReleasedData(itemCid)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                            __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : changeToUnreleasedData');
                    })
            },
            getOptionManagementCode: async function () {
                await deliveryReadyDataConnect().searchOptionInfo()
                    .then(res => {
                        if(res.status === 200 && res.data && res.data.message === 'success') {
                            setDeliveryReadyOptionInfo(res.data.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : getOptionManagementCode');
                    })
            },
            changeItemOptionManagementCode: async function (itemCid, optionCode) {
                await deliveryReadyDataConnect().updateOptionInfo(itemCid, optionCode)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setDeliveryReadyOptionInfoModalOpen(false);
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                            __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : changeItemOptionManagementCode');
                    })
            },
            changeItemsOptionManagementCode: async function (itemCid, optionCode) {
                await deliveryReadyDataConnect().updateAllOptionInfo(itemCid, optionCode)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setDeliveryReadyOptionInfoModalOpen(false);
                            __handleDataConnect().getDeliveryReadyUnreleasedData();
                            __handleDataConnect().getDeliveryReadyReleasedData(selectionRange.startDate, selectionRange.endDate);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('undefined error. : changeItemsOptionManagementCode');
                    })
            },
            downloadOrderForm: async function (data) {
                await deliveryReadyDataConnect().downloadOrderForm(data)
                    .then(res => {
                        console.log(res);
                        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `발주서양식.xlsx`);
                        document.body.appendChild(link);
                        link.click();

                        __handleDataConnect().getDeliveryReadyUnreleasedData();
                        setBackdropLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setBackdropLoading(false);
                    });
            }
        }
    }

    const __handleEventControl = () => {
        return {
            unreleaseCheckedOrderList: function () {
                return {
                    checkAll: function () {
                        if (this.isCheckedAll()) {
                            setUnreleaseCheckedOrderList([]);
                        } else {
                            let unreleaseCheckedList = unreleasedData.map(r => r.deliveryReadyItem.id);
                            setUnreleaseCheckedOrderList(unreleaseCheckedList);
                        }
                    },
                    isCheckedAll: function () {
                        if (unreleasedData && unreleasedData.length) {
                            let unreleaseOrderIdList = unreleasedData.map(r => r.deliveryReadyItem.id).sort();
                            unreleaseCheckedOrderList.sort();

                            return JSON.stringify(unreleaseOrderIdList) === JSON.stringify(unreleaseCheckedOrderList);
                        } else return false;
                    },
                    isChecked: function (unreleaseOrderId) {
                        return unreleaseCheckedOrderList.includes(unreleaseOrderId);
                    },
                    checkOne: function (e, unreleaseOrderId) {
                        if (e.target.checked) {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.concat(unreleaseOrderId));
                        } else {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.filter(r => r !== unreleaseOrderId));
                        }
                    },
                    checkOneLi: function (unreleaseOrderId) {
                        if (unreleaseCheckedOrderList.includes(unreleaseOrderId)) {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.filter(r => r !== unreleaseOrderId));
                        } else {
                            setUnreleaseCheckedOrderList(unreleaseCheckedOrderList.concat(unreleaseOrderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if (unreleasedData) {
                            unreleasedData.forEach(order => {
                                if (unreleaseCheckedOrderList.includes(order.deliveryReadyItem.id)) {
                                    dataList.push(order);
                                }
                            })
                        }
                        return dataList;
                    },
                    delete: async function (e, itemCid) {
                        e.stopPropagation();

                        await __handleDataConnect().deleteOrderData(itemCid);
                        setUnreleaseCheckedOrderList([]);
                    }
                }
            },
            releaseCheckedOrderList: function () {
                return {
                    checkAll: function () {
                        console.log(releasedData);
                        if (this.isCheckedAll()) {
                            setReleaseCheckedOrderList([]);
                        } else if (releasedData) {
                            let releaseCheckedList = releasedData.map(r => r.deliveryReadyItem.id);
                            setReleaseCheckedOrderList(releaseCheckedList);
                        }
                    },
                    isCheckedAll: function () {
                        if (releasedData && releasedData.length) {
                            let releaseOrderIdList = releasedData.map(r => r.deliveryReadyItem.id).sort();
                            releaseCheckedOrderList.sort();

                            return JSON.stringify(releaseOrderIdList) === JSON.stringify(releaseCheckedOrderList);
                        } else return false;
                    },
                    isChecked: function (releaseOrderId) {
                        return releaseCheckedOrderList.includes(releaseOrderId);
                    },
                    checkOne: function (e, releaseOrderId) {
                        if (e.target.checked) {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.concat(releaseOrderId));
                        } else {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.filter(r => r !== releaseOrderId));
                        }
                    },
                    checkOneLi: function (releaseOrderId) {
                        if (releaseCheckedOrderList.includes(releaseOrderId)) {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.filter(r => r !== releaseOrderId));
                        } else {
                            setReleaseCheckedOrderList(releaseCheckedOrderList.concat(releaseOrderId));
                        }
                    },
                    getCheckedData: async function () {
                        let dataList = [];

                        if (releasedData) {
                            releasedData.forEach(order => {
                                if (releaseCheckedOrderList.includes(order.deliveryReadyItem.id)) {
                                    dataList.push(order);
                                }
                            })
                        }
                        return dataList;
                    },
                    changeToUnreleaseData: async function (e, itemCid) {
                        e.stopPropagation();

                        await __handleDataConnect().changeToUnreleaseData(itemCid);
                    }
                }
            },
            deliveryReadyDateRangePicker: function () {
                return {
                    open: function () {
                        setDeliveryReadyDateRangePickerModalOpen(true);
                    },
                    close: function () {
                        setDeliveryReadyDateRangePickerModalOpen(false);
                    },
                    selectDateRange: async function (startDate, endDate) {
                        await __handleDataConnect().getDeliveryReadyReleasedData(startDate, endDate);
                    },
                    changeReleasedData: function (date) {
                        setSelectionRange(date.selection);
                    }
                }
            },
            deliveryReadyOptionInfo: function () {
                return {
                    open: function (e, optionInfo) {
                        e.stopPropagation();

                        setChangedOptionManagementCode(null);
                        setDeliveryReadyOptionInfoModalOpen(true);
                        __handleEventControl().deliveryReadyOptionInfo().getOptionManagementCode(optionInfo)
                    },
                    close: function () {
                        setDeliveryReadyOptionInfoModalOpen(false);
                    },
                    changeOptionInfo: function () {
                        setDeliveryReadyOptionInfo()
                    },
                    getOptionManagementCode: async function (optionInfo) {
                        setOriginOptionInfo(optionInfo);
                        setOriginOptionManagementCode(optionInfo.optionManagementCode);

                        await __handleDataConnect().getOptionManagementCode();
                    },
                    checkOneLi: function (optionCode) {
                        setChangedOptionManagementCode(optionCode);
                    },
                    isChecked: function (optionCode) {
                        return releaseCheckedOrderList.includes(optionCode);
                    },
                    changeItemOption: async function () {
                        await __handleDataConnect().changeItemOptionManagementCode(originOptionInfo.cid, changedOptionManagementCode);
                    },
                    changeItemsOption: async function () {
                        await __handleDataConnect().changeItemsOptionManagementCode(originOptionInfo.cid, changedOptionManagementCode);
                    }
                }
            },
            downloadOrderFormData: function () {
                return {
                    submit: async function (e) {
                        e.preventDefault();
                        let unreleaseData = await __handleEventControl().unreleaseCheckedOrderList().getCheckedData();
                        let releaseData = await __handleEventControl().releaseCheckedOrderList().getCheckedData();

                        let downloadData = downloadOrderList.concat(unreleaseData);
                        downloadData = downloadData.concat(releaseData);

                        if (downloadOrderList.length || downloadData.length) {
                            setBackdropLoading(true);
                            await __handleDataConnect().downloadOrderForm(downloadOrderList.concat(downloadData));
                        }
                        else {
                            alert("no checked order data");
                        }
                    }
                }
            }
        }
    }

    return (
        <>
            <DeliveryReadyDateRangePickerModal
                open={deliveryReadyDateRangePickerModalOpen}
                releasedData={releasedData}
                selectionRange={selectionRange}

                __handleEventControl={__handleEventControl}
            ></DeliveryReadyDateRangePickerModal>

            <DeliveryReadyOptionInfoModal
                open={deliveryReadyOptionInfoModalOpen}
                originOptionInfo={originOptionInfo}
                originOptionManagementCode={originOptionManagementCode}
                changedOptionManagementCode={changedOptionManagementCode}
                deliveryReadyOptionInfo={deliveryReadyOptionInfo}

                __handleEventControl={__handleEventControl}
            ></DeliveryReadyOptionInfoModal>

           <BackdropLoading open={backdropLoading} />
           <DrawerNavbarMain></DrawerNavbarMain>
           <DeliveryReadyViewBody
                releasedData={releasedData}
                unreleasedData={unreleasedData}
                releaseCheckedOrderList={releaseCheckedOrderList}
                unreleaseCheckedOrderList={unreleaseCheckedOrderList}
                selectedDateText={selectedDateText}

                __handleEventControl={__handleEventControl}
            ></DeliveryReadyViewBody>
        </>
    )
}

export default DeliveryReadyViewMain;