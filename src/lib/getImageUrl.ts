export function getImageUrl(
    imagePath: string | null | undefined
): string {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl || !imagePath) {
        return "";
    }

    // public/images/products 配下の固定画像
    if (imagePath.startsWith("images/")) {
        return `${apiBaseUrl}/${imagePath}`;
    }

    // storage/app/public 配下の投稿画像
    return `${apiBaseUrl}/storage/${imagePath}`;
}