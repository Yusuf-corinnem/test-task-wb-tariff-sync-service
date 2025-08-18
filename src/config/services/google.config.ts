import env from "../env/env";

function normalizePrivateKey(): string {
	let raw = env.GOOGLE_PRIVATE_KEY || "";
	const b64 = env.GOOGLE_PRIVATE_KEY_BASE64 || "";
	if (b64) {
		try {
			raw = Buffer.from(b64, 'base64').toString('utf8');
		} catch {}
	}
	// Удаляем обрамляющие кавычки и нормализуем переводы строк
	return raw
		.replace(/^"|"$/g, "")
		.replace(/\r\n/g, "\n")
		.replace(/\r/g, "\n")
		.replace(/\\n/g, "\n");
}

export const googleConfig = {
	clientEmail: env.GOOGLE_CLIENT_EMAIL || "",
	privateKey: normalizePrivateKey(),
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
};

export default googleConfig;


