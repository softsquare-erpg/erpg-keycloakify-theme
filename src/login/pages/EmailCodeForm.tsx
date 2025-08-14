import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useState } from "react";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function EmailCodeForm(props: PageProps<Extract<KcContext, { pageId: "email-code-form.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [emailCode, setEmailCode] = useState("");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("emailCode")}
            headerNode={msg("emailOTPFormTitle")}
        >
            <form id="kc-otp-code-form" className={clsx(classes?.kcFormClass)} action={url.loginAction} method="post">
                <div className={clsx(classes?.kcFormGroupClass)}>
                    <div className={clsx(classes?.kcLabelWrapperClass, "text-center my-2")}>
                        <label htmlFor="emailCode" className={clsx(classes?.kcLabelClass)}>
                            {msg("emailOTPFormDescription")}
                        </label>
                    </div>
                    <div className={clsx(classes?.kcInputWrapperClass)}>
                        <input
                            id="emailCode"
                            name="emailCode"
                            type="text"
                            className={clsx(kcClsx("kcInputClass"), messagesPerField.existsError("emailCode") && "is-invalid")}
                            value={emailCode}
                            onChange={e => setEmailCode(e.target.value)}
                            autoFocus
                            autoComplete="off"
                            maxLength={6}
                            pattern="[0-9]{6}"
                            placeholder={msgStr("emailOTPFormPlaceholder")}
                            aria-invalid={messagesPerField.existsError("emailCode")}
                        />
                        {messagesPerField.existsError("emailCode") && (
                            <span id="input-error-email-code" aria-live="polite" className={clsx(classes?.kcInputErrorMessageClass)}>
                                {msg("emailCodeInvalid")}
                            </span>
                        )}
                    </div>
                </div>

                <div className={clsx(kcClsx("kcFormGroupClass", "kcFormSettingClass"), "my-3")}>
                    <div></div>
                    <div className={kcClsx("kcFormOptionsWrapperClass")}>
                        <span>
                            <a
                                href="#"
                                onClick={e => {
                                    e.preventDefault();

                                    const form = document.createElement("form");
                                    form.method = "POST";
                                    form.action = url.loginAction;

                                    const input = document.createElement("input");
                                    input.type = "hidden";
                                    input.name = "resend";
                                    input.value = "true";

                                    form.appendChild(input);
                                    document.body.appendChild(form);
                                    form.submit();
                                }}
                            >
                                {msg("resendCode")}
                            </a>
                        </span>
                    </div>
                </div>

                <div className={clsx(classes?.kcFormGroupClass)}>
                    <div className={kcClsx("kcFormGroupClass")}>
                        <input
                            className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                            type="submit"
                            value={msgStr("doLogIn")}
                            disabled={emailCode.length !== 6}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
