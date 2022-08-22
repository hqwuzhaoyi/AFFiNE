import { Protocol } from '@toeverything/datasource/db-service';
import {
    AsyncBlock,
    BaseView,
    SelectBlock,
} from '@toeverything/framework/virgo';
import { FigmaView } from './FigmaView';
import { Block2HtmlProps } from '../../utils/commonBlockClip';

export class FigmaBlock extends BaseView {
    public override selectable = true;
    public override activatable = false;
    type = Protocol.Block.Type.figma;
    View = FigmaView;

    override html2block(
        el: Element,
        parseEl: (el: Element) => any[]
    ): any[] | null {
        const tag_name = el.tagName;
        if (tag_name === 'A' && el.parentElement?.childElementCount === 1) {
            const href = el.getAttribute('href');
            const allowedHosts = ['www.figma.com'];
            const host = new URL(href).host;

            if (allowedHosts.includes(host)) {
                return [
                    {
                        type: this.type,
                        properties: {
                            // TODO: Not sure what value to fill for name
                            embedLink: {
                                name: this.type,
                                value: el.getAttribute('href'),
                            },
                        },
                        children: [],
                    },
                ];
            }
        }

        return null;
    }
    override async block2html({ block }: Block2HtmlProps) {
        const figmaUrl = block.getProperty('embedLink')?.value;
        return `<p><a href="${figmaUrl}">${figmaUrl}</a></p>`;
    }
}
