import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import OTPInputBoxes, { CODE_LENGTH } from "../../components/OTPInputBoxes";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type ResendLinkProps = {
    url: string;
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
};

function ResendLink({ url, children, disabled, onClick }: ResendLinkProps) {
    const handleResend = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();

            if (disabled) return;

            onClick?.();

            const form = document.createElement("form");
            form.method = "POST";
            form.action = url;

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "resend";
            input.value = "true";

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        },
        [url, disabled, onClick]
    );

    return (
        <a
            href="#"
            onClick={handleResend}
            style={{
                color: disabled ? "#999" : undefined,
                pointerEvents: disabled ? "none" : "auto",
                textDecoration: disabled ? "none" : undefined
            }}
        >
            {children}
        </a>
    );
}

export default function EmailCodeForm(props: PageProps<Extract<KcContext, { pageId: "email-code-form.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [codes, setCodes] = useState<string[]>(Array(CODE_LENGTH).fill(""));
    const [resendCooldown, setResendCooldown] = useState<number>(0);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const emailCode = codes.join("");
    const hasError = messagesPerField.existsError("emailCode");
    const isCodeComplete = emailCode.length === CODE_LENGTH;

    // Constants
    const COOLDOWN_SECONDS = 20;

    // Get last sent time from kcContext attributes (passed from backend)
    const lastSentTime = kcContext.lastSentTime ? parseInt(kcContext.lastSentTime) : null;

    // Initialize cooldown on component mount
    useEffect(() => {
        if (lastSentTime) {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastSentTime;
            const remainingCooldown = Math.max(0, COOLDOWN_SECONDS - Math.floor(timeDiff / 1000));

            if (remainingCooldown > 0) {
                setResendCooldown(remainingCooldown);
                setIsResendDisabled(true);
                startCooldownTimer(remainingCooldown);
            }
        }
    }, [lastSentTime]);

    const startCooldownTimer = useCallback((initialSeconds: number) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        let seconds = initialSeconds;
        setResendCooldown(seconds);
        setIsResendDisabled(true);

        intervalRef.current = setInterval(() => {
            seconds -= 1;
            setResendCooldown(seconds);

            if (seconds <= 0) {
                setIsResendDisabled(false);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        }, 1000);
    }, []);

    const handleResendClick = useCallback(() => {
        if (!isResendDisabled) {
            startCooldownTimer(COOLDOWN_SECONDS);
        }
    }, [isResendDisabled, startCooldownTimer]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const getResendText = useCallback(() => {
        if (isResendDisabled && resendCooldown > 0) {
            return `${msgStr("resendCode")} (${resendCooldown}s)`;
        }
        return msgStr("resendCode");
    }, [isResendDisabled, resendCooldown, msgStr]);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasError}
            headerNode={msg("emailOTPFormTitle")}
        >
            <form id="kc-otp-code-form" className={clsx(classes?.kcFormClass)} action={url.loginAction} method="post">
                <input type="hidden" name="emailCode" value={emailCode} />

                <div className={clsx(classes?.kcFormGroupClass)}>
                    <div className={clsx(classes?.kcLabelWrapperClass, "text-center my-2")}>
                        <label className={clsx(classes?.kcLabelClass)}>{msg("emailOTPFormDescription")}</label>
                    </div>

                    <div className={clsx(classes?.kcInputWrapperClass)}>
                        <OTPInputBoxes codes={codes} onCodesChange={setCodes} hasError={hasError} className={kcClsx("kcInputClass")} />

                        {hasError && (
                            <div className="text-center mt-2">
                                <span id="input-error-email-code" aria-live="polite" className={clsx(classes?.kcInputErrorMessageClass)}>
                                    {/* Show specific error message if it's a cooldown error */}
                                    {messagesPerField.get("resend.cooldown.message") || msg("emailCodeInvalid")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={clsx(kcClsx("kcFormGroupClass", "kcFormSettingClass"), "my-3")}>
                    <div></div>
                    <div className={kcClsx("kcFormOptionsWrapperClass")}>
                        <span>
                            <ResendLink url={url.loginAction} disabled={isResendDisabled} onClick={handleResendClick}>
                                {getResendText()}
                            </ResendLink>
                        </span>
                    </div>
                </div>

                <div className={clsx(classes?.kcFormGroupClass)}>
                    <div className={kcClsx("kcFormGroupClass")}>
                        <input
                            className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                            type="submit"
                            value={msgStr("doLogIn")}
                            disabled={!isCodeComplete}
                        />
                    </div>
                </div>

                {/* Optional: Show cooldown info */}
                {isResendDisabled && resendCooldown > 0 && (
                    <div className="text-center mt-2 text-sm text-gray-500">{msg("resendCooldownInfo", resendCooldown.toString())}</div>
                )}
            </form>
        </Template>
    );
}
