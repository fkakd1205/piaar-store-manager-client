import styled from "styled-components";

const Container = styled.div`
    border-bottom: 1px solid #444;
    padding: 0 20px;

    .checkbox-wrapper {
        padding: 10px 0;
    }
`;

const SelectorWrapper = styled.div`
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    width: 100%;

    .select-item {
        width: 250px;
        height: 48px;
        padding: 0 10px;
        border: 1px solid var(--defaultBorderColor);
        border-radius: 5px;
        font-size: 14px;
        -webkit-appearance: none;
        -moz-appearance: none; 
        appearance: none;
        background:url('/assets/icon/down_arrow_gray_icon.png') no-repeat right 5px center;

        &:focus{
            outline: none;
        }
    }

    .input-el {
        width: 280px;
        font-size: 14px;
    }

    .button-el {
        width: 50px;
        height: 48px;
        border: 1px solid var(--defaultBorderColor);
        background-color: var(--defaultButtonColor);
        border-radius: 5px;
        margin: 0 5px;
        transition: 0.1s;

        :hover {
            background-color: var(--defaultHoverColor);
        }
    }
`;

const CheckBoxFieldWrapper = styled.div`
    padding: 2px 0;
    font-weight: 600;

    .checkbox-group {
        display: inline-block;
        
        :hover {
            cursor: pointer;
        }
    }

    .checkbox-input {
        margin: 5px;
    }

    .out-of-stock {
        color: #ff0000;
    }
`;

export {
    Container,
    SelectorWrapper,
    CheckBoxFieldWrapper
}