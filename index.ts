/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Settings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

let style: HTMLStyleElement;

function setCss() {
    style.textContent = `
        .imageWrapper_d4597d img,
        .imageWrapper_d4597d video {
            filter: blur(${Settings.plugins.BlurMedias.blurAmount}px);
            transition: filter 0.2s;
        }

        .imageWrapper_d4597d:hover img,
        .imageWrapper_d4597d:hover video,
        .imageWrapper_d4597d [class^=wrapperPlaying] video,
        .imageWrapper_d4597d [class^=wrapperControlsHidden] video,
        .imageWrapper_d4597d:hover [aria-label="GIF"] {
            filter: unset !important; 
        }


    `;
}


export default definePlugin({
    name: "BlurMedias",
    description: "Blur all medias until hovered",
    authors: [Devs.walkoud],

    patches: [
        {
            find: ".embedWrapper,embed",
            replacement: [{
                match: /\.embedWrapper(?=.+?channel_id:(\i)\.id)/g,
                replace: "$&+($1.nsfw?' img':'')"
            }]
        }
    ],

    options: {
        blurAmount: {
            type: OptionType.NUMBER,
            description: "Blur Amounts",
            default: 10,
            onChange: setCss
        }
    },

    start() {
        style = document.createElement("style");
        style.id = "VcBlurMedias";
        document.head.appendChild(style);

        setCss();
    },

    stop() {
        style?.remove();
    }
});