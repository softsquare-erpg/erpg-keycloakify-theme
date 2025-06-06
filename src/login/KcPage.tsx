import type { ClassKey } from "keycloakify/login";
import DefaultPage from "keycloakify/login/DefaultPage";
import { Suspense, lazy, useEffect } from "react";
import type { KcContext } from "./KcContext";
import Template from "./Template";
import { useI18n } from "./i18n";

import { useLoading } from "../providers/LoadingProvider";
import "./login.css";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const Login = lazy(() => import("./pages/Login"));

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const { show } = useLoading();

    useEffect(() => {
        const handleSubmit = (e: Event) => {
            const form = e.target as HTMLFormElement;
            if (form.tagName === "FORM") {
                requestAnimationFrame(() => show());
            }
        };
        document.addEventListener("submit", handleSubmit, true);
        return () => document.removeEventListener("submit", handleSubmit, true);
    }, []);

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
    kcInputErrorMessageClass: "invalid-feedback",
    kcButtonBlockClass: "btn pf-m-block",
    kcFormPasswordVisibilityButtonClass: "btn btn-outline-secondary border-start-0 py-0",
    kcFormPasswordVisibilityIconHide: "bi bi-eye-slash-fill",
    kcFormPasswordVisibilityIconShow: "bi bi-eye-fill"
} satisfies { [key in ClassKey]?: string };
