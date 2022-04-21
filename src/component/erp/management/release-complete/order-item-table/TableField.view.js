import { dateToYYYYMMDDhhmmss } from '../../../../../utils/dateFormatUtils';
import SortButton from '../../../../module/button/SortButton';
import InfiniteScrollObserver from '../../../../module/observer/InfiniteScrollObserver';
import { TableFieldWrapper } from './OrderItemTable.styled';

function CorrectIcon() {
    return (
        <img
            src='/assets/icon/correct_icon.png'
            style={{ width: '15px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            alt=""
            loading='lazy'
        ></img>
    );
}

function FailedIcon() {
    return (
        <img
            src='/assets/icon/failed_icon.png'
            style={{ width: '15px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            alt=""
            loading='lazy'
        ></img>
    );
}

const HIGHLIGHT_FIELDS = [
    'releaseOptionCode',
    'categoryName',
    'prodDefaultName',
    'prodManagementName',
    'optionDefaultName',
    'optionManagementName',
    'optionStockUnit'
];

export default function TableFieldView(props) {
    return (
        <TableFieldWrapper>
            <div
                className='table-box'
                ref={props.tableScrollRef}
            >
                <table cellSpacing="0">
                    <colgroup>
                        <col className='col-5-3'></col>
                        <col className='col-5-3'></col>
                        {props.viewHeader?.headerDetail.details?.map((r, index) => {
                            return (
                                <col
                                    key={index}
                                    className='col-15-13'
                                ></col>
                            );
                        })}
                        <col className='col-5-3'></col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th
                                className="fixed-header fixed-col-left"
                                style={{ cursor: 'pointer', zIndex:'12' }}
                            >
                                재고 반영
                            </th>
                            <th
                                className="fixed-header"
                                style={{ cursor: 'pointer' }}
                            >
                                선택
                            </th>
                            {props.viewHeader?.headerDetail.details?.map((r, index) => {
                                return (
                                    <th key={index} className="fixed-header" scope="col">
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                                        >
                                            <div>
                                                {r.customCellName}
                                            </div>
                                            <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translate(0, -50%)' }}>
                                                <SortButton
                                                    buttonSize={25}
                                                    iconSize={16}
                                                    markPoint={r.matchedColumnName}
                                                ></SortButton>
                                            </div>
                                        </div>
                                        {HIGHLIGHT_FIELDS.includes(r.matchedColumnName) &&
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10%', background: '#e1d7b9' }}></div>
                                        }
                                    </th>
                                )
                            })}
                            <th
                                className="fixed-header fixed-col-right"
                                style={{ zIndex: 12 }}
                            >
                                수정
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.orderItemList &&
                            <>
                                {props.orderItemList?.slice(0, props.viewSize).map((r1, rowIndex) => {
                                    let checked = props.isCheckedOne(r1.id)
                                    return (
                                        <tr
                                            key={rowIndex}
                                            className={`${checked && 'tr-active'}`}
                                            onClick={(e) => props.onActionCheckOrderItem(e, r1)}
                                        >
                                            <td className={`fixed-col-left`}>
                                                {r1.stockReflectYn === 'y' &&
                                                    <CorrectIcon />
                                                }
                                                {r1.stockReflectYn === 'n' &&
                                                    <FailedIcon />
                                                }
                                            </td>
                                            <td style={{ cursor: 'pointer' }}>
                                                <input type='checkbox' checked={checked} onChange={(e) => props.onActionCheckOrderItem(e, r1)}></input>
                                            </td>
                                            {props.viewHeader?.headerDetail.details?.map(r2 => {
                                                let matchedColumnName = r2.matchedColumnName;
                                                if (matchedColumnName === 'createdAt') {
                                                    return (
                                                        <td key={r2.cellNumber}>{dateToYYYYMMDDhhmmss(r1[matchedColumnName] || new Date())}</td>
                                                    )
                                                }
                                                return (
                                                    <td key={r2.cellNumber}>
                                                        {r1[matchedColumnName]}
                                                    </td>
                                                )
                                            })}
                                            <td className='fixed-col-right'>
                                                <button
                                                    type='button'
                                                    className='fix-button-el'
                                                    onClick={(e) => props.onActionOpenFixItemModal(e, r1)}
                                                >
                                                    <img
                                                        src={'/assets/icon/edit_black_icon.png'}
                                                        className='fix-button-icon'
                                                        alt=""
                                                    ></img>
                                                </button>
                                            </td>
                                        </tr>
                                    )

                                })}
                            </>
                        }
                    </tbody>
                </table>
                <InfiniteScrollObserver
                    elementTagType={'div'}
                    totalSize={props.orderItemList.length}
                    startOffset={0}
                    endOffset={props.viewSize}
                    fetchData={props.onActionfetchMoreOrderItems}
                    loadingElementTag={
                        <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                            로딩중...
                        </p>
                    }
                    endElementTag={
                        <p style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#444' }}>
                            마지막 데이터 입니다.
                        </p>
                    }
                />
            </div>
        </TableFieldWrapper>
    );
}