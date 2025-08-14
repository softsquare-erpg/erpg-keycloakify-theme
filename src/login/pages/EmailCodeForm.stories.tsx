import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "email-code-form.ftl" });

const meta = {
    title: "login/EmailCodeForm",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (field: string) => field === "emailCode",
                    get: (field: string) => (field === "emailCodeInvalid" ? "Invalid email code" : ""),
                    exists: (field: string) => field === "emailCode",
                    printIfExists: (field: string) => (field === "emailCodeInvalid" ? "Invalid email code" : "")
                },
                message: {
                    type: "error",
                    summary: "Invalid email code. Please try again."
                },
                isAppInitiatedAction: false,
                emailCodeSent: true,
                resendAvailable: true,
                codeLength: 6,
                expirationTime: 300
            }}
        />
    )
};

export const ThaiLanguage: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                locale: {
                    currentLanguageTag: "th",
                    supported: [
                        { languageTag: "en", label: "English" },
                        { languageTag: "th", label: "ไทย" }
                    ]
                }
            }}
        />
    )
};

export const ThaiLanguageWithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                locale: {
                    currentLanguageTag: "th",
                    supported: [
                        { languageTag: "en", label: "English" },
                        { languageTag: "th", label: "ไทย" }
                    ]
                },
                messagesPerField: {
                    existsError: (field: string) => field === "emailCode",
                    get: (field: string) => (field === "emailCodeInvalid" ? "รหัส OTP ไม่ถูกต้อง" : ""),
                    exists: (field: string) => field === "emailCode",
                    printIfExists: (field: string) => (field === "emailCodeInvalid" ? "รหัส OTP ไม่ถูกต้อง" : "")
                },
                message: {
                    type: "error",
                    summary: "รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"
                },
                isAppInitiatedAction: false,
                emailCodeSent: true,
                resendAvailable: true,
                codeLength: 6,
                expirationTime: 300
            }}
        />
    )
};
