import { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { dateToMMDD, dateToYYYYMM, dateToYYYYMMDD, getDayName, getDifferenceBetweenStartDateAndEndDate, getWeekNumber } from "../../../utils/dateFormatUtils";
import RevenueOperatorFieldView from "./RevnueOperatorField.view";
import { Container, GraphTitleFieldWrapper } from "./SalesRevenueGraph.styled";
import _ from "lodash";
import GraphAnalysisResultFieldView from "./GraphAnalysisResultField.view";
import GraphFieldView from "./GraphField.view";

class GraphDataset {
    constructor() {
        this.type = 'bar';
        this.label = '';
        this.data = [];
        this.fill = false;
        this.borderColor = '#80A9E1';
        this.backgroundColor = '#80A9E1';
        this.order = 0;
    }

    toJSON() {
        return {
            type: this.type,
            label: this.label,
            data: this.data,
            fill: this.fill,
            borderColor: this.borderColor,
            backgroundColor: this.backgroundColor,
            order: this.order
        }
    }
}

function GraphTitleField({ element }) {
    return (
        <GraphTitleFieldWrapper>
            {element}
        </GraphTitleFieldWrapper>
    );
}

// 그래프 색상
const ORDER_GRAPH_BG_COLOR = ['#D678CD', '#FF7FAB', '#FF9D83', '#FFCA67', '#B9B4EB', '#00C894', '#D5CABD', '#389091', '#95C477'];
// 그래프 기본 2가지 색상
const PIAAR_DEFAUTL_GRAPH_BG_COLOR = ['#B9B4EB', '#908CB8'];

const SalesRevenueGraphComponent = (props) => {
    const location = useLocation();
    const query = qs.parse(location.search);

    const [revenueGraphData, dispatchRevenueGraphData] = useReducer(revenueGraphDataReducer, initialRevenueGraphData);

    const [revenueAnalysisResult, dispatchRevenueAnalysisResult] = useReducer(revenueAnalysisResultReducer, initialRevenueAnalysisResult);
    const [analysisItem, dispatchAnalysisItem] = useReducer(analysisItemReducer, initialAnalysisItem);

    const [graphLabels, dispatchGraphLabels] = useReducer(graphLabelsReducer, initialGraphLabels);
    const [graphDatasets, dispatchGraphDatasets] = useReducer(graphDatasetsReducer, initialGraphDatasets);
    
    useEffect(() => {
        if (!props.erpItemData) {
            return;
        }

        let data = props.erpItemData.map(r => r.erpOrderItem);
        dispatchAnalysisItem({
            type: 'INIT_DATA',
            payload: data
        })
    }, [props.erpItemData])

    useEffect(() => {
        if (!analysisItem) {
            return;
        }

        dispatchGraphLabels({type: 'CLEAR'});
        dispatchGraphDatasets({type: 'CLEAR'});
        dispatchRevenueGraphData({type: 'CLEAR'});

        switch (props.searchItem) {
            case 'total':
                onActionCreateRevenueGraphData();
                break;
            case 'salesChannel':
                onActionCreateChannelRevenueGraphData();
                break;
            case 'category':
                onActionCreateCategoryRevenueGraphData();
                break;
            case 'product':
                onActionCreateProductRevenueGraphData();
                break;
            default: break;
        }

    }, [analysisItem, props.searchItem, props.analysisDateRange]);

    useEffect(() => {
        if(!(graphDatasets && graphLabels)) {
            return;
        }

        onActionSetGraphDataset();
    }, [graphLabels, graphDatasets, props.hideOrderGraph])
    
    // 1-1. 전체 - 총 매출액
    const onActionCreateRevenueGraphData = () => {
        // date는 [주별, 월별] 검색에서 중복날짜를 제거하기 위해 Set으로 설정
        let date = new Set([]);
        let analysis = [];
        let salesDatasets = [];
        let orderDatasets = [];

        let startDate = query.startDate;
        let endDate = query.endDate;

        let betweenDay = getDifferenceBetweenStartDateAndEndDate(startDate, endDate);
        for (let i = 0; i < betweenDay; i++) {
            let lastDate = new Date(endDate);
            lastDate.setDate(lastDate.getDate() - i);
            let addDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, lastDate);
            date.add(addDate);
        }

        // 조회 날짜별로 초기값 세팅
        analysis = [...date].map(r => {
            return {
                key: r,
                value: 0
            }
        });
        analysis.reverse();

        // 기본 - 판매 그래프
        let salesAnalysis = [...analysis];
        let erpSalesItem = analysisItem.filter(r => r.salesYn === 'y');

        erpSalesItem.forEach(r => {
            let compareDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, r.channelOrderDate);
            salesAnalysis = salesAnalysis.map(r2 => {
                if (r2.key === compareDate) {
                    return r2 = {
                        ...r2,
                        value: parseInt(r2.value) + parseInt(r.price) + parseInt(r.deliveryCharge)
                    }
                } else {
                    return r2;
                }
            })
        })

        let salesDataset = salesAnalysis.map(r => r.value);

        let barGraphDataset = new GraphDataset().toJSON();
        barGraphDataset = {
            ...barGraphDataset,
            type: 'bar',
            label: '판매 매출액',
            data: salesDataset,
            fill: false,
            borderColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[1],
            backgroundColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[1],
        }
        salesDatasets.push(barGraphDataset);

        // 전체 판매 매출액 분석 결과 텍스트 설정
        let revenueAnalysis = setAnalysisResultText(salesDatasets);
        revenueAnalysis.sort((a, b) => b.value - a.value);

        dispatchRevenueAnalysisResult({
            type: 'INIT_DATA',
            payload: revenueAnalysis
        })

        // 옵션 - 주문 그래프 값 세팅
        let orderAnalysis = [...analysis];
        analysisItem.forEach(r => {
            let compareDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, r.channelOrderDate);
            orderAnalysis = orderAnalysis.map(r2 => {
                if (r2.key === compareDate) {
                    return {
                        ...r2,
                        value: parseInt(r2.value) + parseInt(r.price) + parseInt(r.deliveryCharge)
                    }
                } else {
                    return r2;
                }
            })
        })

        let orderDataset = orderAnalysis.map(r => r.value);

        let lineGraphDataset = new GraphDataset().toJSON();
        lineGraphDataset = {
            ...lineGraphDataset,
            type: 'line',
            label: '주문 매출액',
            data: orderDataset,
            fill: false,
            borderColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[0] + '88',
            backgroundColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[0] + '88',
            order: -1
        }
        orderDatasets.push(lineGraphDataset);

        let labels = analysis.map(r => getAnalysisDateFormatToViewFormat(props.analysisDateRange, r.key));

        dispatchGraphLabels({
            type: 'INIT_DATA',
            payload: labels
        })

        dispatchGraphDatasets({
            type: 'INIT_DATA',
            payload: {
                sales: salesDatasets,
                order: orderDatasets
            }
        })
    }

    // 1-2. 판매스토어 별 - 총 매출액
    const onActionCreateChannelRevenueGraphData = () => {
        let date = new Set([]);
        let channel = new Set([]);
        let analysis = [];
        let salesDatasets = [];
        let orderDatasets = [];

        let startDate = query.startDate;
        let endDate = query.endDate;

        let betweenDay = getDifferenceBetweenStartDateAndEndDate(startDate, endDate);
        for (let i = 0; i < betweenDay; i++) {
            let lastDate = new Date(endDate);
            lastDate.setDate(lastDate.getDate() - i);
            let addDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, lastDate);
            date.add(addDate);
        }

        // 채널 추출
        analysisItem.forEach(r => channel.add(r.salesChannel || '미지정'));

        // key: 날짜, store1: 0, store2: 0, store3: 0, ...
        date.forEach(r => {
            let data = {};
            channel.forEach(r2 => {
                data = {
                    ...data,
                    key: r,
                    [r2]: 0
                }
            })
            analysis.push(data);
        })
        analysis.reverse();

        // 기본 - 판매 그래프
        let salesAnalysis = [...analysis];
        let erpSalesItem = analysisItem.filter(r => r.salesYn === 'y');

        erpSalesItem.forEach(r => {
            let compareDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, r.channelOrderDate);
            salesAnalysis = salesAnalysis.map(r2 => {
                if (r2.key === compareDate) {
                    let salesChannel = r.salesChannel || '미지정';
                    return {
                        ...r2,
                        [salesChannel]: parseInt(r2[salesChannel]) + parseInt(r.price) + parseInt(r.deliveryCharge)
                    }
                } else {
                    return r2;
                }
            })
        })

        let salesChannelRevenue = [...channel].map(r => salesAnalysis.map(r2 => r2[r]));

        // 판매스토어 개수가 팔레트색상 사이즈보다 크다면 랜덤한 컬러 생성
        let graphColor = ORDER_GRAPH_BG_COLOR;
        for (let i = ORDER_GRAPH_BG_COLOR.length; i < channel.size; i++) {
            let randomColor = `#${Math.round(Math.random() * 0xFFFFFF).toString(16)}`;
            graphColor.push(randomColor);
        }

        [...channel].forEach((r, idx) => {
            let channelGraphDataset = new GraphDataset().toJSON();
            channelGraphDataset = {
                ...channelGraphDataset,
                type: 'bar',
                label: r,
                data: salesChannelRevenue[idx],
                borderColor: graphColor[idx],
                backgroundColor: graphColor[idx]
            }
            salesDatasets.push(channelGraphDataset);
        })

        // 채널 스토어 별 분석 결과 텍스트 설정
        let channelSalesRevenue = setAnalysisResultText(salesDatasets);
        channelSalesRevenue.sort((a, b) => b.value - a.value);

        dispatchRevenueAnalysisResult({
            type: 'INIT_DATA',
            payload: channelSalesRevenue
        })

        // 옵션 - 주문 그래프
        let orderAnalysis = [...analysis];
        analysisItem.forEach(r => {
            let compareDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, r.channelOrderDate);
            orderAnalysis = orderAnalysis.map(r2 => {
                if (r2.key === compareDate) {
                    let salesChannel = r.salesChannel || '미지정';
                    return {
                        ...r2,
                        [salesChannel]: parseInt(r2[salesChannel]) + parseInt(r.price) + parseInt(r.deliveryCharge)
                    }
                } else {
                    return r2;
                }
            })
        })

        let orderChannelRevenue = [...channel].map(r => orderAnalysis.map(r2 => r2[r]));

        [...channel].forEach((r, idx) => {
            let channelGraphDataset = new GraphDataset().toJSON();
            channelGraphDataset = {
                ...channelGraphDataset,
                type: 'line',
                label: '(주문) ' + r,
                data: orderChannelRevenue[idx],
                backgroundColor: graphColor[idx] + '88',
                borderColor: graphColor[idx] + '88',
                order: -1
            }
            orderDatasets.push(channelGraphDataset);
        })

        let labels = analysis.map(r => getAnalysisDateFormatToViewFormat(props.analysisDateRange, r.key));

        dispatchGraphLabels({
            type: 'INIT_DATA',
            payload: labels
        })

        dispatchGraphDatasets({
            type: 'INIT_DATA',
            payload: {
                sales: salesDatasets,
                order: orderDatasets
            }
        })
    }

    // 1-3. 카테고리 별 - 총 매출액
    const onActionCreateCategoryRevenueGraphData = () => {
        let date = new Set([]);
        let category = new Set([]);
        let analysis = [];
        let salesDatasets = [];
        let orderDatasets = [];

        let startDate = query.startDate;
        let endDate = query.endDate;

        let betweenDay = getDifferenceBetweenStartDateAndEndDate(startDate, endDate);
        for (let i = 0; i < betweenDay; i++) {
            let lastDate = new Date(endDate);
            lastDate.setDate(lastDate.getDate() - i);
            let addDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, lastDate);
            date.add(addDate);
        }

        // 카테고리 추출
        analysisItem.forEach(r => {
            category.add(r.categoryName || '미지정');
        })

        date.forEach(r => {
            let data = {};
            category.forEach(r2 => {
                data = {
                    ...data,
                    key: r,
                    [r2]: 0
                }
            })
            analysis.push(data);
        })
        analysis.reverse();

        // 기본 - 판매 그래프
        let salesAnalysis = [...analysis];
        let erpSalesItem = analysisItem.filter(r => r.salesYn === 'y');

        erpSalesItem.forEach(r => {
            let compareDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, r.channelOrderDate);
            salesAnalysis = salesAnalysis.map(r2 => {
                if (r2.key === compareDate) {
                    let categoryName = (r.categoryName === '' ? '미지정' : r.categoryName);
                    return {
                        ...r2,
                        [categoryName]: parseInt(r2[categoryName]) + parseInt(r.price) + parseInt(r.deliveryCharge)
                    }
                } else {
                    return r2;
                }
            })
        })

        let salesCategoryRevenue = [...category].map(r => salesAnalysis.map(r2 => r2[r]));

        // 카테고리 개수가 팔레트색상 사이즈보다 크다면 랜덤한 컬러 생성
        let graphColor = ORDER_GRAPH_BG_COLOR;
        for (let i = ORDER_GRAPH_BG_COLOR.length; i < category.size; i++) {
            let randomColor = `#${Math.round(Math.random() * 0xFFFFFF).toString(16)}`;
            graphColor.push(randomColor);
        }

        [...category].forEach((r, idx) => {
            let categoryGraphDataset = new GraphDataset().toJSON();
            categoryGraphDataset = {
                ...categoryGraphDataset,
                type: 'bar',
                label: r,
                data: salesCategoryRevenue[idx],
                borderColor: graphColor[idx],
                backgroundColor: graphColor[idx]
            }
            salesDatasets.push(categoryGraphDataset);
        })

        // 카테고리 별 분석 결과 텍스트 설정
        let categorySalesRevenue = setAnalysisResultText(salesDatasets);
        categorySalesRevenue.sort((a, b) => b.value - a.value);

        dispatchRevenueAnalysisResult({
            type: 'INIT_DATA',
            payload: categorySalesRevenue
        })

        // 옵션 - 주문 그래프
        let orderAnalysis = [...analysis];

        analysisItem.forEach(r => {
            let compareDate = getDateToAnalysisRangeDateFormat(props.analysisDateRange, r.channelOrderDate);
            orderAnalysis = orderAnalysis.map(r2 => {
                if (r2.key === compareDate) {
                    let categoryName = r.categoryName || '미지정';
                    return {
                        ...r2,
                        [categoryName]: parseInt(r2[categoryName]) + parseInt(r.price) + parseInt(r.deliveryCharge)
                    }
                } else {
                    return r2;
                }
            })
        })

        let orderCategoryRevenue = [...category].map(r => orderAnalysis.map(r2 => r2[r]));

        [...category].forEach((r, idx) => {
            let categoryGraphDataset = new GraphDataset().toJSON();
            categoryGraphDataset = {
                ...categoryGraphDataset,
                type: 'line',
                label: '(주문) ' + r,
                data: orderCategoryRevenue[idx],
                borderColor: graphColor[idx] + '88',
                backgroundColor: graphColor[idx] + '88',
                order: -1
            }
            orderDatasets.push(categoryGraphDataset);
        })

        let labels = analysis.map(r => getAnalysisDateFormatToViewFormat(props.analysisDateRange, r.key));

        dispatchGraphLabels({
            type: 'INIT_DATA',
            payload: labels
        })

        dispatchGraphDatasets({
            type: 'INIT_DATA',
            payload: {
                sales: salesDatasets,
                order: orderDatasets
            }
        })
    }

    // 1-4. 상품 별 - 총 매출액 및 주문 수량
    const onActionCreateProductRevenueGraphData = () => {
        let product = new Set([]);
        let analysis = [];
        let revenueDatasets = [];
        let unitDatasets = [];

        // 주문의 bestRevenueItem(best top 15)를 추출해 판매데이터를 확인
        let bestRevenueItem = [];
        let bestRevenueLabel = [];
        let bestUnitItem = [];
        let bestUnitLabel = [];

        // 상품 추출
        analysisItem.forEach(r => {
            product.add(r.prodDefaultName || '미지정');
        })

        analysis = [...product].map(r => {
            return {
                key: r,
                revenue: 0,
                unit: 0
            }
        })

        // 기본 - 판매 그래프
        let salesAnalysis = [...analysis];
        let erpSalesItem = analysisItem.filter(r => r.salesYn === 'y');

        erpSalesItem.forEach(r => {
            salesAnalysis = salesAnalysis.map(r2 => {
                let prodDefaultName = r.prodDefaultName || '미지정';
                if (prodDefaultName === r2.key) {
                    return {
                        ...r2,
                        revenue: parseInt(r2.revenue) + parseInt(r.price) + parseInt(r.deliveryCharge),
                        unit: parseInt(r2.unit) + parseInt(r.unit)
                    }
                } else {
                    return r2;
                }
            })
        })

        // 상품 best15 추출
        bestRevenueItem = _.sortBy(salesAnalysis, 'revenue').reverse();
        bestRevenueItem = bestRevenueItem.slice(0, 15);
        bestUnitItem = _.sortBy(salesAnalysis, 'unit').reverse();
        bestUnitItem = bestUnitItem.slice(0, 15);

        // 상품 매출액 best15 상품명, 매출액 추출
        bestRevenueLabel = bestRevenueItem.map(r => r.key);
        let revenueValues = bestRevenueItem.map(r => r.revenue);

        // 상품 판매건 best15 상품명, 주문건 추출
        bestUnitLabel = bestUnitItem.map(r => r.key);
        let unitValues = bestUnitItem.map(r => r.unit);

        let salesRevenueDataset = new GraphDataset().toJSON();
        salesRevenueDataset = {
            ...salesRevenueDataset,
            type: 'bar',
            label: '(판매) 매출액',
            data: revenueValues,
            backgroundColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[0],
            borderColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[0],
        }

        let salesUnitDataset = new GraphDataset().toJSON();
        salesUnitDataset = {
            ...salesUnitDataset,
            type: 'bar',
            label: '(판매) 주문 수량',
            data: unitValues,
            backgroundColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[1],
            borderColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[1],
        }

        revenueDatasets.push(salesRevenueDataset);
        unitDatasets.push(salesUnitDataset);

        // 기본 - 주문 그래프
        let orderAnalysis = [...analysis];

        analysisItem.forEach(r => {
            orderAnalysis = orderAnalysis.map(r2 => {
                let prodDefaultName = r.prodDefaultName || '미지정';
                if (prodDefaultName === r2.key) {
                    return {
                        ...r2,
                        revenue: parseInt(r2.revenue) + parseInt(r.price) + parseInt(r.deliveryCharge),
                        unit: parseInt(r2.unit) + parseInt(r.unit)
                    }
                } else {
                    return r2;
                }
            })
        })

        // best15 추출
        revenueValues = bestRevenueItem.map(r => orderAnalysis.filter(r2 => r.key === r2.key)[0]?.revenue);
        unitValues = bestUnitItem.map(r => orderAnalysis.filter(r2 => r.key === r2.key)[0]?.unit);

        let orderRevenueDataset = new GraphDataset().toJSON();
        orderRevenueDataset = {
            ...orderRevenueDataset,
            type: 'line',
            label: '(주문) 매출액',
            data: revenueValues,
            backgroundColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[0] + '88',
            borderColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[0] + '88',
            order: -1
        }

        let orderUnitDataset = new GraphDataset().toJSON();
        orderUnitDataset = {
            ...orderRevenueDataset,
            type: 'line',
            label: '(주문) 주문 수량',
            data: unitValues,
            backgroundColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[1] + '88',
            borderColor: PIAAR_DEFAUTL_GRAPH_BG_COLOR[1] + '88',
            order: -1
        }

        revenueDatasets.push(orderRevenueDataset);
        unitDatasets.push(orderUnitDataset);

        dispatchGraphLabels({
            type: 'INIT_DATA',
            payload: {
                revenue: bestRevenueLabel,
                unit: bestUnitLabel
            }
        })

        dispatchGraphDatasets({
            type: 'INIT_DATA',
            payload: {
                revenue: revenueDatasets,
                unit: unitDatasets
            }
        })
    }

    // hideOrderGraph 값에 따라 표시되는 데이터 변환
    const onActionSetGraphDataset = () => {
        if(props.searchItem === 'product') {
            let revenueDatasets = [...graphDatasets.revenue];
            let unitDatasets = [...graphDatasets.unit];

            if(props.hideOrderGraph) {
                revenueDatasets.pop();
                unitDatasets.pop();
            }

            let data = {
                revenue: {
                    labels: graphLabels.revenue,
                    datasets: revenueDatasets
                },
                unit: {
                    labels: graphLabels.unit,
                    datasets: unitDatasets
                }
            }

            dispatchRevenueGraphData({
                type: 'INIT_DATA',
                payload: data
            })
            return;
        }

        let datasets = [...graphDatasets.sales];

        if(!props.hideOrderGraph) {
            datasets = datasets.concat([...graphDatasets.order]);
        }

        dispatchRevenueGraphData({
            type: 'INIT_DATA',
            payload: {
                labels: graphLabels,
                datasets
            }
        })
    }

    // dateRange(일, 주, 월)값에 따라 date값을 변환한다
    const getDateToAnalysisRangeDateFormat = (dateRange, date) => {
        let addDate = dateToYYYYMMDD(date);
        if (dateRange === 'week') {
            addDate = dateToYYYYMM(date) + '-' + getWeekNumber(date);
        } else if (dateRange === 'month') {
            addDate = dateToYYYYMM(date);
        }
        return addDate;
    }

    // dateRange(일, 주, 월)값에 따라 date값을 view 형식으로 변환한다
    const getAnalysisDateFormatToViewFormat = (dateRange, date) => {
        let viewDateFormat = dateToMMDD(date) + ' (' + getDayName(date) + ')';
        if (dateRange === 'week') {
            viewDateFormat = date + '주차';
        } else if (dateRange === 'month') {
            viewDateFormat = date;
        }
        return viewDateFormat;
    }

    const setAnalysisResultText = (datasets) => {
        return datasets?.map(r => {
            let sum = 0;
            r.data.forEach(r2 => sum += r2);

            return {
                label: r.label,
                value: sum,
                color: r.backgroundColor
            }
        })
    }

    const onChangeRevenueDropDownItem = (e) => {
        let target = e.target.value;
        props._onAction_changeRevenueItem(target);

        dispatchRevenueGraphData({
            type: 'CLEAR'
        })

        dispatchRevenueAnalysisResult({
            type: 'CLEAR'
        })
    }

    return (
        <Container>
            {revenueGraphData && 
                <div className='graph-group'>
                    <GraphTitleField
                        element={
                            props.searchItem === 'product' ?
                                (<div className='title'>[ 총 매출액 & 주문 수량]</div>)
                                :
                                (<div className='title'>[ 총 매출액 ]</div>)
                        }
                    ></GraphTitleField>
                    <RevenueOperatorFieldView
                        searchItem={props.searchItem}
                        onChangeRevenueDropDownItem={onChangeRevenueDropDownItem}
                    ></RevenueOperatorFieldView>
                    <div className='flex-box'>
                        <GraphFieldView
                            searchItem={props.searchItem}
                            revenueGraphData={revenueGraphData}
                        ></GraphFieldView>
                        {revenueAnalysisResult &&
                            <GraphAnalysisResultFieldView
                                searchItem={props.searchItem}
                                revenueAnalysisResult={revenueAnalysisResult}
                            ></GraphAnalysisResultFieldView>
                        }
                    </div>
                </div>
            }
        </Container>
    )
}

export default SalesRevenueGraphComponent;

const initialRevenueAnalysisResult = null;
const initialAnalysisItem = null;
const initialRevenueGraphData = null;
const initialGraphLabels = null;
const initialGraphDatasets = {};

const revenueAnalysisResultReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialRevenueAnalysisResult;
        default:
            return state;
    }
}

const analysisItemReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialAnalysisItem;
        default:
            return state;
    }
}

const revenueGraphDataReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialRevenueGraphData;
        default:
            return state;
    }
}

const graphLabelsReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return initialGraphLabels;
        default:
            return state;
    }
}

const graphDatasetsReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CHANGE_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return initialGraphDatasets;
        default:
            return state;
    }
}
