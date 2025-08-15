import type { ClassKey } from "keycloakify/login";
import DefaultPage from "keycloakify/login/DefaultPage";
import { Suspense, lazy, useEffect } from "react";
import type { KcContext } from "./KcContext";
import Template from "./Template";
import { useI18n } from "./i18n";

import { useLoading } from "../context/LoadingContext";
import "./login.css";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Login = lazy(() => import("./pages/Login"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));
const EmailCodeForm = lazy(() => import("./pages/EmailCodeForm"));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;
    const { i18n } = useI18n({ kcContext });
    const { show, hide, isLoading } = useLoading();

    const handleFormSubmit = (e: Event) => {
        const form = e.target as HTMLFormElement;

        if (form.tagName === "FORM") {
            requestAnimationFrame(() => show());
        }
    };

    useEffect(() => {
        if (kcContext.message && isLoading) {
            hide();
        }

        document.addEventListener("submit", handleFormSubmit, true);
        return () => document.removeEventListener("submit", handleFormSubmit, true);
    }, [kcContext.message, isLoading, hide]);

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "email-code-form.ftl":
                        return (
                            <EmailCodeForm
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {
    kcFormGroupClass: "form-group",
    kcInputGroup: "input-group",
    kcInputClass: "form-control text-secondary",
    kcLabelClass: "text-secondary",
    kcInputErrorMessageClass: "invalid-feedback d-block",
    kcButtonBlockClass: "btn btn-block",
    kcFormPasswordVisibilityButtonClass: "btn btn-outline-secondary border-start-0 py-0",
    kcFormPasswordVisibilityIconHide: "bi bi-eye-slash-fill",
    kcFormPasswordVisibilityIconShow: "bi bi-eye-fill",
    kcFormSocialAccountListButtonClass: "d-block btn bg-body-tertiary"
} satisfies { [key in ClassKey]?: string };
