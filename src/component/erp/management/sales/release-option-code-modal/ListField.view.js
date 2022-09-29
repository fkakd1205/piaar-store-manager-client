import { ListFieldWrapper } from "./ReleaseOptionCodeModal.styled";

function HighlightedText({ text, query }) {
    if (query !== '' && text.includes(query)) {
        const parts = text.split(new RegExp(`(${query})`, 'gi'));

        return (
            <>
                {parts.map((part, index) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <mark key={index}>{part}</mark>
                    ) : (
                        part
                    ),
                )}
            </>
        );
    }

    return text;
};

export default function ListFieldView(props) {
    return (
        <ListFieldWrapper>
            {props.productOptionList?.map(r => {
                if (r.option.defaultName.includes(props.inputValue) || r.option.code.includes(props.inputValue) || r.product.defaultName.includes(props.inputValue)) {
                    return (
                        <button
                            key={r.option.id}
                            className='button-item'
                            onClick={() => props.onActionOpenConfirmModal(r)}
                        >
                            <HighlightedText
                                text={`[${r.option.code}]\n[${r.product.defaultName}]\n[${r.option.defaultName}]`}
                                query={props.inputValue}
                            />
                        </button>
                    );
                }
            })}
        </ListFieldWrapper>
    );
}