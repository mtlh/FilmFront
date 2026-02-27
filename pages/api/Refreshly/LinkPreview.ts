import { getLinkPreview } from "link-preview-js";
import { NextApiRequest, NextApiResponse } from "next";

// export const config = {
//     runtime: "experimental-edge",
// };

export default async function LinkPreview(req: NextApiRequest, res: NextApiResponse) {

    const link = req.query.link?.toString()!;
    try {
        const data = await getLinkPreview(link, {
            imagesPropertyType: "og", // fetches only open-graph images
            headers: {
                "user-agent": "googlebot", // fetches with googlebot crawler user agent
                "Accept-Language": "en-US", // fetches site for French language
                // ...other optional HTTP request headers
            },
            timeout: 1000
        })
        res.status(200).json(data);
    } catch {
        res.status(200).json({});
    }
}