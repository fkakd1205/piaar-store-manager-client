import { toPriceUnitFormat } from "../../../../utils/numberFormatUtils";
import { SubPerformanceFieldWrapper } from "../Dashboard.styled";

export default function SubPerformanceFieldView(props) {
    return (
        <SubPerformanceFieldWrapper>
            <div className='box-wrapper'>
                <div className="title-info">이번달 일일 평균</div>
                <div className='data-wrapper'>
                    <div className='data-group'>
                        <div>
                            <span>판매 매출액</span>
                        </div>
                        <div>
                            <span className='group-value'>{toPriceUnitFormat(props.monthAvgData?.payAmount || 0)}</span>
                        </div>
                    </div>
                    <div className='data-group'>
                        <div>
                            <span>판매 건</span>
                        </div>
                        <div>
                            <span className='group-value'>{props.monthAvgData?.registration || 0} 건</span>
                        </div>
                    </div>
                    <div className='data-group'>
                        <div>
                            <span>판매 수량</span>
                        </div>
                        <div>
                            <span className='group-value'>{props.monthAvgData?.unit || 0} 개</span>
                        </div>
                    </div>
                </div>
            </div>
        </SubPerformanceFieldWrapper>
    )
}