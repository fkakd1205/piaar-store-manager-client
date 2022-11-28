import { useReducer, useState } from "react";
import CommonModalComponent from "../../../../module/modal/CommonModalComponent";
import ConfirmModalComponent from "../../../../module/modal/ConfirmModalComponent";
import OptionCodeModalComponent from "../option-code-modal/OptionCodeModal.component";
import ReleaseOptionCodeModalComponent from "../release-option-code-modal/ReleaseOptionCodeModal.component";
import { Container } from "./CheckedOperator.styled";
import OperatorFieldView from "./OperatorField.view";
import ReleaseConfirmFieldView from "./ReleaseConfirmField.view";

const CheckedOperatorComponent = (props) => {

    const [salesConfirmModalOpen, setSalesConfirmModalOpen] = useState(false);
    const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
    const [optionCodeModalOpen, setOptionCodeModalOpen] = useState(false);
    const [releaseConfirmModalOpen, setReleaseConfirmModalOpen] = useState(false);
    const [releaseOptionCodeModalOpen, setReleaseOptionCodeModalOpen] = useState(false);
    const [releaseConfirmItem, dispatchReleaseConfirmItem] = useReducer(releaseConfirmItemReducer, initialReleaseConfirmItem);

    const onActionOpenSalesConfirmModal = () => {
        if (props.checkedOrderItemList?.length <= 0) {
            alert('데이터를 먼저 선택해 주세요.');
            return;
        }

        setSalesConfirmModalOpen(true);
    }

    const onActionCloseSalesConfirmModal = () => {
        setSalesConfirmModalOpen(false);
    }

    const onActionConfirmCancelSales = () => {
        let releasedCodes = [];
        props.checkedOrderItemList.forEach(r => {
            if (r.releaseYn === 'y') {
                releasedCodes.push(r.uniqueCode);
            } else {
                return;
            }
        })

        if (releasedCodes && (releasedCodes.length > 0)) {
            alert(`이미 출고된 데이터가 있습니다.\n[출고 상태 관리] 탭에서 해당 고유번호의 데이터를 <출고 취소> 진행 후 다시 시도해 주세요.\n\n고유번호:\n${releasedCodes.join('\n')}`);
            onActionCloseSalesConfirmModal();
            return;
        }

        let data = props.checkedOrderItemList.map(r => {
            return {
                ...r,
                salesYn: 'n',
                salesAt: null,
                releaseYn: 'n',
                releaseAt: null
            }
        })
        props._onSubmit_changeSalesYnForOrderItemList(data);
        onActionCloseSalesConfirmModal();
    }

    const onActionOpenDeleteConfirmModal = () => {
        if (props.checkedOrderItemList?.length <= 0) {
            alert('데이터를 먼저 선택해 주세요.');
            return;
        }

        setDeleteConfirmModalOpen(true);
    }

    const onActionCloseDeleteConfirmModal = () => {
        setDeleteConfirmModalOpen(false);
    }

    const onActionConfirmDelete = () => {
        let releasedCodes = [];
        props.checkedOrderItemList.forEach(r => {
            if (r.releaseYn === 'y') {
                releasedCodes.push(r.uniqueCode);
            } else {
                return;
            }
        })

        if (releasedCodes && (releasedCodes.length > 0)) {
            alert(`이미 출고된 데이터가 있습니다.\n[출고 상태 관리] 탭에서 해당 고유번호의 데이터를 <출고 취소> 진행 후 다시 시도해 주세요.\n\n고유번호:\n${releasedCodes.join('\n')}`);
            onActionCloseDeleteConfirmModal();
            return;
        }

        props._onSubmit_deleteOrderItemList(props.checkedOrderItemList);
        onActionCloseDeleteConfirmModal();
    }

    const onActionOpenOptionCodeModal = () => {
        if (props.checkedOrderItemList?.length <= 0) {
            alert('데이터를 먼저 선택해 주세요.');
            return;
        }

        setOptionCodeModalOpen(true);
    }

    const onActionCloseOptionCodeModal = () => {
        setOptionCodeModalOpen(false);
    }

    const onActionChangeOptionCode = (optionCode) => {
        let data = [...props.checkedOrderItemList];
        data = data.map(r => {
            return {
                ...r,
                optionCode: optionCode
            }
        })
        props._onSubmit_changeOptionCodeForOrderItemListInBatch(data);
        onActionCloseOptionCodeModal();
    }

    const onActionOpenReleaseConfirmModal = async () => {
        if (props.checkedOrderItemList?.length <= 0) {
            alert('데이터를 먼저 선택해 주세요.');
            return;
        }
        
        onActionGetReleaseItem();
        setReleaseConfirmModalOpen(true);
    }

    const onActionCloseReleaseConfirmModal = () => {
        setReleaseConfirmModalOpen(false);
    }

    const onActionGetReleaseItem = () => {
        let releaseItem = [...new Set(props.checkedOrderItemList?.map(r => {
            return {
                code: r[props.selectedMatchCode],
                unit: 0
            }
        }))];

        props.checkedOrderItemList?.forEach(r => {
            releaseItem = releaseItem.map(r2 => {
                if(r2.code === r[props.selectedMatchCode]) {
                    return {
                        ...r2,
                        prodDefaultName: r.prodDefaultName,
                        optionDefaultName: r.optionDefaultName,
                        unit: parseInt(r2.unit) + parseInt(r.unit),
                        optionStockUnit: r.optionStockUnit,
                        optionPackageYn: r.optionPackageYn
                    }
                }else {
                    return r2;
                }
            })
        })

        dispatchReleaseConfirmItem({
            type: 'INIT_DATA',
            payload: releaseItem
        })
    }

    const onActionConfirmRelease = () => {
        let data = props.checkedOrderItemList.map(r => {
            return {
                ...r,
                releaseYn: 'y',
                releaseAt: new Date()
            }
        })
        props._onSubmit_changeReleaseYnForOrderItemList(data);
        onActionCloseReleaseConfirmModal();
    }

    const onActionOpenReleaseOptionCodeModal = () => {
        if (props.checkedOrderItemList?.length <= 0) {
            alert('데이터를 먼저 선택해 주세요.');
            return;
        }
        setReleaseOptionCodeModalOpen(true);
    }

    const onActionCloseReleaseOptionCodeModal = () => {
        setReleaseOptionCodeModalOpen(false);
    }

    const onActionChangeReleaseOptionCode = (optionCode) => {
        let data = [...props.checkedOrderItemList];
        data = data.map(r => {
            return {
                ...r,
                releaseOptionCode: optionCode
            }
        })
        props._onSubmit_changeReleaseOptionCodeForOrderItemListInBatch(data);
        onActionCloseReleaseOptionCodeModal();
    }

    return (
        <>
            <Container>
                <OperatorFieldView
                    onActionOpenSalesConfirmModal={onActionOpenSalesConfirmModal}
                    onActionOpenDeleteConfirmModal={onActionOpenDeleteConfirmModal}
                    onActionOpenOptionCodeModal={onActionOpenOptionCodeModal}
                    onActionOpenReleaseConfirmModal={onActionOpenReleaseConfirmModal}
                    onActionOpenReleaseOptionCodeModal={onActionOpenReleaseOptionCodeModal}
                ></OperatorFieldView>
            </Container>

            {/* Modal */}
            <ConfirmModalComponent
                open={salesConfirmModalOpen}
                title={'판매 취소 확인 메세지'}
                message={`[ ${props.checkedOrderItemList?.length || 0} ] 건의 데이터를 판매 취소 하시겠습니까?`}

                onConfirm={onActionConfirmCancelSales}
                onClose={onActionCloseSalesConfirmModal}
            ></ConfirmModalComponent>
            <ConfirmModalComponent
                open={deleteConfirmModalOpen}
                title={'데이터 삭제 확인 메세지'}
                message={
                    <>
                        <div>[ {props.checkedOrderItemList?.length || 0} ] 건의 데이터를 <span style={{ color: '#FF605C' }}>영구 삭제</span> 합니다.</div>
                        <div>삭제된 데이터는 복구되지 않습니다.</div>
                        <div>계속 진행 하시겠습니까?</div>
                    </>
                }

                onConfirm={onActionConfirmDelete}
                onClose={onActionCloseDeleteConfirmModal}
            ></ConfirmModalComponent>
            <ConfirmModalComponent
                open={releaseConfirmModalOpen}
                title={'출고 전환 확인 메세지'}
                message={
                    <ReleaseConfirmFieldView
                        selectedMatchCode={props.selectedMatchCode}
                        releaseConfirmItem={releaseConfirmItem}
                        checkedOrderItemLength={props.checkedOrderItemList?.length}
                    />
                }
                onConfirm={onActionConfirmRelease}
                onClose={onActionCloseReleaseConfirmModal}
                maxWidth='md'
            ></ConfirmModalComponent>

            {/* 옵션 코드 모달 */}
            <CommonModalComponent
                open={optionCodeModalOpen}

                onClose={onActionCloseOptionCodeModal}
            >
                <OptionCodeModalComponent
                    checkedOrderItemList={props.checkedOrderItemList}
                    productOptionList={props.productOptionList}

                    onConfirm={(optionCode) => onActionChangeOptionCode(optionCode)}
                ></OptionCodeModalComponent>
            </CommonModalComponent>

            {/* 출고 옵션 코드 모달 */}
            <CommonModalComponent
                open={releaseOptionCodeModalOpen}

                onClose={onActionCloseReleaseOptionCodeModal}
            >
                <ReleaseOptionCodeModalComponent
                    checkedOrderItemList={props.checkedOrderItemList}
                    productOptionList={props.productOptionList}

                    onConfirm={(optionCode) => onActionChangeReleaseOptionCode(optionCode)}
                ></ReleaseOptionCodeModalComponent>
            </CommonModalComponent>
        </>
    );
}
export default CheckedOperatorComponent;

const initialReleaseConfirmItem = null;

const releaseConfirmItemReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialReleaseConfirmItem;
        default: return initialReleaseConfirmItem;
    }
}