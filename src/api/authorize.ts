import { G } from "react-native-svg";
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_AUTH_URL } from "../config";
export async function GET(request: Request) {
    if (!GOOGLE_ANDROID_CLIENT_ID) {
        return Response.json({ error: 'Google Android Client ID is not set' }, { status: 500 });
    }
    const url = new URL(request.url);
    let idpClientId: string;
    const internalClient = url.searchParams.get("client_id");
    const redirectUri = url.searchParams.get("redirect_uri");

    let state = "mobile" + "|" + url.searchParams.get("state");
    if (internalClient === "google") {
        idpClientId = GOOGLE_ANDROID_CLIENT_ID;
    } else {
        return Response.json({ error: 'Unsupported client_id' }, { status: 400 });
    }

    const param = new URLSearchParams({
        client_id: idpClientId,
        redirect_uri: redirectUri || "",
        response_type: 'code',
        scope: url.searchParams.get("scope") || 'identity',
        state: state,
        prompt: 'select_account',
    });
    return Response.redirect(GOOGLE_AUTH_URL + "?" + param.toString());
}


