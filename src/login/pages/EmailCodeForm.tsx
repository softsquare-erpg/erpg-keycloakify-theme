import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useCallback, useState } from "react";
import OTPInputBoxes, { CODE_LENGTH } from "../../components/OTPInputBoxes";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type ResendLinkProps = {
    url: string;
    children: React.ReactNode;
};

function ResendLink({ url, children }: ResendLinkProps) {
    const handleResend = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();

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
        [url]
    );

    return (
        <a href="#" onClick={handleResend}>
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
    const emailCode = codes.join("");
    const hasError = messagesPerField.existsError("emailCode");
    const isCodeComplete = emailCode.length === CODE_LENGTH;

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
                                    {msg("emailCodeInvalid")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={clsx(kcClsx("kcFormGroupClass", "kcFormSettingClass"), "my-3")}>
                    <div></div>
                    <div className={kcClsx("kcFormOptionsWrapperClass")}>
                        <span>
                            <ResendLink url={url.loginAction}>{msg("resendCode")}</ResendLink>
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
            </form>
        </Template>
    );
}
