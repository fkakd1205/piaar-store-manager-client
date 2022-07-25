import { Dialog } from '@mui/material';
import { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`

`;

const TitleBox = styled.div`
    padding: 10px 10px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
`;

const MessageBox = styled.div`
    padding: 20px 10px 30px 10px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;

    .info-text {
        color: var(--erp-main-color);
        text-align: left;
        padding: 0 10px;
        font-size: 12px;
    }
`;

const MemoBox = styled.div`
    padding: 15px;
    font-size: 14px;
    display: grid;
    width: 100%;
    grid-template-columns: 100px auto;
    align-items: center;

    .form-title {
        padding: 10px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
    }

    input {
        height: 30px;
        border: 1px solid #bdbdbd;
        padding: 10px;
        font-size: 14px;
        box-sizing: border-box;
        border-radius: 3px;
    }
`;

const ButtonWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
`;

const ButtonBox = styled.div`
    .button-item{
        width: 100%;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 500;
        background: white;
        border: 1px solid #00000000;
        cursor: pointer;

        &:hover{
            background:#e1e1e160;
        }
    }
`;

const ConfirmModalComponent = ({ open, fullWidth, maxWidth, onConfirm, _onSubmit, onClose, title, message, memo, ...props }) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [confirmInputValue, dispatchConfirmInputValue] = useReducer(confirmInputValueReducer, initialConfirmInputValue);

    useEffect(() => {
        setButtonDisabled(false);
        dispatchConfirmInputValue({
            type: 'SET_DATA',
            payload: {
                name: 'memo',
                value: ''
            }
        });
    }, [open])

    const _onConfirm = () => {
        setButtonDisabled(true);
        onConfirm();
    }

    const onChangeInputValue = (e) => {
        dispatchConfirmInputValue({
            type: 'CHANGE_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        })
    }

    return (
        <>
            <Dialog
                open={open || false}
                fullWidth={fullWidth || true}
                maxWidth={maxWidth || 'xs'}
                onClose={(e) => onClose(e) || {}}
            >
                <TitleBox>
                    {title || '확인메세지'}
                </TitleBox>
                <MessageBox>
                    {message || '정말로 판매 전환 하시겠습니까?'}
                </MessageBox>
                {memo &&
                    <form onSubmit={(e) => _onSubmit(e, confirmInputValue.memo)}>
                        <MemoBox>
                            <div className='form-title'>메모</div>
                            <input placeholder='재고반영 메모를 입력해주세요.' name='memo' onChange={onChangeInputValue} value={confirmInputValue?.memo || ''}></input>
                        </MemoBox>
                        <ButtonWrapper>
                            <ButtonBox>
                                <button
                                    className='button-item'
                                    style={{ color: '#d15120' }}
                                    onClick={(e) => onClose(e) || {}}
                                >취소</button>
                            </ButtonBox>
                            <ButtonBox>
                                <button
                                    type='submit'
                                    className='button-item'
                                    style={{ color: '#2d7ed1' }}
                                    disabled={buttonDisabled}
                                >확인</button>
                            </ButtonBox>
                        </ButtonWrapper>
                    </form>
                }
                {!memo &&
                    <>
                        <ButtonWrapper>
                            <ButtonBox>
                                <button
                                    className='button-item'
                                    style={{ color: '#d15120' }}
                                    onClick={() => onClose() || {}}
                                >취소</button>
                            </ButtonBox>
                            <ButtonBox>
                                <button
                                    className='button-item'
                                    style={{ color: '#2d7ed1' }}
                                    onClick={(e) => _onConfirm(e)}
                                    disabled={buttonDisabled}
                                >확인</button>
                            </ButtonBox>
                        </ButtonWrapper>
                    </>
                }
            </Dialog>
        </>
    );
}
export default ConfirmModalComponent;

const initialConfirmInputValue = null;

const confirmInputValueReducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;
        case 'CHANGE_DATA':
            return {
                ...state,
                [action.payload.name] : action.payload.value
            }
        case 'CLEAR':
            return initialConfirmInputValue;
    }
}