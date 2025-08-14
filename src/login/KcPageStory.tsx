import { createGetKcContextMock } from "keycloakify/login/KcContext";
import type { DeepPartial } from "keycloakify/tools/DeepPartial";
import { LoadingProvider } from "../context/LoadingContext";
import { kcEnvDefaults, themeNames } from "../kc.gen";
import type {
    KcContext,
    KcContextExtension,
    KcContextExtensionPerPage
} from "./KcContext";
import KcPage from "./KcPage";

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    properties: {
        ...kcEnvDefaults
    }
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {
    "email-code-form.ftl": {
        codeLength: 6,
        emailCodeSent: true,
        expirationTime: 300,
        resendAvailable: true
    }
};

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {},
    overridesPerPage: {}
});

export function createKcPageStory<PageId extends KcContext["pageId"]>(params: {
    pageId: PageId;
}) {
    const { pageId } = params;

    function KcPageStory(props: {
        kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>>;
    }) {
        const { kcContext: overrides } = props;

        const kcContextMock = getKcContextMock({
            pageId,
            overrides
        });

        return (
            <LoadingProvider>
                <KcPage kcContext={kcContextMock} />
            </LoadingProvider>
        );
    }

    return { KcPageStory };
}
