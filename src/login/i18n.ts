/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            resendCode: "Resend Code",
            emailAuthenticatorDisplayName: "Email Authenticator",
            emailCodeInvalid: "Invalid OTP code",
            emailCodeExpired: "Email code has expired",
            emailOTPFormTitle: "Please enter the one time passwordto verify your account",
            emailOTPFormDescription:
                "Please enter the six-digit code that was delivered to your email.",
            emailOTPFormPlaceholder: "Enter Verification Code"
        },
        th: {
            resendCode: "ส่งรหัสอีกครั้ง",
            emailAuthenticatorDisplayName: "ยืนยันตัวตนทางอีเมล",
            emailCodeInvalid: "รหัส OTP ไม่ถูกต้อง",
            emailCodeExpired: "รหัสอีเมลหมดอายุแล้ว",
            emailOTPFormTitle: "กรุณากรอกรหัสผ่านใช้ครั้งเดียวเพื่อยืนยันบัญชีของคุณ",
            emailOTPFormDescription: "กรุณากรอกรหัสหกหลักที่ส่งไปยังอีเมลของคุณ",
            emailOTPFormPlaceholder: "ป้อนรหัสยืนยัน"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
