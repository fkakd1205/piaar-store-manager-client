import styled from "styled-components";

const Container = styled.div`
    padding: 2%;
    margin-bottom: 100px;

    .graph-group {
        padding-bottom: 30px;
    }

    .flex-box {
        display: flex;
        justify-content: space-around;
        align-items: center;

        @media screen and (max-width: 992px) {
            flex-wrap: wrap;
        }
    }

    .icon-dot {
        position: relative;
        margin-right: 5px;
        width: 8px;
        height: 8px;
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
    }
`;

const GraphTitleFieldWrapper = styled.div`
    font-size: 1.1rem;
    font-weight: 700;
    padding: 20px 0;

    .title {
        width: 100%;
        background-color: #e1e1e1bb;
        color: #000;
        text-align: center;
        padding: 5px 0;
    }

    .info-text {
        font-size: 14px;
        color: var(--erp-main-color);
        padding: 10px;
        width: 100%;
        text-align: right;
    }
`;

const RevenueGraphFieldWrapper = styled.div`
    padding: 20px;
    margin-bottom: 20px;
    min-height: 300px;
    width: 100%;

    .graph-wrapper {
        height: 400px;
    }
    
    .half-type-graph {
        display: flex;
        width: 50%;

        @media screen and (max-width: 992px) {
            width: 100%;
            flex-direction: column;
        }
    }

    .md-height-graph {
        height: 300px;
    }

    .info-text {
        font-size: 14px;
        color: #444;
        padding: 10px 5px;
        font-weight: 700;
    }

    .flex-box {
        display: flex;
        flex-wrap: wrap;
    }
`;

const GraphAnalysisResultFieldWrapper = styled.div`
    width: 400px;
    height: 340px;
    border-radius: 5px;
    box-shadow: 0px 0px 7px 3px #eee;
    padding: 10px;

    @media screen and (max-width: 992px) {
        height: 200px;
    }

    .analysis-group {
        overflow: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 80%;
    }

    .title-text {
        font-weight: 700;
        padding: 10px;
        text-align: center;
        height: 50px;
    }

    .value-info {
        font-weight: 500;
        font-size: 1rem;
        color: #444;

        @media screen and (max-width: 992px) {
            font-size: 12px;
        }
    }

    .analysis-value {
        border-bottom: 1px solid #dedede;
        font-size: 1.1rem;
        display : flex;
        justify-content: space-between;
        align-items : center;
        font-weight: 700;
        padding: 8px 10px;
        color: #3a3b88;

        @media screen and (max-width: 992px) {
            font-size: 12px;
        }
    }
`;

const DayRevenueGraphFieldWrapper = styled.div`
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    
    .half-type-graph {
        width: 45%;
        height: 400px;

        @media screen and (max-width: 992px) {
            width: 100%;
            flex-direction: column;
            height: 300px;
        }
    }

    .md-height-graph {
        height: 300px;
    }

    .checkbox-group {
        display: flex;
        gap: 15px;
        padding: 1% 2%;
        font-weight: 600;
    }

    .checkbox-input {
        margin: 5px;
    }
`;

const OrderAnalysisGraphFieldWrapper = styled.div`
    padding: 20px;
    margin-bottom: 20px;
    min-height: 300px;
    width: 100%;

    .graph-wrapper {
        height: 400px;
    }
`;

const TableFieldWrapper = styled.div`
    text-align: center;
    height: 70vh;
    overflow: auto;
    border: 1px solid #e0e0e0;
    background-color: white;
    box-shadow: 2px 2px 10px #b0b2b799;
    font-size: 14px;

    @media only screen and (max-width:768px){
        font-size: 10px;
    }

    .fixed-header {
        background-color: #ededed;
        height: 35px;
        position: sticky;
        top: 0;
        z-index:10;
    }

    table {
        position:relative;
        text-align: center;
        /* width: fit-cont; */
        table-layout: fixed;
        border: none;
        word-break: break-all;
    }

    table thead {
        width: 100%;
    }

    table tbody .first-tr {
        background-color: #F1EDFFBB !important;
        font-weight: 600;
        color: #000;
    }

    table tbody tr {
        border: 1px solid #eee;
        height: 30px;
        color: #555;

        :hover{
            background: #00000006;
        }
    }

    table tbody td {
        border: 1px solid #eee;
    }
`;

const RevenueOperatorFieldViewWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 992px) {
        flex-direction: column;
        align-items: flex-start;
    }

    .select-group {
        width: 80%;
        display: flex;
        gap: 10px;

        @media screen and (max-width: 992px){
            flex-direction: column;
        }
    }

    .select-item {
        width: 300px;
        height: 35px;
        padding: 0 10px;
        border: 1px solid #ccc;
        border-radius: 0;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none; 
        appearance: none;
        background:url('/assets/icon/down_arrow_gray_icon.png') no-repeat right 5px center;

        &:focus{
            outline: none;
        }

        @media screen and (max-width: 992px){
            width: 70%;
        }
    }

    .checkbox-group {
        display: flex;
        gap: 15px;
        padding: 1% 2%;
        font-weight: 600;
    }

    .checkbox-input {
        margin: 5px;
    }
`;

export {
    Container,
    RevenueGraphFieldWrapper,
    GraphTitleFieldWrapper,
    DayRevenueGraphFieldWrapper,
    OrderAnalysisGraphFieldWrapper,
    TableFieldWrapper,
    RevenueOperatorFieldViewWrapper,
    GraphAnalysisResultFieldWrapper
}