import { clsx } from "keycloakify/tools/clsx";
import { useCallback, useEffect, useRef } from "react";

export const CODE_LENGTH = 6;

export type CodeInputProps = {
    codes: string[];
    onCodesChange: (codes: string[]) => void;
    hasError: boolean;
    className?: string;
};

export default function OTPInputBoxes({
    codes,
    onCodesChange,
    hasError,
    className
}: CodeInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(CODE_LENGTH).fill(null));

    const focusInput = useCallback((index: number) => {
        if (index >= 0 && index < CODE_LENGTH) {
            inputRefs.current[index]?.focus();
        }
    }, []);

    const updateCode = useCallback(
        (index: number, value: string) => {
            if (value && !/^[0-9]$/.test(value)) return;

            const newCodes = [...codes];
            newCodes[index] = value;
            onCodesChange(newCodes);

            if (value && index < CODE_LENGTH - 1) {
                focusInput(index + 1);
            }
        },
        [codes, onCodesChange, focusInput]
    );

    const handleKeyDown = useCallback(
        (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
            const { key } = e;

            switch (key) {
                case "Backspace":
                    if (codes[index] === "" && index > 0) {
                        focusInput(index - 1);
                    } else {
                        updateCode(index, "");
                    }
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    focusInput(index - 1);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    focusInput(index + 1);
                    break;
            }
        },
        [codes, updateCode, focusInput]
    );

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

            if (pastedData.length === CODE_LENGTH) {
                const newCodes = pastedData.split("");
                onCodesChange(newCodes);
                focusInput(CODE_LENGTH - 1);
            }
        },
        [onCodesChange, focusInput]
    );

    useEffect(() => {
        focusInput(0);
    }, [focusInput]);

    const inputStyle: React.CSSProperties = {
        width: "48px",
        height: "48px",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "500",
        border: `2px solid ${hasError ? "#dc2626" : "#d1d5db"}`,
        borderRadius: "8px",
        outline: "none",
        transition: "border-color 0.2s ease"
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                marginTop: "16px"
            }}
        >
            {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <input
                    key={index}
                    ref={el => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    className={clsx(className, hasError)}
                    style={inputStyle}
                    value={codes[index] || ""}
                    onChange={e => updateCode(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    onFocus={e => e.target.select()}
                    maxLength={1}
                    autoComplete="off"
                    aria-invalid={hasError}
                    aria-label={`Digit ${index + 1} of verification code`}
                />
            ))}
        </div>
    );
}
