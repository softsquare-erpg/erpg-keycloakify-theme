import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { I18n } from "../i18n";
import { KcContext } from "../KcContext";

export default function PasswordWrapper(props: {
    kcClsx: KcClsx;
    i18n: I18n;
    messagesPerField: KcContext["messagesPerField"];
    usernameHidden?: boolean;
    msg: I18n["msg"];
    kcSanitize: typeof kcSanitize;
    passwordValue?: string;
}) {
    const { kcClsx, messagesPerField, usernameHidden, msg, kcSanitize, passwordValue } =
        props;
    const passwordInputId = "password";
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId
    });

    return (
        <div className={kcClsx("kcFormGroupClass")}>
            <div className={clsx(kcClsx("kcInputGroup"), "has-validation")}>
                <div className="form-floating">
                    <input
                        tabIndex={2}
                        id={passwordInputId}
                        className={clsx(
                            "rounded-start",
                            kcClsx("kcInputClass"),
                            messagesPerField.existsError("username", "password") &&
                                "is-invalid"
                        )}
                        name="password"
                        type={isPasswordRevealed ? "text" : "password"}
                        autoComplete="off"
                        placeholder={`${msg("password")}`}
                        aria-describedby="input-error input-error-pwdfeedback"
                        aria-invalid={
                            messagesPerField.existsError("username", "password")
                                ? true
                                : undefined
                        }
                        defaultValue={passwordValue}
                    />
                    <label htmlFor={passwordInputId} className={kcClsx("kcLabelClass")}>
                        {msg("password")}
                    </label>
                    {usernameHidden &&
                        messagesPerField.existsError("username", "password") && (
                            <div
                                id="input-error-pwdfeedback"
                                className={clsx(
                                    kcClsx("kcInputErrorMessageClass"),
                                    "input-error-pwdfeedback"
                                )}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(
                                        messagesPerField.getFirstError(
                                            "username",
                                            "password"
                                        )
                                    )
                                }}
                            />
                        )}
                </div>
                <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    aria-label={`${msg(isPasswordRevealed ? "hidePassword" : "showPassword")}`}
                    aria-controls={passwordInputId}
                    aria-describedby="password-icon password-visiable-btn"
                    onClick={toggleIsPasswordRevealed}
                    tabIndex={4}
                >
                    <i
                        className={
                            isPasswordRevealed ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
                        }
                        aria-hidden="true"
                        id="password-icon"
                    ></i>
                </button>
            </div>
        </div>
    );
}
